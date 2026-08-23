// service-worker.js
// Caches this site's static files so the app keeps working after the
// first visit even without an internet connection. GitHub Pages only
// delivers the files — everything else (editing, preview, PDF export)
// already runs entirely in the browser.

const CACHE_NAME = "biodata-resume-studio-v1";

const CORE_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./styles/style.css",
    "./styles/responsive.css",
    "./styles/print.css",
    "./styles/bootstrap.min.css",
    "./styles/all.min.css",
    "./scripts/bootstrap.bundle.min.js",
    "./scripts/html2canvas.min.js",
    "./scripts/jspdf.umd.min.js",
    "./scripts/form.js",
    "./scripts/validation.js",
    "./scripts/storage.js",
    "./scripts/autofill.js",
    "./scripts/positions.js",
    "./scripts/preview.js",
    "./scripts/gallery.js",
    "./scripts/photo-editor.js",
    "./scripts/config.js",
    "./scripts/pdf.js",
    "./scripts/resume.js",
    "./scripts/app.js",
    "./images/logo.png"
];

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            return cache.addAll(CORE_ASSETS).catch(() => {

                // if one optional asset fails to cache, don't block install
                return Promise.resolve();

            });

        }).then(() => self.skipWaiting())

    );

});

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())

    );

});

self.addEventListener("fetch", (event) => {

    const request = event.request;

    // only handle same-origin GET requests; let everything else
    // (fonts CDN, external libraries, POST requests) go straight to network
    if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {

        return;

    }

    event.respondWith(

        caches.match(request).then((cached) => {

            const networkFetch = fetch(request)
                .then((response) => {

                    if (response && response.status === 200) {

                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));

                    }

                    return response;

                })
                .catch(() => cached);

            return cached || networkFetch;

        })

    );

});
