// Offline cache: the app works without internet once opened.
const CACHE = 'archery-v1';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  "ibm-plex-sans-thai-latin-400-normal.woff2",
  "ibm-plex-sans-thai-latin-500-normal.woff2",
  "ibm-plex-sans-thai-latin-600-normal.woff2",
  "ibm-plex-sans-thai-latin-700-normal.woff2",
  "ibm-plex-sans-thai-thai-400-normal.woff2",
  "ibm-plex-sans-thai-thai-500-normal.woff2",
  "ibm-plex-sans-thai-thai-600-normal.woff2",
  "ibm-plex-sans-thai-thai-700-normal.woff2",
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first (so updates show up), cache as fallback when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html')))
  );
});
