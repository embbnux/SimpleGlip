var cacheStorageKey = 'simple-glip-pwa';
var offlineRequestStorageKey = 'simple-glip-pwa-offline';

var cacheList = [
  '/',
  'index.html',
  'index.js',
  '0.js',
  '1.js',
  '2.js',
  '3.js',
  '4.js',
  '5.js',
  '6.js',
  '7.js',
  '8.js',
  '9.js',
  'assets/images/favicon.png',
  'assets/images/favicon192.jpg',
  'assets/images/favicon512.jpg',
  'redirect.html',
  'redirect.js',
  'proxy.html',
  'proxy.js'
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

function fetchAndCache(request) {
  const cloneRequest = request.clone();
  return fetch(cloneRequest).then(function (httpRes) {
    if (!httpRes || httpRes.status > 210) {
      return httpRes;
    }
    var responseClone = httpRes.clone();
    caches.open(offlineRequestStorageKey).then(function (cache) {
      cache.put(request, responseClone);
    });
    return httpRes;
  });
}

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') {
    return;
  }
  if (e.request.url.indexOf('pubnub.com') > -1) {
    return;
  }
  if (e.request.url.indexOf('manifest.json') > -1) {
    return;
  }
  if (e.request.url.indexOf('s3.amazonaws.com') > -1) {
    return;
  }
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') {
    return;
  }
  if (self.navigator.onLine && e.request.headers.get('accept').indexOf('application/json') > -1) {
    e.respondWith(
      fetchAndCache(e.request)
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetchAndCache(e.request);
    })
  );
});
