
import Inferno from 'inferno';
import { Head, Title } from 'weave-head';

import styles from './styles.css';

export default () => <div>
  <Head>
    <Title>Index page</Title>
  </Head>
  <span className={styles.message}>Hello world</span>
</div>
