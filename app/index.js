
import Component from 'weave-component';
import { Router, Route } from 'weave-router';

import styles from './styles.css';

function Index(props) {
  return <div>{ props.message }</div>
}

Index.getInitialProps = async function() {
  return { message: 'Welcome to Weave!' };
}

class Any extends Component {

  static async getInitialProps ({ location }) {
    return { pathname: location.pathname };
  }

  render() {
    return <div>Path: { this.props.pathname }</div>
  }
}

export default function () {
  return <Router>
    <Route path={"/"} component={Index} />
    <Route path={"*"} component={Any} />
  </Router>
}

