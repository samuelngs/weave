
import Component from 'weave-component';

export default class Wildcard extends Component {

  static async getInitialProps ({ location }) {
    return { pathname: location.pathname };
  }

  componentDidMount() {
    const { store } = this.context;
    store.dispatch({ type: 'INCREMENT' });
  }

  render() {
    const { store } = this.context;
    const { counter } = store.getState();
    return <div>Path: { this.props.pathname }, Count: { counter }</div>
  }
}
