// Service Worker minimal KSN
// Objectif : satisfaire les criteres d'installabilite de Chrome / Edge
// (un SW avec au moins un handler "fetch"). On reste sur du network-first
// pour eviter de servir du contenu perime — pas d'offline-first car
// les compteurs live ne supportent pas le cache.

const CACHE_NAME = "ksn-v1";

self.addEventListener("install", (event) => {
  // Active immediatement la nouvelle version
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Nettoie les vieux caches eventuels
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  // Network-first : on tente le reseau, fallback cache si offline
  const req = event.request;
  if (req.method !== "GET") return;

  // Ne touche pas aux requetes Firebase / API
  const url = new URL(req.url);
  if (
    url.hostname.endsWith("firebaseio.com") ||
    url.hostname.endsWith("googleapis.com") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Cache uniquement les responses 200 OK
        if (res && res.status === 200 && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
