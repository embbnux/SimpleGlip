var cacheStorageKey = 'simple-glip-pwa';

var cacheList = [
  '/',
  'index.html',
  'index.js',
  'assets/images/favicon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheStorageKey)
    .then(cache => cache.addAll(cacheList))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames.map(function (name) {
        if (name !== cacheStorageKey) {
          return caches.delete(name);
        }
      }));
    })
  );
  return self.clients.claim();
});
