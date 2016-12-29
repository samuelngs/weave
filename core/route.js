
import Inferno from 'inferno';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';

import { match, strip } from './utils';

export class Route extends Component {

  constructor(props, context) {
    super(props, context);
  }

}

export class IndexRoute extends Component {

  constructor(props, context) {
    super(props, context);
  }

}

export class Router extends Component {

  constructor(props, context) {
    super(props, context);
  }

  renderComponent(components, params, idx = 0) {
    const component = components[idx];
    if ( !component ) return null;
    const children = this.renderComponent(components, params, idx + 1);
    if ( typeof children === 'object' && typeof children !== null ) {
      return createElement(component, { params }, children);
    }
    return createElement(component, { params }, null);
  }

  render({ location, children }) {
    const { components, params } = match(children, location);
    if ( components.length > 0 ) {
      return this.renderComponent(components, params);
    }
    return null;
  }

}

