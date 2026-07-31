import { useState, useEffect } from 'react';

const STORAGE_KEY = 'personal_diary_entries';

/**
 * useDiary.js
 *
 * Same pattern as useExpenses.js / useLoan.js — local state + localStorage
 * persistence standing in for Firebase. Each entry: { id, title, content,
 * date, createdAt, updatedAt }.
 *
 * addEntry returns the new entry's id — the Editor needs this immediately
 * to switch into "editing this entry" mode right after creating it.
 */
export function useDiary() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load diary entries from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, isLoading]);

  const addEntry = (data) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newEntry = {
      id,
      title: '',
      content: '',
      date: now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
      ...data,
    };
    setEntries((prev) => [newEntry, ...prev]);
    return id;
  };

  const updateEntry = (id, updates) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return { entries, addEntry, updateEntry, deleteEntry, isLoading };
}
