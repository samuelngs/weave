
import Inferno from 'inferno';
import Component from 'inferno-component';

import styles from './styles.css';

export default class Index extends Component {

  static async getInitialProps ({ location }) {
    return {
      message: `path: ${location.href}`,
    };
  }

  render() {
   return <div className={styles.root}>
     {this.props.message}
   </div>
  }
}
