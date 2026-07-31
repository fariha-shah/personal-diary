import { useEffect } from 'react';

import {
  isReminderDue,
  requestNotificationPermission,
  showEventNotification,
} from '../services/reminderService';

export default function useReminders(events) {
  useEffect(() => {
    if (!events?.length) {
      return;
    }

    const checkReminders = async () => {
      const permission = await requestNotificationPermission();

      if (permission !== 'granted') {
        return;
      }

      events.forEach((event) => {
        if (!isReminderDue(event)) {
          return;
        }

        const notificationKey = `reminder-${event.id}-${event.date}-${event.startTime}`;

        const alreadyShown = sessionStorage.getItem(notificationKey);

        if (alreadyShown) {
          return;
        }

        showEventNotification(event);

        sessionStorage.setItem(notificationKey, 'true');
      });
    };

    checkReminders();

    const interval = setInterval(checkReminders, 30 * 1000);

    return () => clearInterval(interval);
  }, [events]);
}
