
export default function offline () {

  if ( typeof window === 'undefined' ) return;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

}
