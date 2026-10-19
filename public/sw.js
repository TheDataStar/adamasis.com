const CACHE = 'notebook-v3';
const OFFLINE = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', OFFLINE])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/keystatic') || url.pathname.startsWith('/api/')) return;

  const keep = (res) => {
    if (res.ok && !res.redirected && res.type === 'basic') {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
    return res;
  };

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(keep)
        .catch(() => caches.match(request).then((hit) => hit || caches.match(OFFLINE))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then(keep),
    ),
  );
});
