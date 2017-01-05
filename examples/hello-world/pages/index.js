
import Inferno from 'inferno';
import { Link } from 'weave-router';
import { Head, Title } from 'weave-head';

export default () => <div>
  <Head>
    <Title>Index page</Title>
  </Head>
  <Link href="/hello">Go to hello</Link>
</div>
