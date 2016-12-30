
import Inferno from 'inferno';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';

import { match, strip } from './utils';
import { push } from './actions/history';

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

  state = {
    store: this.context.store.getState(),
  }

  componentWillMount() {
    const { history: { location: { pathname } } } = this.props;
    const { store: { dispatch } } = this.context;
    dispatch(push(pathname));
  }

  componentDidMount() {
    const { history } = this.props;
    const { store: { dispatch, subscribe } } = this.context;
    this.unlisten = history.listen(({ pathname }, action) => {
      dispatch(push(pathname));
    });
    subscribe(() => {
      const { store: { getState } } = this.context;
      this.patch(getState());
    });
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  patch(store) {
    this.update && clearImmediate(this.update);
    this.update = setImmediate(() => {
      const { history } = this.props;
      const prev = this.state.store;
      const next = store;
      this.setState({ store });
      this.update = null;
    });
  }

  getChildContext() {
    const { history: { push, listen, location: { pathname } } } = this.props;
    return {
      router: {
        push,
        listen,
        location: {
          pathname,
        },
      },
    };
  }

  renderComponent(components, params, idx = 0) {
    const { history } = this.props;
    const component = components[idx];
    if ( !component ) return null;
    const children = this.renderComponent(components, params, idx + 1);
    if ( typeof children === 'object' && typeof children !== null ) {
      return createElement(component, { history, params }, children);
    }
    return createElement(component, { history, params }, null);
  }

  render({ history, children }) {
    const { store: { getState } } = this.context;
    const { pathname } = getState();
    const { components, params } = match(children, pathname);
    if ( components.length > 0 ) {
      return this.renderComponent(components, params);
    }
    return null;
  }

}

