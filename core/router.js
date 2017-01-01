
import Inferno from 'inferno';
import { Provider } from 'inferno-redux';

import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate, getStoredState } from 'redux-persist';
import thunk from 'redux-thunk';

import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

import { Router as IRouter, Route as IRoute, IndexRoute as IIndexRoute } from './route';
import { match, strip } from './utils';
import internalReducers from './reducers';

import NotFound from './components/404';

const defaults = {
  string: '',
  object: {},
  array : [],
};

const config = {
  keyPrefix: 'weave:',
};

let _history = null;
let _store = null;

function isBrowser() {
  return typeof window !== 'undefined';
}

function createHistory(props = { }) {
  if (isBrowser()) {
    if (!_history) _history = createBrowserHistory(props);
    return _history;
  }
  return createMemoryHistory(props);
}

async function redux(reducers) {
  if (isBrowser() && _store) {
    return _store;
  }
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
  if (isBrowser()) {
    _store = store;
    return _store;
  }
  return store;
}

async function patch(route, store, ctx) {
  const { props: { path, component, children } } = route;
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

async function initialize(component, ctx) {
  if ( typeof component.getInitialProps === 'function' ) {
    const props = await component.getInitialProps(ctx);
    return typeof props === 'object' && props !== null ? props : defaults.object;
  }
  return defaults.object;
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

export function To(e) {
  e.preventDefault && e.preventDefault();
  const { context } = this;
  if ( !context ) return;
  const { router: { push } } = context;
  if ( !push ) return;
  const parser = document.createElement('a');
  parser.href = e.target.href;
  return push(parser.pathname);
}

export function Link(props, context) {
  return <a { ...props } onClick={To.bind({ props, context })} />
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
  const { components, params } = match(children, pathname);
  const props = typeof window === 'undefined'
    ? await Promise.all(components.map(async (component) => await initialize(component, ctx)))
    : ((Array.isArray(window._$) && window._$.length > 0 ? window._$ : await Promise.all(components.map(async (component) => await initialize(component, ctx)))) || defaults.array);
  const app = <IRouter history={history} components={components} props={props} params={params} ctx={ctx}>
    {children}
  </IRouter>
  return { app, store, props };
}

if (module.hot) {
  module.hot.accept();
}
