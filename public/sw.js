const CACHE_NAME = 'rge-v1';
const PRECACHE = [
    '/',
    '/sobre',
    '/contato',
    '/projetos',
    '/blog',
    '/servicos',
    '/servicos/energia-solar',
    '/servicos/eficiencia-energetica',
    '/servicos/projetos-eletricos',
    '/servicos/subestacoes',
    '/global.css',
    '/img/hero-bg.webp',
    '/img/logo.svg',
    '/favicon.svg'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request).then(r => {
            if (r.ok && e.request.url.startsWith(self.location.origin)) {
                const clone = r.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
            }
            return r;
        }).catch(() => caches.match(e.request).then(cached => cached || caches.match('/')))
    );
});
