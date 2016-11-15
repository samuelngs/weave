
import Inferno from 'inferno';
import App from 'weave-app';
import Uri from 'route-parser';

import {
  Route as InfernoRoute,
  Router as InfernoRouter,
  browserHistory,
} from 'inferno-router';

import { exec } from './utils';

const defaults = {
  string: '',
  object: {},
  array : [],
  routes: [<InfernoRoute path={"/*"} component={RoutesNotFound} />],
};

function RoutesNotFound() {
  return <div>Not routes are found</div>
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
  const children = await routes(root.children, ctx);
  return <InfernoRouter url={location.pathname} history={browserHistory}>
    {children}
  </InfernoRouter>
}
