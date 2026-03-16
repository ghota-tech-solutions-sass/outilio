/*! coi-serviceworker v0.1.7 - Guido Zuidhof / nicolepratt, licensed under MIT */
"use strict";

if (typeof window === "undefined") {
  // Service Worker context
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
  self.addEventListener("fetch", (e) => {
    if (
      e.request.cache === "only-if-cached" &&
      e.request.mode !== "same-origin"
    ) {
      return;
    }
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.status === 0) return res;
        const headers = new Headers(res.headers);
        headers.set("Cross-Origin-Embedder-Policy", "credentialless");
        headers.set("Cross-Origin-Opener-Policy", "same-origin");
        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers,
        });
      })
    );
  });
} else {
  // Window context - register the service worker
  (async () => {
    if (window.crossOriginIsolated !== false) return;
    const registration = await navigator.serviceWorker.register(
      window.document.currentScript.src
    );
    if (registration.active && !navigator.serviceWorker.controller) {
      window.location.reload();
    } else if (!registration.active) {
      registration.addEventListener("updatefound", () => {
        registration.installing.addEventListener("statechange", () => {
          if (registration.active && !navigator.serviceWorker.controller) {
            window.location.reload();
          }
        });
      });
    }
  })();
}
