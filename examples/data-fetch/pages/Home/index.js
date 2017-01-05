
import Inferno from 'inferno';
import Component from 'inferno-component';
import { Head, Title, Meta } from 'weave-head';

import styles from './styles.css';

export default class Home extends Component {

  static async getInitialProps () {
    const info = await fetch('https://api.github.com/repos/samuelngs/weave').then(res => res.json()).catch(e => { })
    return {
      info,
    };
  }

  render({ info }) {
    return <div>
      <Head>
        <Title>{ info.full_name }</Title>
        <Meta name="description" content={ info.description } />
      </Head>
      <h1>{ info.full_name }</h1>
      <p>{ info.description }</p>
      <a href={ info.html_url } target="_blank">Go to Github</a>
    </div>
  }

}

