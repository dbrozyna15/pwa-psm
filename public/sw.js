var GHPATH = '/pwa-psm';
var APP_PREFIX = 'pwapms_';
var VERSION = 'version_009';
var URLS = [
    `${GHPATH}/`,
    `${GHPATH}/index.html`,
    `${GHPATH}/offline.html`,
    `${GHPATH}/mapa.html`,
    `${GHPATH}/sos.html`,
    `${GHPATH}/assets/icons/24x24.png`,
    `${GHPATH}/assets/icons/48x48.png`,
    `${GHPATH}/assets/icons/192x192.png`,
    `${GHPATH}/assets/icons/512x512.png`,
    `${GHPATH}/assets/icons/icon_24.png`,
    `${GHPATH}/assets/icons/icon_48.png`,
    `${GHPATH}/assets/icons/icon_192.png`,
    `${GHPATH}/assets/icons/icon_512.png`,
    `${GHPATH}/js/app.js`
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
    console.log('Fetch request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('Responding with cache : ' + e.request.url);
                return request
            } else {
                console.log('File is not cached, fetching : ' + e.request.url);
                return fetch(e.request)
            }
        })
    )
})

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Installing cache : ' + CACHE_NAME);
            return cache.addAll(URLS)
        })
    )
})

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            cacheWhitelist.push(CACHE_NAME);
            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('Deleting cache : ' + keyList[i] );
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})