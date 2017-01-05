
import Inferno from 'inferno';
import { Head, Title, Link } from 'weave-head';

import styles from './styles.css';

export default () => <div>
  <Head>
    <Title>Hello world</Title>
    <Link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />
  </Head>
  <h1>Hello world</h1>
</div>
