
import Inferno from 'inferno';

import render from 'weave-render';

if (typeof window !== 'undefined') {
  window.addEventListener('load', render);
}
