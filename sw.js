var staticCacheName = 'restaurants-app';

self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(staticCacheName).then(function (cache) {
        return cache.addAll(['js/dbhelper.js', 'js/restaurant_info.js', 'js/main.js', 'css/responsive.css', 'css/styles.css', 'data/restaurants.json',
            'https://fonts.googleapis.com/css?family=Roboto:400,500,700', 'index.html', 'restaurant.html', 'manifest.json'
        ]);
    }));
});

self.addEventListener('fetch', function (event) {
    const url = new URL(event.request.url);

    if (url.pathname.startsWith('/restaurant.html')) {
        event.respondWith(
            caches.match('restaurant.html')
            .then(response => response || fetch(event.request))
        );
        return;
    }

    event.respondWith(
        caches.open('restaurants-app').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});