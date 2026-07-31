import { format, isSameDay } from 'date-fns';

import Card from '../../../components/common/Card';

const HOURS = Array.from({ length: 24 }, (_, index) => index);

export default function DayCalendar({
  selectedDate,
  events = [],
  onEventClick,
}) {
  const dateString = format(selectedDate, 'yyyy-MM-dd');

  const dayEvents = events.filter((event) => event.date === dateString);

  const getEventsForHour = (hour) => {
    return dayEvents.filter((event) => {
      if (!event.startTime) {
        return false;
      }

      const eventHour = Number(event.startTime.split(':')[0]);

      return eventHour === hour;
    });
  };

  return (
    <Card padding="p-0" className="overflow-hidden">
      {/* Day heading */}
      <div className="border-b border-navy-700 bg-navy-900/40 px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
          Selected day
        </p>

        <h3 className="mt-0.5 text-sm font-semibold text-text-primary">
          {format(selectedDate, 'EEEE, dd MMMM yyyy')}
        </h3>
      </div>

      {/* Time grid */}
      <div>
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour);

          return (
            <div
              key={hour}
              className="grid min-h-[64px] grid-cols-[60px_1fr] border-b border-navy-700 last:border-b-0"
            >
              {/* Time */}
              <div className="border-r border-navy-700 px-3 py-3 text-right text-[10px] text-text-muted">
                {format(new Date(2026, 0, 1, hour), 'h a')}
              </div>

              {/* Events */}
              <div className="p-2">
                {hourEvents.length > 0 ? (
                  <div className="space-y-1.5">
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onEventClick(event)}
                        className="w-full rounded-lg border border-accent-blue/20 bg-accent-blue/10 px-3 py-2 text-left transition-colors hover:bg-accent-blue/15"
                      >
                        <p className="text-xs font-semibold text-accent-blue">
                          {event.title}
                        </p>

                        {(event.startTime || event.endTime) && (
                          <p className="mt-0.5 text-[10px] text-text-muted">
                            {event.startTime || '--'}
                            {event.endTime ? ` - ${event.endTime}` : ''}
                          </p>
                        )}

                        {event.description && (
                          <p className="mt-1 truncate text-[10px] text-text-secondary">
                            {event.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
