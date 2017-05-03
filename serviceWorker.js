var cacheName = "progressive web app v2";
var dataCacheName = "weatherData-v2";
var weatherAPIUrlBase = 'https://publicdata-weather.firebaseio.com/';

var filesToCache = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/scripts/localforage-1.4.0.js',
  '/styles/ud811.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(cacheName).then(function(cache){
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keyList){
      return Promise.all(keyList.map(function(key){
        if(key !== cacheName && key !== dataCacheName){
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener('fetch',function(e){
  if(e.request.url.startsWith(weatherAPIUrlBase)){
    e.respondWith(
      fetch(e.request)
      .then(function(response){
        return caches.open(dataCacheName).then(function(cache){
          cache.put(e.request.url,response.clone());
          console.log('service worker fetched and catched',e.request.url);
          return response;
        });
      })
    );
  }
  else{
    e.respondWith(
      caches.match(e.request).then(function(response){
        console.log('service worker',e.request.url);
        return response|| fetch(e.request);
      })
    );
  }

});
