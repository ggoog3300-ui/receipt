/* خضارنا — عامل خدمة خفيف. التطبيق يتطلب اتصالاً بالإنترنت. */
const SW_VERSION = 'khudarna-network-v2';
self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('khudarna-') && key !== SW_VERSION).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // لا نتدخل في تسجيل الدخول أو قاعدة البيانات أو الدوال أو أي طلب غير GET.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (/\/(auth|rest|functions)\//.test(url.pathname)) return;
  // Network-only: لا نخزّن صفحات الحسابات أو الطلبات أو بيانات Supabase.
  event.respondWith(fetch(request));
});
