
import Inferno from 'inferno';
import Component from 'inferno-component';

import { clearTitle, clearLinks, clearMetas, setTitle, addMeta, addLink } from './actions/head';

class Property extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return null;
  }

}

export class Head extends Component {

  constructor(props, context) {
    super(props, context);
    this.defaults();
    this.apply();
  }

  defaults() {
    const { context: { store: { dispatch } } } = this;
    dispatch(clearTitle());
    dispatch(clearMetas());
    dispatch(clearLinks());
  }

  apply() {
    const { children } = this.props;
    if ( typeof children === 'object' && children !== null ) {
      if ( Array.isArray(children) ) {
        children.map(item => this.patch(item));
      } else {
        this.patch(children);
      }
    }
  }

  patch(item) {
    const { type, props } = item;
    switch ( type ) {
      case Title:
        return this.inject('title', item.props);
      case Meta:
        return this.inject('meta', item.props);
      case Link:
        return this.inject('link', item.props);
    }
  }

  inject(type, props) {
    const { context: { store: { dispatch } } } = this;
    switch ( type ) {
      case 'title':
        return dispatch(setTitle(props.children));
      case 'meta':
        return dispatch(addMeta(props));
      case 'link':
        return dispatch(addLink(props));
    }
  }

  render() {
    return null;
  }

}

export function Meta(props) {
  return <Property { ...props } />
}

export function Link(props) {
  return <Property { ...props } />
}

export function Title({ children }) {
  if ( typeof children === 'string' ) {
    return <Property>{ children }</Property>
  }
  return null;
}
