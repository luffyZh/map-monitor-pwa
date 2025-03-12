const CACHE_NAME = 'map-monitor-pwa';
const urlsToCache = [
  '/map-monitor-pwa/',
  '/map-monitor-pwa/index.html',
  '/map-monitor-pwa/manifest.json',
  '/map-monitor-pwa/assets/images/monitor-icon-red.svg',
  '/map-monitor-pwa/assets/audio/alert.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // 检查请求路径是否以 /api 或 /mqtt 开头
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/mqtt')) {
    // 对于 API 和 MQTT 请求，直接使用网络请求，不使用缓存
    event.respondWith(fetch(event.request));
    return;
  }

  // 对于其他请求，使用缓存优先策略
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