
import Component from 'weave-component';
import { Router, Route } from 'weave-router';

import Index from './pages/Index';
import Wildcard from './pages/Wildcard';

import reducers from './reducers';

import styles from './styles.css';

export default function () {
  return <Router reducers={reducers}>
    <Route path={"/"} component={Index} />
    <Route path={"*"} component={Wildcard} />
  </Router>
}

