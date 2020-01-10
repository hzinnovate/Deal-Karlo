const cacheName = 'Deal-Karlo';
const staticAssets = [
    './',
    './index.html',
    './htmlFiles/chat.html',
    './assets/css/bootstrap.min.css',
    './assets/css/chatStyle.css',
    './assets/css/style.css',
    './assets/fontawesome/fontawesome-5.7.1/css/all.css',
    './assets/fonts/aileron.regular.otf',
    './assets/icons/icon.png',
    './assets/icons/icon128.png',
    './assets/icons/icon144.png',
    './assets/icons/icon152.png',
    './assets/icons/icon192.png',
    './assets/icons/icon256.png',
    './assets/icons/icon512.png',
    './assets/jquery/jqueryV3.3.1.js',
    './assets/sweetAlert/sweetAlert.js',
    './assets/js/chat.js',
    './assets/js/main.js',
    './assets/js/authontication.js',
    './assets/slideImages/Slider1.jpg',
    './assets/slideImages/Slider2.jpg',
    './assets/slideImages/Slider3.jpg',
    './assets/logo/buyNowLogo.png',
    './assets/logo/logo.png',
    './assets/logo/logoFooter.png',
    './assets/logo/sellnowlogo.png',
]
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install');
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(staticAssets);
        })
    );
})
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});
async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}
async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res
    } catch (error) {
        return await cache.match(req)
    }
}
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request)
        }).catch(function(error) {
            console.log(error)
        }).then(function(response) {
            return caches.open(cacheName).then(function(cache) {
                if (event.request.url.indexOf('test') < 0) {
                    cache.put(event.request.url, response.clone());
                }
                return response;
            })
        })

    );
});

/* ======================== PWA END ======================== */

/* ****************************************************************************************************************** */
/* ****************************************************************************************************************** */

/* ======================== PUSH NOTIFICATION ======================== */
/* ============================== START ============================== */

importScripts('https://www.gstatic.com/firebasejs/5.8.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.8.3/firebase-messaging.js');
importScripts('/__/firebase/init.js');
const messaging = firebase.messaging();


/* ======================== PUSH NOTIFICATION ======================== */
/* =============================== END =============================== */