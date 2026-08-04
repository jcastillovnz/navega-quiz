// NavegaQuiz Service Worker
// Estrategia: cache-first para assets estáticos, network-first para navegación.

const CACHE_NAME = 'navega-quiz-v1';
const CORE_ASSETS = [
  '/navega-quiz/',
  '/navega-quiz/manifest.json',
  '/navega-quiz/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Navegación: network-first con fallback a cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match('/navega-quiz/').then(r => r || caches.match('/navega-quiz/index.html')))
    );
    return;
  }

  // Assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok && (res.type === 'basic' || res.type === 'default')) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
