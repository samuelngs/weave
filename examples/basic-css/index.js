
import Inferno from 'inferno';
import { Router, Route } from 'weave-router';

import Home from './pages/Home';

export default () => <Router>
  <Route path="*" component={Home} />
</Router>
