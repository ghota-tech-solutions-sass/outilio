/*
 * Ancien service worker "coi-serviceworker" (isolation cross-origin pour FFmpeg).
 * Il n'est plus nécessaire : FFmpeg utilise désormais un cœur sans SharedArrayBuffer.
 * Cette version se désinstalle chez les visiteurs qui l'avaient encore, pour ne plus
 * réécrire les en-têtes COOP/COEP de tout le site (gêne pour les publicités et iframes).
 */
"use strict";

if (typeof window === "undefined") {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        await self.registration.unregister();
        const clients = await self.clients.matchAll({ type: "window" });
        for (const client of clients) {
          client.navigate(client.url);
        }
      })()
    );
  });
} else if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
