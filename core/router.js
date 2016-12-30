
import Inferno from 'inferno';
import { Provider } from 'inferno-redux';

import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate, getStoredState } from 'redux-persist';
import thunk from 'redux-thunk';

import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

import { Router as IRouter, Route as IRoute, IndexRoute as IIndexRoute } from './route';
import { strip } from './utils';

import NotFound from './components/404';

import internalReducers from './reducers';

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

function createHistory(props = { }) {
  return isBrowser() ? createBrowserHistory(props) : createMemoryHistory(props);
}

async function redux(reducers) {
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
  return store;
}

async function patch(route, store, ctx) {
  const { type, props: { path, component, children } } = route;
  const args = { component };
  if ( typeof path === 'string' && path.trim().length > 0 ) {
    args.path = strip(path);
  } else {
    args.path = -1;
  }
  if ( children ) {
    if ( Array.isArray(children) ) {
      args.children = await patches(children, store, ctx);
    } else {
      args.children = await patch(children, store, ctx);
    }
  }
  return <IRoute { ...args } />
}

async function patches(routes, store, ctx) {
  return await Promise.all(routes.map(async (route) => {
    return await patch(route, store, ctx);
  }));
}

async function routes(router, store, ctx) {
  if ( !router || typeof router !== 'object' ) return defaults.array;
  const { props: { component, children } } = router;
  if ( !children ) return null;
  if ( Array.isArray(children) ) return await patches(children, store, ctx);
  return await patch(children, store, ctx);
}

export function Router({ children }) {
  if ( typeof children === 'undefined' || children === null ) {
    return [ <IRoute path="*" component={NotFound} /> ];
  }
  if ( !Array.isArray(children) ) {
    return [ children ];
  }
  return children.map(route => route);
}

export function Route(props, context) {
  return <IRoute { ...props } context={context} />
}

export function IndexRoute(props, context)  {
  return <IIndexRoute { ...props } path="/" context={context} />
}

export default async function(App, ctx) {
  const { location: { pathname } } = ctx;
  const root = new App(ctx);
  const store = await redux(root.props && root.props.reducers);
  const children = await routes(root, store, ctx);
  const history = createHistory({
    initialEntries: [ pathname ],
    initialIndex: 0,
  });
  const app = <IRouter history={history}>
    {children}
  </IRouter>
  return { app, store };
}
