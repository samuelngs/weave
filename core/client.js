
import Inferno from 'inferno';

import render from './render';
import app from 'application';

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => render(app));
}
