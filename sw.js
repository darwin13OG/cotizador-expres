// sw.js
const CACHE_NAME = 'cotizador-expres-cache-v1';
const ASSETS_TO_CACHE = [
  './', // El archivo HTML principal
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.29/jspdf.plugin.autotable.min.js'
];

// Evento 'install': se dispara cuando se instala el SW.
// Aquí guardamos los archivos principales en el caché.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto, añadiendo assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Evento 'activate': se dispara cuando el SW se activa.
// Aquí se suelen limpiar los cachés antiguos.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Borrando caché antiguo');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Evento 'fetch': se dispara con cada petición de red.
// Intentamos servir desde el caché primero; si no está, vamos a la red.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos una respuesta en el caché, la devolvemos.
        if (response) {
          return response;
        }
        // Si no, hacemos la petición a la red.
        return fetch(event.request);
      })
  );
});
