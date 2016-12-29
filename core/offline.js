
export default function offline () {
  if ( typeof window !== 'undefined' ) require('offline-plugin/runtime').install();
}
