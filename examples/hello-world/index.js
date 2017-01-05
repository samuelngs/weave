
import Inferno from 'inferno';
import { Router, Route } from 'weave-router';

import Home from './pages/index.js';
import Hello from './pages/hello.js';

export default () => <Router>
  <Route path="/" component={Home} />
  <Route path="*" component={Hello} />
</Router>
