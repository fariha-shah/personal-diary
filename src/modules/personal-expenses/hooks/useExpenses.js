import { useState, useEffect } from 'react';

const STORAGE_KEY = 'personal_diary_expenses';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setExpenses(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load expenses from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, isLoading]);

  const addExpense = (expenseData) => {
    const newExpense = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...expenseData,
    };

    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id, updates) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : expense
      )
    );
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading,
  };
}
