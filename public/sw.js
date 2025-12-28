// Minimal service worker to satisfy PWA requirements
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    // Take control of all pages immediately
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Passive fetch handler (required for PWA installability)
    event.respondWith(fetch(event.request));
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/logo.png', // PNG is required for reliable rendering on Android/iOS
            badge: '/logo.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            },
            requireInteraction: true, // Key for persistent notifications on desktop
            tag: 'portfolio-update',
            renotify: true
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    } catch (err) {
        console.error('Push handling error:', err);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            const url = event.notification.data.url;
            // Check if there's already a tab open with this URL
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
