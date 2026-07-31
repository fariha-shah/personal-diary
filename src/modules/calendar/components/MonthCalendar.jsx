import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import Card from '../../../components/common/Card';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getCalendarDays(currentDate) {
  const start = startOfWeek(startOfMonth(currentDate), {
    weekStartsOn: 0,
  });

  const end = endOfWeek(endOfMonth(currentDate), {
    weekStartsOn: 0,
  });

  const days = [];
  let day = start;

  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  return days;
}

export default function MonthCalendar({
  currentDate,
  selectedDate,
  events = [],
  holidays = [],
  diaryDates = new Set(),
  onSelectDate,
}) {
  const calendarDays = getCalendarDays(currentDate);

  const getItemsForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');

    return [
      ...holidays.filter((holiday) => holiday.date === dateString),
      ...events.filter((event) => event.date === dateString),
    ];
  };

  return (
    <Card padding="p-0" className="overflow-hidden">
      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-navy-700 bg-navy-900/40">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="border-r border-navy-700 px-1 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted last:border-r-0 sm:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const dateString = format(day, 'yyyy-MM-dd');

          const items = getItemsForDate(day);

          const currentMonth = isSameMonth(day, currentDate);

          const selected = selectedDate ? isSameDay(day, selectedDate) : false;

          const today = isSameDay(day, new Date());

          const hasDiaryEntry = diaryDates.has(dateString);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={`
                group relative min-h-[82px]
                border-b border-r border-navy-700
                p-1.5 text-left transition-colors
                last:border-r-0
                sm:min-h-[96px] sm:p-2
                hover:bg-navy-700/30
                ${currentMonth ? 'bg-navy-800' : 'bg-navy-900/35'}
                ${selected ? 'bg-accent-blue/5' : ''}
              `}
            >
              {/* Date */}
              <div className="flex items-center justify-between">
                <span
                  className={`
                    flex h-6 w-6 items-center
                    justify-center rounded-full
                    text-[11px] font-semibold
                    sm:h-7 sm:w-7 sm:text-xs
                    ${
                      today
                        ? 'bg-accent-blue text-white'
                        : currentMonth
                          ? 'text-text-primary'
                          : 'text-text-muted'
                    }
                  `}
                >
                  {format(day, 'd')}
                </span>

                <div className="flex items-center gap-1">
                  {/* Diary indicator */}
                  {hasDiaryEntry && (
                    <span
                      title="Diary entry available"
                      className="h-1.5 w-1.5 rounded-full bg-accent-blue"
                    />
                  )}

                  {/* Selected indicator */}
                  {selected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-blue" />
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="mt-1.5 space-y-1">
                {items.slice(0, 2).map((item) => {
                  const holiday = item.type === 'holiday';

                  return (
                    <div
                      key={item.id}
                      title={item.title}
                      className={`
                          truncate rounded px-1.5
                          py-0.5 text-[9px]
                          font-medium leading-4
                          sm:text-[10px]
                          ${
                            holiday
                              ? 'bg-accent-red/10 text-accent-red'
                              : 'bg-accent-blue/10 text-accent-blue'
                          }
                        `}
                    >
                      {item.title}
                    </div>
                  );
                })}

                {items.length > 2 && (
                  <span className="block px-1 text-[9px] text-text-muted">
                    +{items.length - 2} more
                  </span>
                )}
              </div>

              {/* Diary label */}
              {hasDiaryEntry && (
                <span className="absolute bottom-1.5 right-1.5 text-[8px] font-medium text-accent-blue opacity-0 transition-opacity group-hover:opacity-100 sm:bottom-2 sm:right-2">
                  Diary
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
