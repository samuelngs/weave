
const prefix = 'weave:';
const resources = [
  './',
  './ctx',
  './assets/client.js',
  './assets/styles.css',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.
      open(prefix).
      then(cache => cache.addAll(resources)).
      then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => {
      return response || fetch(e.request);
  }));
});

