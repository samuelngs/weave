
import Inferno from 'inferno';
import { Head, Title } from 'weave-head';

import background from './background.jpg';
import styles from './styles.css';

export default () => <div>
  <Head>
    <Title>Index page</Title>
  </Head>
  <img className={styles.image} src={background} />
</div>
