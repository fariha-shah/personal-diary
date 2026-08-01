import { useEffect } from 'react';
import { FiBell, FiX } from 'react-icons/fi';

export default function ReminderToast({ reminders, onDismiss, onView }) {
  useEffect(() => {
    if (!reminders.length) {
      return;
    }

    const timers = reminders.map((reminder) =>
      setTimeout(() => onDismiss(reminder.id), 8000)
    );

    return () => timers.forEach(clearTimeout);
  }, [reminders, onDismiss]);

  if (!reminders.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[280px] flex-col gap-2">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="flex items-start gap-2.5 rounded-2xl border border-violet-200 bg-white p-3 shadow-lg shadow-violet-200/50"
        >
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <FiBell size={14} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800">
              {reminder.event.title}
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              {reminder.event.startTime
                ? `Starts at ${reminder.event.startTime}`
                : 'Starting now'}
            </p>

            <button
              type="button"
              onClick={() => onView(reminder.event)}
              className="mt-1 text-[10px] font-semibold text-violet-600 hover:underline"
            >
              View event
            </button>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(reminder.id)}
            className="shrink-0 text-slate-300 hover:text-slate-500"
          >
            <FiX size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
