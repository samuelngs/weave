
import Inferno from 'inferno';
import Component from 'inferno-component';

import context from '../context';

const defaults = {
  string: '',
  object: {},
  array : [],
};

const placeholder = <div />;

export default class Wrapper extends Component {

  state = {
    initialized: false,
    props: defaults.object,
    ctx: defaults.object,
  };

  async componentWillMount() {
    const { view } = this.props;
    if ( !view ) return;
    const ctx = await context();
    const props = await (typeof view.getInitialProps === 'function' ? view.getInitialProps(ctx) : defaults.object);
    this.setState({ initialized: true, props, ctx });
  }

  classes() {
    const { view } = this.props;
    const classes = typeof view.getElementClasses === 'function' ? view.getElementClasses() : defaults.string;
    if (Array.isArray(classes)) {
      return classes.join(' ');
    } else if (typeof classes === 'string') {
      return classes;
    }
    return defaults.string;
  }

  render() {
    const { initialized, props, ctx } = this.state;
    const { view, path } = this.props;
    const classes = this.classes();
    const args = classes.length > 0 ? { className: classes } : defaults.object;
    const View = view;
    return <div { ...args }>
      { initialized && <View { ...props } { ...ctx } /> }
    </div>
  }
}
