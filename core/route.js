
import Inferno from 'inferno';
import Component from 'inferno-component';
import createElement from 'inferno-create-element';

import context from './context';
import { match, strip } from './utils';
import { push } from './actions/history';

const defaults = {
  string: '',
  number: 0,
  object: {},
  array : [],
};

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
    prev: defaults.object,
    curr: { ...this.props.props },
    ctx : { ...this.props.ctx },
    prerendered: false,
    reinit: false,
    drawed: false,
  }

  async componentUpdateContext() {
    this.setState({ ctx: await context() });
  }

  async componentWillMount() {
    const { history: { location: { pathname } } } = this.props;
    const { store: { dispatch } } = this.context;
    dispatch(push(pathname));
  }

  async componentDidMount() {
    const { history } = this.props;
    const { store: { dispatch, subscribe } } = this.context;
    this.unlisten = history.listen(async ({ pathname }, action) => {
      await this.componentUpdateContext();
      await this.componentWillRedraw(pathname);
    });
    subscribe(async () => {
      const { store: { getState } } = this.context;
      this.patch(getState());
    });
    this.setState({ prerendered: true, drawed: true, ctx: await context() });
  }

  async componentWillInitialize(component, ctx) {
    if ( typeof component.getInitialProps === 'function' ) {
      const props = await component.getInitialProps(ctx);
      return typeof props === 'object' && props !== null ? props : defaults.object;
    }
    return defaults.object;
  }

  async componentWillRedraw(pathname) {
    return this.setState({ reinit: true, drawed: false }, async () => await this.componentOnRedraw(pathname));
  }

  async componentOnRedraw(pathname) {
    const { curr, ctx } = this.state;
    const { children } = this.props;
    const { components, params } = match(children, pathname);
    const props = await Promise.all(components.map(async (component) => await this.componentWillInitialize(component, ctx)));
    this.setState({ reinit: false, drawed: false, prev: curr, curr: props }, async () => await this.componentDidRedraw(pathname));
  }

  async componentDidRedraw(pathname) {
    const { store: { dispatch } } = this.context;
    dispatch(push(pathname));
    this.setState({ drawed: true, prev: defaults.object });
  }

  async componentWillUnmount() {
    this.unlisten && this.unlisten();
  }

  async componentDidUpdate(props, state, context) {
    const { prerendered, reinit, drawed } = this.state;
    if ( !prerendered || (prerendered && !state.prerendered) ) return;
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

  renderComponent(components = null, params = defaults.object, props = defaults.array, idx = defaults.number) {
    const { history } = this.props;
    const { reinit, drawed } = this.state;
    const component = components[idx];
    if ( !component ) return null;
    const prop = props[idx] || defaults.object;
    const args = { };
    if ( reinit && !drawed ) args.initializing = true;
    const children = this.renderComponent(components, params, props, idx + 1);
    if ( typeof children === 'object' && typeof children !== null ) {
      return createElement(component, { ...prop, ...args, history, params }, children);
    }
    return createElement(component, { ...prop, ...args, history, params }, null);
  }

  prerender() {
    const { components, params } = this.props;
    const { curr, reinit, drawed } = this.state;
    if ( components.length > 0 ) {
      return this.renderComponent(components, params, curr);
    }
    return null;
  }

  postrender() {
    const { children } = this.props;
    const { curr, prev, reinit, drawed } = this.state;
    const { store: { getState } } = this.context;
    const { pathname } = getState();
    const { components, params } = match(children, pathname);
    if ( components.length > 0 ) {
      return this.renderComponent(components, params, !reinit && !drawed ? prev : curr);
    }
    return null;
  }

  render() {
    const { prerendered } = this.state;
    if ( !prerendered ) {
      return this.prerender();
    }
    return this.postrender();
  }

}

