
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
    this.apply();
  }

  apply() {
    const {
      context: { store: { dispatch, getState } },
      props: { children },
    } = this;
    const queue = [ ];
    if ( typeof children === 'object' && children !== null ) {
      const items = Array.isArray(children) ? children : [ children ];
      for ( const item of items ) {
        const patch = this.patch(item);
        if ( patch ) queue.push(patch);
      }
    }
    dispatch(dispatch => {
      dispatch(clearTitle());
      dispatch(clearMetas());
      dispatch(clearLinks());
      for ( const item of queue ) {
        dispatch(item);
      }
    });
    this.after();
  }

  after() {
    if ( typeof window === 'undefined' ) return;
    const { store: { getState } } = this.context;
    const { title, meta, link } = getState();
    if ( typeof document === 'undefined' ) return;
    document.title = title;
    const metas = document.head.querySelectorAll('meta:not([data-weave="true"])');
    for ( const el of metas ) {
      if ( el.parentNode ) el.parentNode.removeChild(el);
    }
    const links = document.head.querySelectorAll('link:not([data-weave="true"])');
    for ( const el of links ) {
      if ( el.parentNode ) el.parentNode.removeChild(el);
    }
    for ( const item of meta ) {
      const el = document.createElement('meta');
      for ( const key in item ) {
        el[key] = item[key];
      }
      document.head.appendChild(el);
    }
    for ( const item of link ) {
      const el = document.createElement('link');
      for ( const key in item ) {
        el[key] = item[key];
      }
      document.head.appendChild(el);
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
    return null;
  }

  inject(type, props) {
    switch ( type ) {
      case 'title':
        return setTitle(props.children);
      case 'meta':
        return addMeta(props);
      case 'link':
        return addLink(props);
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
