import { format } from 'date-fns';
import Card from '../../../components/common/Card';
import { getEventColor } from '../services/eventColors';

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
    <Card
      padding="p-0"
      className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
    >
      {/* Day heading */}
      <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white px-4 py-3">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-violet-500">
          Selected day
        </p>

        <h3 className="mt-0.5 text-sm font-semibold text-slate-800">
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
              className="grid min-h-[50px] grid-cols-[52px_1fr] border-b border-violet-50 last:border-b-0"
            >
              {/* Time */}
              <div className="border-r border-violet-100 bg-violet-50/40 px-2 py-2 text-right text-[9px] font-medium text-slate-400">
                {format(new Date(2026, 0, 1, hour), 'h a')}
              </div>

              {/* Events */}
              <div className="p-1.5 transition-colors hover:bg-violet-50/30">
                {hourEvents.length > 0 ? (
                  <div className="space-y-1.5">
                    {hourEvents.map((event) => {
                      const color = getEventColor(event.color);

                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => onEventClick(event)}
                          className={`w-full rounded-xl border px-2.5 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${color.border} ${color.bg}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-[11px] font-semibold ${color.text}`}
                            >
                              {event.title}
                            </p>

                            {event.startTime && (
                              <span className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[8px] font-medium text-slate-500 shadow-sm">
                                {event.startTime}
                              </span>
                            )}
                          </div>

                          {(event.startTime || event.endTime) && (
                            <p className="mt-0.5 text-[9px] text-slate-400">
                              {event.startTime || '--'}
                              {event.endTime ? ` - ${event.endTime}` : ''}
                            </p>
                          )}

                          {event.description && (
                            <p className="mt-1 truncate text-[9px] leading-4 text-slate-500">
                              {event.description}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full rounded-lg transition-colors hover:bg-violet-50/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
