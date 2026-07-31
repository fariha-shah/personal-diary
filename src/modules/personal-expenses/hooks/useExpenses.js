import { useState, useEffect } from 'react';

const STORAGE_KEY = 'personal_diary_expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setExpenses(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load expenses from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Persist whenever expenses change — but NOT before the initial load
  // finishes, otherwise this would overwrite localStorage with an empty
  // array during the brief moment before the load effect above runs.
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, isLoading]);

  const addExpense = (expenseData) => {
    const newExpense = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...expenseData,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id, updates) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  return { expenses, addExpense, updateExpense, deleteExpense, isLoading };
}
