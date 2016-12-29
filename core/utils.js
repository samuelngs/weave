
const unmatch = { components: [ ], params: { } };

function matchRoute(route, parts, matched) {
  let match = false;
  const { props: { path, children, component } } = route;
  const [ segment, ...rest ] = parts;
  if ( typeof path !== 'string' && path !== -1 ) {
    return false;
  }
  if ( path === -1 ) {
    if ( typeof component === 'function' ) {
      matched.components.push(component);
    }
    match = true;
  } else if ( typeof path === 'string' ) {
    if ( path.charAt(0) === ':' ) {
      const param = path.replace(/(^\:|[+*?]+$)/g, '');
      matched.params[param] = segment;
      if ( typeof component === 'function' ) {
        matched.components.push(component);
      }
      match = true;
    }
    if ( path === segment ) {
      if ( typeof component === 'function' ) {
        matched.components.push(component);
      }
      match = true;
    }
    if ( path === '*' ) {
      if ( typeof component === 'function' ) {
        matched.components.push(component);
      }
      match = true;
    }
    if ( rest.length === 0 && match === true ) {
      return matched;
    }
  }
  if ( typeof children === 'object' && children !== null ) {
    if ( Array.isArray(children) ) {
      return matchRoutesDeep(children, path === -1 ? parts : rest, matched);
    }
    return matchRoutesDeep([ children ], path === -1 ? parts : rest, matched);
  }
  return false;
}

function matchRoutes(routes, parts) {
  for ( const route of routes ) {
    const matched = { components: [ ], params: { } };
    const matches = matchRoute(route, parts, matched);
    if ( matches ) {
      return matches;
    }
  }
  return unmatch;
}

function matchRoutesDeep(routes, parts, matched) {
  for ( const route of routes ) {
    const matches = matchRoute(route, parts, matched);
    if ( matches ) {
      return matches;
    }
  }
  return false;
}

export function strip(url = '') {
  return url.replace(/(^\/+|\/+$)/g, '');
}

export function segmentize(url = '') {
  return strip(url).split('/');
}

export function match(routes, location) {
  const url = segmentize(location);
  if ( Array.isArray(routes) ) {
    return matchRoutes(routes, url);
  }
  return matchRoutes([ routes ], url);
}
