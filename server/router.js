
import Inferno from 'inferno';
import App from 'weave-app';

import { Route as InfernoRoute, Router as InfernoRouter, browserHistory } from 'inferno-router';
import { Provider } from 'inferno-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate, getStoredState } from 'redux-persist';

import { exec } from './utils';

const defaults = {
  string: '',
  object: {},
  array : [],
  routes: [<InfernoRoute path={"/*"} component={RoutesNotFound} />],
};

const config = {
  keyPrefix: 'weave:',
}
if (__NODECLIENT__) config.storage = require('localforage');

function RoutesNotFound() {
  return <div>Not routes are found</div>
}

export async function redux(reducers) {
  const reducer = combineReducers(typeof reducers === 'object' && reducers != null ? reducers : defaults.object);
  const loaders = [ autoRehydrate() ];
  if (typeof window !== 'undefined') loaders.push(window.devToolsExtension ? window.devToolsExtension() : f => f);
  const store = compose(...loaders)(createStore)(reducer);
  if (__NODECLIENT__) persistStore(store, config);
  await getStoredState(config);
  return store;
}

async function routes(routes = defaults.routes, ctx) {
  const res = [];
  await routes.map(async ({ attrs: { path, component } }, index) => {
    res.push(<InfernoRoute key={index} path={path} component={await render(component, path, ctx)} />)
  })
  return res;
}

async function initial(Component, path, ctx) {
  const { location: { pathname } } = ctx;
  if (!exec(pathname, path)) return defaults.object;
  if (!Component) return defaults.object;
  return await (typeof Component.getInitialProps === 'function' ? Component.getInitialProps(ctx) : defaults.object);
}

async function render(Component, path, ctx) {
  const props = await initial(Component, path, ctx);
  return function() {
    return <Component { ...props } { ...ctx } />
  }
}

export function Router({ children }) {
  return children.map((route, index) => route);
}

export function Route(props, context) {
  return <InfernoRoute { ...props } context={context} />
}

export default async function(ctx) {
  const { location } = ctx;
  const root = new App(ctx);
  const store = await redux(root.attrs && root.attrs.reducers);
  const children = await routes(root.children, ctx);
  return <Provider store={ store }>
    <InfernoRouter url={ location.pathname } history={ browserHistory }>
      {children}
    </InfernoRouter>
  </Provider>
}
