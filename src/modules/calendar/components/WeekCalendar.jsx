import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

import Card from '../../../components/common/Card';
import { getEventColor } from '../services/eventColors';

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
    <Card
      padding="p-0"
      className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
    >
      {/* Week header */}
      <div className="grid grid-cols-[46px_repeat(7,minmax(84px,1fr))] overflow-x-auto border-b border-violet-100 bg-violet-50/60">
        <div className="border-r border-violet-100" />

        {weekDays.map((day) => {
          const today = isSameDay(day, new Date());
          const selected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`
                border-r border-violet-100 px-1.5 py-2
                text-center transition-all duration-200
                hover:bg-violet-50
                ${selected ? 'bg-violet-50' : ''}
              `}
            >
              <p className="text-[9px] font-medium uppercase tracking-wider text-violet-300">
                {format(day, 'EEE')}
              </p>

              <div
                className={`
                  mx-auto mt-1 flex h-6 w-6 items-center
                  justify-center rounded-full text-[10px] font-semibold
                  transition-all
                  ${
                    today
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-300'
                      : selected
                        ? 'bg-violet-100 text-violet-600'
                        : 'text-slate-700'
                  }
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
        <div className="min-w-[634px]">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid min-h-[46px] grid-cols-[46px_repeat(7,minmax(84px,1fr))] border-b border-violet-50 last:border-b-0"
            >
              {/* Time */}
              <div className="border-r border-violet-100 bg-violet-50/40 px-1.5 py-1.5 text-right text-[9px] font-medium text-slate-400">
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
                    className="group relative border-r border-violet-50 p-1 transition-colors hover:bg-violet-50/40"
                  >
                    {hourEvents.map((event) => {
                      const color = getEventColor(event.color);

                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => onEventClick(event)}
                          className={`w-full rounded-lg border px-1.5 py-1.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${color.border} ${color.bg}`}
                        >
                          <p
                            className={`truncate text-[9px] font-semibold ${color.text}`}
                          >
                            {event.title}
                          </p>

                          {event.startTime && (
                            <span className="mt-0.5 block text-[8px] text-slate-400">
                              {event.startTime}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {hourEvents.length === 0 && (
                      <button
                        type="button"
                        onClick={() => onSelectDate(day)}
                        className="absolute inset-0 w-full rounded opacity-0 transition-opacity hover:bg-violet-50/50 hover:opacity-100"
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
