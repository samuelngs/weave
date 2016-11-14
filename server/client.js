
import Inferno from 'inferno';
import Application from '../app';

import render from './render';

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => render(Application));
}
