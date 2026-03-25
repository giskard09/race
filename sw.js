// Giskard Race — Service Worker
// Caches shell for offline use. API calls always go to network.

const CACHE = 'race-v1';
const SHELL = [
  '/race/',
  '/race/index.html',
  '/race/manifest.json',
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // API calls: always network
  if (e.request.url.includes('localhost') || e.request.url.includes('trycloudflare')) {
    return;
  }
  // Shell: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
