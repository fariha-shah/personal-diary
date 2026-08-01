import { useCallback, useEffect, useState } from 'react';
import { fetchPublicHolidays } from '../services/holidayApi';
import { getRandomEventColor } from '../services/eventColors';

const STORAGE_KEY = 'personal-diary-calendar-events';

export default function useCalendar() {
  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch {
      return [];
    }
  });

  const [holidays, setHolidays] = useState([]);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [holidayError, setHolidayError] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const loadHolidays = useCallback(async (year) => {
    setIsLoadingHolidays(true);
    setHolidayError('');

    try {
      const data = await fetchPublicHolidays('PK', year);
      setHolidays(data);
    } catch (error) {
      console.error('Holiday API error:', error);
      setHolidayError('Unable to load public holidays.');
      setHolidays([]);
    } finally {
      setIsLoadingHolidays(false);
    }
  }, []);

  const addEvent = useCallback((event) => {
    const newEvent = {
      id: crypto.randomUUID(),
      type: 'event',
      ...event,
      color: event.color || getRandomEventColor(),
    };

    setEvents((currentEvents) => [...currentEvents, newEvent]);

    return newEvent;
  }, []);

  const updateEvent = useCallback((eventId, updates) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  }, []);

  const deleteEvent = useCallback((eventId) => {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId)
    );
  }, []);

  return {
    events,
    holidays,
    addEvent,
    updateEvent,
    deleteEvent,
    loadHolidays,
    isLoadingHolidays,
    holidayError,
  };
}
