const CACHE_NAME = 'quest-supremacy-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Atualizar Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Notificações Push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova quest disponível!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Quests',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Quest Supremacy IRL', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Abrir app na aba de quests
    event.waitUntil(
      clients.openWindow('/?tab=quests')
    );
  } else if (event.action === 'close') {
    // Apenas fechar notificação
    event.notification.close();
  } else {
    // Clique padrão - abrir app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sincronizar dados quando voltar online
  return fetch('/api/sync')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log('Sincronização completa:', data);
    })
    .catch((error) => {
      console.log('Erro na sincronização:', error);
    });
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Função para agendar notificações locais
function scheduleNotification(title, body, delay) {
  setTimeout(() => {
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: 'quest-reminder',
      requireInteraction: false,
      silent: false
    });
  }, delay);
}

// Agendar lembretes diários
function scheduleDailyReminders() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0); // 9:00 AM

  const timeUntilTomorrow = tomorrow.getTime() - now.getTime();

  scheduleNotification(
    'Quest Supremacy IRL',
    '⚔️ Suas novas quests diárias estão prontas! Comece sua jornada épica.',
    timeUntilTomorrow
  );

  // Lembrete do meio-dia
  const noon = new Date(now);
  noon.setHours(12, 0, 0, 0);
  if (noon > now) {
    const timeUntilNoon = noon.getTime() - now.getTime();
    scheduleNotification(
      'Quest Supremacy IRL',
      '🌟 Como está seu progresso hoje? Não esqueça de completar suas quests!',
      timeUntilNoon
    );
  }

  // Lembrete da noite
  const evening = new Date(now);
  evening.setHours(20, 0, 0, 0);
  if (evening > now) {
    const timeUntilEvening = evening.getTime() - now.getTime();
    scheduleNotification(
      'Quest Supremacy IRL',
      '🏆 Últimas horas do dia! Finalize suas quests pendentes para não perder XP.',
      timeUntilEvening
    );
  }
}

// Inicializar lembretes quando o SW for instalado
self.addEventListener('install', () => {
  scheduleDailyReminders();
});
