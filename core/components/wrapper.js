
import Inferno from 'inferno';
import Component from 'inferno-component';

import context from '../context';

const defaults = {
  string: '',
  object: {},
  array : [],
};

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

    let props = await (typeof view.getInitialProps === 'function' ? view.getInitialProps(ctx) : defaults.object);
    if (typeof props !== 'object' || props === null) props = defaults.object;

    let title = await (typeof view.getTitle === 'function' ? view.getTitle(props) : defaults.string);
    if (typeof title !== 'string') title = defaults.string;

    let metas = await (typeof view.getMetaTags === 'function' ? view.getMetaTags(props) : defaults.array);
    if (!Array.isArray(metas)) metas = defaults.array;

    this.setState({ initialized: true, props, ctx }, () => this.updateHead(title, metas));
  }

  updateHead(name) {
    document.title = name;
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
