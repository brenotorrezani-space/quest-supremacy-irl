import { useState, useEffect } from 'react';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator.standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Verificar permissão de notificação
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registrado com sucesso:', registration);
          })
          .catch((registrationError) => {
            console.log('Falha no registro do SW:', registrationError);
          });
      });
    }

    // Event listener para instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Event listener para app instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Event listeners para status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para instalar o app
  const installApp = async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      return true;
    }
    
    return false;
  };

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('Este browser não suporta notificações');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      // Registrar para push notifications se disponível
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              // Chave pública VAPID (seria necessário gerar uma real)
              'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLuxazjqAKVXTJkcCXqbNdmhPOcRkNiSp2HLFxndJNqYaYDkH-RkVs'
            )
          });
          
          console.log('Push subscription:', subscription);
          return true;
        } catch (error) {
          console.error('Erro ao registrar push subscription:', error);
          return false;
        }
      }
    }
    
    return permission === 'granted';
  };

  // Função para enviar notificação local
  const sendLocalNotification = (title, body, options = {}) => {
    if (notificationPermission !== 'granted') return false;

    const notification = new Notification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: 'quest-supremacy',
      requireInteraction: false,
      ...options
    });

    // Auto-fechar após 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);

    return true;
  };

  // Função para agendar lembretes diários
  const scheduleDailyReminders = () => {
    if (notificationPermission !== 'granted') return false;

    // Lembrete matinal (9:00)
    scheduleNotificationAt(9, 0, 
      'Quest Supremacy IRL', 
      '⚔️ Suas novas quests diárias estão prontas! Comece sua jornada épica.'
    );

    // Lembrete do meio-dia (12:00)
    scheduleNotificationAt(12, 0, 
      'Quest Supremacy IRL', 
      '🌟 Como está seu progresso hoje? Não esqueça de completar suas quests!'
    );

    // Lembrete da noite (20:00)
    scheduleNotificationAt(20, 0, 
      'Quest Supremacy IRL', 
      '🏆 Últimas horas do dia! Finalize suas quests pendentes para não perder XP.'
    );

    return true;
  };

  // Função auxiliar para agendar notificação em horário específico
  const scheduleNotificationAt = (hour, minute, title, body) => {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // Se o horário já passou hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      sendLocalNotification(title, body);
      
      // Reagendar para o próximo dia
      setTimeout(() => {
        scheduleNotificationAt(hour, minute, title, body);
      }, 24 * 60 * 60 * 1000); // 24 horas
    }, timeUntilNotification);
  };

  // Função para notificar conquista
  const notifyAchievement = (title, description) => {
    return sendLocalNotification(
      `🏆 ${title}`,
      description,
      {
        tag: 'achievement',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'Ver Conquistas'
          }
        ]
      }
    );
  };

  // Função para notificar quest completada
  const notifyQuestCompleted = (questName, xpGained) => {
    return sendLocalNotification(
      '✅ Quest Completada!',
      `${questName} - +${xpGained}% XP`,
      {
        tag: 'quest-completed',
        vibrate: [100, 50, 100]
      }
    );
  };

  // Função para notificar nível subido
  const notifyLevelUp = (statName, newLevel) => {
    return sendLocalNotification(
      '⬆️ Nível Aumentado!',
      `${statName} subiu para nível ${newLevel}!`,
      {
        tag: 'level-up',
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200]
      }
    );
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    notificationPermission,
    installApp,
    requestNotificationPermission,
    sendLocalNotification,
    scheduleDailyReminders,
    notifyAchievement,
    notifyQuestCompleted,
    notifyLevelUp
  };
}

// Função auxiliar para converter chave VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
