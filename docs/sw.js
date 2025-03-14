const CACHE_NAME = 'map-monitor-pwa-v1';
        const urlsToCache = [
  "/map-monitor-pwa/",
  "/map-monitor-pwa/index.html",
  "/map-monitor-pwa/manifest.json",
  "/map-monitor-pwa/assets/images/monitor-icon-red.svg",
  "/map-monitor-pwa/assets/audio/alert.wav",
  "/map-monitor-pwa/assets/index-ii5_3CCP.css",
  "/map-monitor-pwa/assets/index-Bv5LE3zu.js"
];

        self.addEventListener('install', (event) => {
          event.waitUntil(
            caches.open(CACHE_NAME)
              .then((cache) => cache.addAll(urlsToCache))
          );
        });

        self.addEventListener('fetch', (event) => {
          event.respondWith(
            caches.match(event.request)
              .then((response) => {
                if (response) {
                  return response;
                }
                return fetch(event.request)
                  .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                      return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                      .then((cache) => {
                        cache.put(event.request, responseToCache);
                      });
                    return response;
                  });
              })
          );
        });

        self.addEventListener('activate', (event) => {
          event.waitUntil(
            caches.keys().then((cacheNames) => {
              return Promise.all(
                cacheNames.map((cacheName) => {
                  if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                  }
                })
              );
            })
          );
        });