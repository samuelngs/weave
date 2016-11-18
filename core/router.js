
import Inferno from 'inferno';

import { Route as InfernoRoute, Router as InfernoRouter, browserHistory } from 'inferno-router';
import { Provider } from 'inferno-redux';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate, getStoredState } from 'redux-persist';
import thunk from 'redux-thunk';

import offline from './offline';
import { exec } from './utils';

const defaults = {
  string: '',
  object: {},
  array : [],
  routes: [<InfernoRoute path={"*"} component={RoutesNotFound} />],
};

const config = {
  keyPrefix: 'weave:',
}
if (typeof window !== 'undefined') config.storage = require('localforage');

offline();

function RoutesNotFound() {
  return <div>No matching route found</div>
}

export async function redux(reducers) {
  const reducer = combineReducers(typeof reducers === 'object' && reducers != null ? reducers : defaults.object);
  const loaders = [
    autoRehydrate(),
    applyMiddleware(thunk),
  ];
  if (typeof window !== 'undefined') loaders.push(window.devToolsExtension ? window.devToolsExtension() : f => f);
  const store = compose(...loaders)(createStore)(reducer);
  if (typeof window !== 'undefined') persistStore(store, config);
  await getStoredState(config);
  return store;
}

async function routes(routes = defaults.routes, ctx) {
  const res = await Promise.all(routes.map(async ({ attrs: { path, component } }, index) => {
    const view = await patch(component, path, ctx)
    return <InfernoRoute key={index} path={path} component={view} />
  }))
  return res;
}

async function initial(Component, path, ctx) {
  const { location: { pathname } } = ctx;
  if (!exec(pathname, path)) return defaults.object;
  if (!Component) return defaults.object;
  return await (typeof Component.getInitialProps === 'function' ? Component.getInitialProps(ctx) : defaults.object);
}

async function patch(Component, path, ctx) {
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

export default async function(App, ctx) {
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
