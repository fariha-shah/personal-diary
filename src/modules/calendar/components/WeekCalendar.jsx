import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

import Card from '../../../components/common/Card';

const HOURS = Array.from({ length: 24 }, (_, index) => index);

function getWeekDays(currentDate) {
  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: 0,
  });

  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export default function WeekCalendar({
  currentDate,
  selectedDate,
  events = [],
  onSelectDate,
  onEventClick,
}) {
  const weekDays = getWeekDays(currentDate);

  const getEventsForDay = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');

    return events.filter((event) => event.date === dateString);
  };

  return (
    <Card padding="p-0" className="overflow-hidden">
      {/* Week header */}
      <div className="grid grid-cols-[56px_repeat(7,minmax(100px,1fr))] overflow-x-auto border-b border-navy-700">
        <div className="border-r border-navy-700 bg-navy-900/40" />

        {weekDays.map((day) => {
          const today = isSameDay(day, new Date());

          const selected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`
                border-r border-navy-700 px-2 py-3
                text-center transition-colors
                hover:bg-navy-900/50
                ${selected ? 'bg-accent-blue/5' : ''}
              `}
            >
              <p className="text-[10px] uppercase tracking-wide text-text-muted">
                {format(day, 'EEE')}
              </p>

              <div
                className={`
                  mx-auto mt-1 flex h-7 w-7 items-center
                  justify-center rounded-full text-xs font-semibold
                  ${today ? 'bg-accent-blue text-white' : 'text-text-primary'}
                `}
              >
                {format(day, 'd')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[756px]">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid min-h-[58px] grid-cols-[56px_repeat(7,minmax(100px,1fr))] border-b border-navy-700 last:border-b-0"
            >
              {/* Time */}
              <div className="border-r border-navy-700 px-2 py-2 text-right text-[10px] text-text-muted">
                {format(new Date(2026, 0, 1, hour), 'h a')}
              </div>

              {/* Days */}
              {weekDays.map((day) => {
                const dayEvents = getEventsForDay(day);

                const hourEvents = dayEvents.filter(
                  (event) =>
                    event.startTime &&
                    Number(event.startTime.split(':')[0]) === hour
                );

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="relative border-r border-navy-700 p-1"
                  >
                    {hourEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onEventClick(event)}
                        className="w-full rounded-md bg-accent-blue/10 px-2 py-1.5 text-left text-[10px] font-medium text-accent-blue transition-colors hover:bg-accent-blue/20"
                      >
                        <p className="truncate">{event.title}</p>

                        {event.startTime && (
                          <span className="text-[9px] text-text-muted">
                            {event.startTime}
                          </span>
                        )}
                      </button>
                    ))}

                    {/* Empty slot */}
                    {hourEvents.length === 0 && (
                      <button
                        type="button"
                        onClick={() => onSelectDate(day)}
                        className="absolute inset-0 w-full opacity-0 hover:bg-accent-blue/5"
                        aria-label={`Select ${format(day, 'EEEE')}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
