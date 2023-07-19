const CACHE = "quran-app-data";
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const offlineFallbackPage = "offline-page.html";

// self.addEventListener("message", (event) => {
//     if (event.data && event.data.type === "SKIP_WAITING") {
//         self.skipWaiting();
//     }
// });

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.add(offlineFallbackPage))
    );
});

workbox.setConfig({ debug: false });

if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResp = await event.preloadResponse;

                if (preloadResp) {
                    return preloadResp;
                }

                return await fetch(event.request);
            } catch (error) {

                const cache = await caches.open(CACHE);
                return await cache.match(offlineFallbackPage);
            }
        })());
    }
});