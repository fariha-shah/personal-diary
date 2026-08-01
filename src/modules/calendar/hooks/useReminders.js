import { useEffect } from 'react';

import {
  isReminderDue,
  showEventNotification,
} from '../services/reminderService';

export default function useReminders(events, onReminderDue) {
  useEffect(() => {
    if (!events?.length) {
      return;
    }

    const checkReminders = () => {
      events.forEach((event) => {
        if (!isReminderDue(event)) {
          return;
        }

        const notificationKey = `reminder-${event.id}-${event.date}-${event.startTime}-${event.reminder}`;

        const alreadyShown = sessionStorage.getItem(notificationKey);

        if (alreadyShown) {
          return;
        }

        sessionStorage.setItem(notificationKey, 'true');

        // Guaranteed: in-app popup, works even if browser notifications are blocked.
        if (onReminderDue) {
          onReminderDue(event);
        }

        // Bonus: try native browser notification too (best effort only).
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            showEventNotification(event);
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                showEventNotification(event);
              }
            });
          }
        }
      });
    };

    checkReminders();

    // Check more often (15s) so the 60s due-window is never missed.
    const interval = setInterval(checkReminders, 15 * 1000);

    return () => clearInterval(interval);
  }, [events, onReminderDue]);
}
