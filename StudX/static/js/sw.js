const CACHE_NAME = 'studyx-v1';
const ASSETS = [
    '/static/css/app.css',
    '/static/css/timer.css',
    '/static/css/dashboard.css',
    '/static/js/app.js',
    '/dashboard/'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});