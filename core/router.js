
import Inferno from 'inferno';

import { Route as InfernoRoute, Router as InfernoRouter, Link as InfernoLink, browserHistory } from 'inferno-router';
import { Provider } from 'inferno-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate, getStoredState } from 'redux-persist';
import thunk from 'redux-thunk';

import NotFound from './components/404';
import Wrapper from './components/wrapper';

import internalReducers from './reducers';

import offline from './offline';
import { exec } from './utils';

const defaults = {
  string: '',
  object: {},
  array : [],
};

const config = {
  keyPrefix: 'weave:',
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export async function redux(reducers) {
  const reducer = combineReducers(
    typeof reducers === 'object' && reducers != null
    ? { ...reducers, ...internalReducers }
    : internalReducers
  );
  const loaders = [
    autoRehydrate(),
    applyMiddleware(thunk),
  ];
  if (isBrowser()) {
    loaders.push(window.devToolsExtension ? window.devToolsExtension() : f => f);
  }
  const store = compose(...loaders)(createStore)(reducer);
  if (isBrowser()) {
    config.storage = require('localforage');
    persistStore(store, config);
  }
  await getStoredState(config);
  if (isBrowser()) offline();
  return store;
}

async function routes(routes, store, ctx) {
  let wildcard = false;
  if (!Array.isArray(routes)) routes = defaults.array;
  const res = await Promise.all(routes.map(async ({ attrs: { path, component } }, index) => {
    const view = await patch(component, path, store, ctx);
    if ( !wildcard && path.indexOf('*') > -1 ) wildcard = true;
    return <InfernoRoute key={index} path={path} component={view} />
  }))
  if (!wildcard) res.push(<InfernoRoute path={"*"} component={NotFound} />);
  return res;
}

async function initial(Component, path, store, ctx) {
  const { location: { pathname } } = ctx;
  if (!exec(pathname, path) || !Component) return { props: defaults.object, title: defaults.string, metas: defaults.object };
  let props = await (typeof Component.getInitialProps === 'function' ? Component.getInitialProps(ctx) : defaults.object);
  if (typeof props !== 'object' || props === null) props = defaults.object;
  let title = await (typeof Component.getTitle === 'function' ? Component.getTitle(props) : defaults.string);
  if (typeof title !== 'string') title = defaults.string;
  let metas = await (typeof Component.getMetaTags === 'function' ? Component.getMetaTags(props) : defaults.array);
  if (!Array.isArray(metas)) metas = defaults.array;
  store.dispatch({ type: 'WEAVE_TITLE_SET', title });
  store.dispatch({ type: 'WEAVE_META_REPLACE', metas });
  return props;
}

async function patch(Component, path, store, ctx) {
  const props = await initial(Component, path, store, ctx);
  return () => isBrowser() ? <Wrapper view={Component} /> : <Component initialized={true} { ...props } { ...ctx } />;
}

export function Router({ children }) {
  return children.map((route, index) => route);
}

export function Route(props, context) {
  return <InfernoRoute { ...props } context={context} />
}

export function Link(props, context) {
  return <InfernoLink { ...props } context={context} />
}

export default async function(App, ctx) {
  const { location } = ctx;
  const root = new App(ctx);
  const store = await redux(root.attrs && root.attrs.reducers);
  const children = await routes(root.children, store, ctx);
  const props = { history: browserHistory };
  if (!isBrowser()) props.url = location.pathname;
  const app = <Provider store={ store }>
    <InfernoRouter { ...props }>
      {children}
    </InfernoRouter>
  </Provider>
  const { title, meta } = store.getState();
  return { app, meta, title };
}
