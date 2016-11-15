
import Inferno from 'inferno';

import router from 'weave-router';
import render from 'weave-render';

if (typeof window !== 'undefined') {
  window.addEventListener('load', render);
}
