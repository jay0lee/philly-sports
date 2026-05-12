const CACHE_NAME = 'phisports-cache-v1';
const urlsToCache = [
  './phisports.html',
  './manifest.json'
  './icon-192.png',
  './icon-512.png'
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached version if found (great for the HTML shell)
        if (response) {
          return response;
        }
        
        // Otherwise, fetch from the network (necessary for your live APIs)
        return fetch(event.request).catch(() => {
          // If the network fails (offline), and it's not in cache, do nothing.
          // Your existing code already has try/catch blocks that handle failed fetches well!
          console.log("Network request failed and no cache available.");
        });
      })
  );
});

// Clean up old caches when a new service worker takes over
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
