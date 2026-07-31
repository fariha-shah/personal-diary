import { useEffect, useMemo, useState } from 'react';

import { addMonths, format, subMonths } from 'date-fns';

import useReminders from './hooks/useReminders';
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiBookOpen,
} from 'react-icons/fi';

import { useDiary } from '../daily-diary/hooks/useDiary';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import ConfirmDialog from '../../components/common/ConfirmDialog';

import MonthCalendar from './components/MonthCalendar';
import WeekCalendar from './components/WeekCalendar';
import DayCalendar from './components/DayCalendar';
import EventModal from './components/EventModal';
import EventDetailsModal from './components/EventDetailsModal';

import useCalendar from './hooks/useCalendar';

const CALENDAR_VIEWS = [
  {
    label: 'Month',
    value: 'month',
  },
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Day',
    value: 'day',
  },
];

export default function CalendarPage({ onOpenDiaryEntry }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [calendarView, setCalendarView] = useState('month');

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);

  const [viewingEvent, setViewingEvent] = useState(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const {
    events,
    holidays,
    addEvent,
    updateEvent,
    deleteEvent,
    loadHolidays,
    isLoadingHolidays,
    holidayError,
  } = useCalendar();

  const { entries: diaryEntries } = useDiary();

  useReminders(events);

  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    loadHolidays(currentYear);
  }, [currentYear, loadHolidays]);

  /*
   * Selected date in yyyy-MM-dd format.
   */
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  /*
   * Events for selected date.
   */
  const selectedDayEvents = useMemo(() => {
    return events.filter((event) => event.date === selectedDateString);
  }, [events, selectedDateString]);

  /*
   * Diary entries for selected date.
   */
  const selectedDayDiaryEntries = useMemo(() => {
    return diaryEntries.filter((entry) => entry.date === selectedDateString);
  }, [diaryEntries, selectedDateString]);

  /*
   * Dates which contain diary entries.
   *
   * MonthCalendar uses this to show
   * a small indicator on diary dates.
   */
  const diaryDates = useMemo(() => {
    return new Set(
      diaryEntries.filter((entry) => entry.date).map((entry) => entry.date)
    );
  }, [diaryEntries]);

  /*
   * Select a calendar date.
   */
  const handleSelectDate = (date) => {
    setSelectedDate(date);

    if (
      date.getMonth() !== currentDate.getMonth() ||
      date.getFullYear() !== currentDate.getFullYear()
    ) {
      setCurrentDate(date);
    }
  };

  /*
   * Previous navigation.
   */
  const handlePrevious = () => {
    if (calendarView === 'month') {
      setCurrentDate((date) => subMonths(date, 1));

      return;
    }

    if (calendarView === 'week') {
      setSelectedDate((date) => {
        const nextDate = new Date(date);

        nextDate.setDate(nextDate.getDate() - 7);

        setCurrentDate(nextDate);

        return nextDate;
      });

      return;
    }

    const nextDate = new Date(selectedDate);

    nextDate.setDate(nextDate.getDate() - 1);

    setSelectedDate(nextDate);
    setCurrentDate(nextDate);
  };

  /*
   * Next navigation.
   */
  const handleNext = () => {
    if (calendarView === 'month') {
      setCurrentDate((date) => addMonths(date, 1));

      return;
    }

    if (calendarView === 'week') {
      setSelectedDate((date) => {
        const nextDate = new Date(date);

        nextDate.setDate(nextDate.getDate() + 7);

        setCurrentDate(nextDate);

        return nextDate;
      });

      return;
    }

    const nextDate = new Date(selectedDate);

    nextDate.setDate(nextDate.getDate() + 1);

    setSelectedDate(nextDate);
    setCurrentDate(nextDate);
  };

  /*
   * Go to today.
   */
  const handleToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  /*
   * Add event.
   */
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  /*
   * Close event modal.
   */
  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  /*
   * Save event.
   */
  const handleSaveEvent = (formData) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, formData);
    } else {
      addEvent(formData);
    }

    handleCloseEventModal();
  };

  /*
   * Open event details.
   */
  const handleOpenEventDetails = (event) => {
    setViewingEvent(event);
  };

  /*
   * Close event details.
   */
  const handleCloseEventDetails = () => {
    setViewingEvent(null);
  };

  /*
   * Edit event.
   */
  const handleEditEvent = () => {
    if (!viewingEvent) {
      return;
    }

    setEditingEvent(viewingEvent);
    setViewingEvent(null);
    setIsEventModalOpen(true);
  };

  /*
   * Delete event — opens the styled ConfirmDialog instead of the
   * browser's native window.confirm(), so it matches the rest of the app.
   */
  const handleDeleteEvent = () => {
    if (!viewingEvent) {
      return;
    }

    setIsDeleteConfirmOpen(true);
  };

  /*
   * Actually delete the event once the ConfirmDialog is confirmed.
   */
  const handleConfirmDeleteEvent = () => {
    if (!viewingEvent) {
      return;
    }

    deleteEvent(viewingEvent.id);
    setViewingEvent(null);
    setIsDeleteConfirmOpen(false);
  };

  /*
   * Open diary entry.
   *
   * App.jsx receives the ID,
   * changes page to Daily Diary,
   * and DailyDiaryPage opens that entry.
   */
  const handleOpenDiaryEntry = (entryId) => {
    if (!entryId) {
      return;
    }

    if (onOpenDiaryEntry) {
      onOpenDiaryEntry(entryId);
    }
  };

  /*
   * Calendar heading.
   */
  const getViewTitle = () => {
    if (calendarView === 'month') {
      return format(currentDate, 'MMMM yyyy');
    }

    if (calendarView === 'week') {
      return 'This Week';
    }

    return format(selectedDate, 'dd MMMM yyyy');
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
            <FiCalendar size={20} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">
              Calendar
            </h1>

            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              Manage your events and important dates.
            </p>
          </div>
        </div>

        <Button size="sm" icon={FiPlus} onClick={handleAddEvent}>
          Add Event
        </Button>
      </div>

      {/* View Tabs */}
      <div className="mb-3">
        <Tabs
          tabs={CALENDAR_VIEWS}
          active={calendarView}
          onChange={setCalendarView}
        />
      </div>

      {/* Toolbar */}
      <Card padding="p-3" className="mb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevious}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-navy-700 hover:text-text-primary"
              aria-label="Previous"
            >
              <FiChevronLeft size={17} />
            </button>

            <h2 className="min-w-[145px] text-center text-base font-semibold text-text-primary">
              {getViewTitle()}
            </h2>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-navy-700 hover:text-text-primary"
              aria-label="Next"
            >
              <FiChevronRight size={17} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <Button variant="secondary" size="sm" onClick={handleToday}>
              Today
            </Button>

            <span className="text-xs text-text-muted">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>
      </Card>

      {/* Holiday Error */}
      {holidayError && (
        <div className="mb-3 rounded-lg border border-accent-red/20 bg-accent-red/5 px-3 py-2 text-xs text-accent-red">
          {holidayError}
        </div>
      )}

      {/* Calendar */}
      {calendarView === 'month' && (
        <MonthCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          holidays={holidays}
          diaryDates={diaryDates}
          onSelectDate={handleSelectDate}
        />
      )}

      {calendarView === 'week' && (
        <WeekCalendar
          currentDate={selectedDate}
          selectedDate={selectedDate}
          events={events}
          onSelectDate={handleSelectDate}
          onEventClick={handleOpenEventDetails}
        />
      )}

      {calendarView === 'day' && (
        <DayCalendar
          selectedDate={selectedDate}
          events={events}
          onEventClick={handleOpenEventDetails}
        />
      )}

      {/* Selected Date */}
      <Card padding="p-4" className="mt-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
              Selected Date
            </p>

            <h3 className="mt-0.5 text-sm font-semibold text-text-primary">
              {format(selectedDate, 'EEEE, dd MMMM yyyy')}
            </h3>
          </div>

          <Button size="sm" icon={FiPlus} onClick={handleAddEvent}>
            Add Event
          </Button>
        </div>

        {/* Events */}
        {selectedDayEvents.length > 0 ? (
          <div className="mt-3 space-y-2">
            {selectedDayEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => handleOpenEventDetails(event)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-navy-700 bg-navy-900/50 px-3 py-2.5 text-left transition-colors hover:border-accent-blue/40 hover:bg-navy-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {event.title}
                  </p>

                  {(event.startTime || event.endTime) && (
                    <p className="mt-0.5 text-xs text-text-muted">
                      {event.startTime || '--'}

                      {event.endTime ? ` - ${event.endTime}` : ''}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-xs font-medium text-accent-blue">
                  View
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-dashed border-navy-700 px-4 py-4 text-center">
            <p className="text-xs text-text-muted">No events for this date.</p>

            <button
              type="button"
              onClick={handleAddEvent}
              className="mt-1 text-xs font-medium text-accent-blue hover:underline"
            >
              Add an event
            </button>
          </div>
        )}

        {/* Diary Entries */}
        <div className="mt-4 border-t border-navy-700 pt-4">
          <div className="flex items-center gap-2">
            <FiBookOpen size={15} className="text-accent-blue" />

            <h3 className="text-sm font-semibold text-text-primary">Diary</h3>

            {selectedDayDiaryEntries.length > 0 && (
              <span className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-[10px] font-medium text-accent-blue">
                {selectedDayDiaryEntries.length}
              </span>
            )}
          </div>

          {selectedDayDiaryEntries.length > 0 ? (
            <div className="mt-3 space-y-2">
              {selectedDayDiaryEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleOpenDiaryEntry(entry.id)}
                  className="group w-full rounded-lg border border-navy-700 bg-navy-900/40 px-3 py-2.5 text-left transition-colors hover:border-accent-blue/40 hover:bg-navy-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {entry.title || 'Untitled Entry'}
                      </p>

                      {entry.content && (
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                          {entry.content}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-[10px] font-medium text-accent-blue opacity-70 transition-opacity group-hover:opacity-100">
                      Open →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-navy-700 px-4 py-4 text-center">
              <p className="text-xs text-text-muted">
                No diary entry for this date.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Add / Edit Event */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        selectedDate={selectedDateString}
        editingEvent={editingEvent}
        onSave={handleSaveEvent}
      />

      <EventDetailsModal
        isOpen={Boolean(viewingEvent) && !isDeleteConfirmOpen}
        onClose={handleCloseEventDetails}
        event={viewingEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDeleteEvent}
        title="Delete this event?"
        message={
          viewingEvent
            ? `"${viewingEvent.title}" will be permanently removed.`
            : 'This event will be permanently removed.'
        }
      />

      {/* Holiday Loading */}
      {isLoadingHolidays && (
        <p className="mt-2 text-center text-[11px] text-text-muted">
          Loading holiday data...
        </p>
      )}
    </div>
  );
}
