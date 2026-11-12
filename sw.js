const CACHE = 'studynet-v62';
const SHELL = [
  './',
  './index.html',
  './irish.html',
  './french.html',
  './history.html',
  './geography.html',
  './english.html',
  './science.html',
  './maths.html',
  './about.html',
  './app.css?v=52',
  './shared.js?v=52',
  './subject.js?v=52',
  './maths.js?v=52',
  './calc.js?v=52',
  './calc-lcd.js?v=52',
  './calc/body.webp?v=52',
  './calc/keys.webp?v=52',
  './periodic.js?v=52',
  './exam.js?v=52',
  './course.js?v=52',
  './ai.js?v=52',
  './ai-core.js?v=52',
  './data/irish.js?v=52',
  './data/french.js?v=52',
  './data/history.js?v=52',
  './data/geography.js?v=52',
  './data/english.js?v=52',
  './data/science.js?v=52',
  './data/maths.js?v=52',
  './data/elements.js?v=52',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL))
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function store(req, res) {
  // Opaque responses (Google Fonts) are fine to cache for offline use.
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !FONT_HOSTS.includes(url.hostname)) return;

  // Pages: network first, so a new deploy shows up on the first load.
  // Offline: the cached copy, or the dashboard as a last resort.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => store(req, res)).catch(() =>
        caches.match(req, { ignoreSearch: true })
          .then(hit => hit || caches.match('./index.html'))
      )
    );
    return;
  }

  // Everything else: serve from cache, refresh in the background.
  e.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req).then(res => store(req, res)).catch(() => cached || Response.error());
      return cached || network;
    })
  );
});
