const C='falta-v5';
const pad=n=>String(n).padStart(2,'0');
function fmt(ms){let s=Math.max(0,Math.floor(ms/1000));const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;}
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.json','icon-192.png','icon-512.png']).catch(()=>{})))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(C).then(c=>c.put(e.request,k)).catch(()=>{});return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():self.clients.openWindow('./')))});
// Si borras todas las notificaciones, la cuenta fijada vuelve a aparecer sola
self.addEventListener('notificationclose',e=>{
  const d=e.notification.data;
  if(d&&d.pin&&d.t>Date.now()){
    const end=new Date(d.t).toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'});
    e.waitUntil(self.registration.showNotification(`${d.e} ${d.n}`,{body:`Faltan ${fmt(d.t-Date.now())} · termina ${end}`,tag:e.notification.tag,silent:true,requireInteraction:true,icon:e.notification.icon||undefined,data:d}));
  }
});
