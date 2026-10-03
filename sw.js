const CACHE_NAME = 'yesilay-galeri-v2';

// Kurulum (Install) aşaması - Beklemeden hemen aktif ol
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Aktivasyon aşaması
self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// Fetch (Ağ istekleri) aşaması - PWA için zorunludur
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
