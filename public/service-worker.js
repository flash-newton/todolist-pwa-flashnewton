const staticCacheName = 'site-static-v4';
const dynamicCacheName = 'site-dynamic-v4';
const assets = [
    '/',
    '/index.html',
    '/pages/signup.html',
    '/pages/todolist.html',
    '/pages/category.html',
    '/pages/todoadd.html',
    '/pages/fallback.html',
    '/scripts/main.js',
    '/scripts/app.js',
    '/scripts/firebase.js',
    '/scripts/index/auth.js',
    '/scripts/index/ui.js',
    '/scripts/signup/auth.js',
    '/scripts/signup/ui.js',
    '/scripts/todolist/script.js',
    '/scripts/todolist/ui.js',
    '/scripts/todoadd/script.js',
    '/scripts/todoadd/ui.js',
    '/scripts/todolist/calendar.js',
    '/scripts/category/script.js',
    '/scripts/category/ui.js',
    '/css/index.css',
    '/css/category.css',
    '/css/signup.css',
    '/css/todolist.css',
    '/css/todoadd.css',
    '/css/calendar.css',
    '/css/main.css',
    '/images/login.png',
    '/images/google.png',
    '/images/fallimg.jpg',
    '/images/icons/favicon-16x16.png',
    '/images/icons/favicon-32x32.png',
    '/images/icons/icon-48x48.png',
    '/images/icons/icon-72x72.png',
    '/images/icons/icon-96x96.png',
    '/images/icons/icon-128x128.png',
    '/images/icons/icon-144x144.png',
    '/images/icons/icon-152x152.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-384x384.png',
    '/images/icons/icon-512x512.png',
    '/images/icons/safari-pinned-tab.svg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
    'http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css',
    'https://www.gstatic.com/firebasejs/7.21.0/firebase-app.js',
    'https://www.gstatic.com/firebasejs/7.21.0/firebase-auth.js',
    'https://www.gstatic.com/firebasejs/7.21.0/firebase-firestore.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js',
    'https://kit.fontawesome.com/526ee1411d.js',
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch events
self.addEventListener('fetch', evt => {
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        // check cached items size
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    })
                });
            }).catch(() => {
                if(evt.request.url.indexOf('.html') > -1){
                    return caches.match('/pages/fallback.html');
                }
            })
        );
    }
});
