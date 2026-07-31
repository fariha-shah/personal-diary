import { useState, useEffect } from 'react';

const STORAGE_KEY = 'personal_diary_loans';

export function useLoan() {
  const [loanRecords, setLoanRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setLoanRecords(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load loan records from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loanRecords));
  }, [loanRecords, isLoading]);

  const addLoan = (data) => {
    const newRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };
    setLoanRecords((prev) => [newRecord, ...prev]);
  };

  const updateLoan = (id, updates) => {
    setLoanRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updates } : rec))
    );
  };

  const deleteLoan = (id) => {
    setLoanRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  const toggleStatus = (id) => {
    setLoanRecords((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { ...rec, status: rec.status === 'Paid' ? 'Pending' : 'Paid' }
          : rec
      )
    );
  };

  return {
    loanRecords,
    addLoan,
    updateLoan,
    deleteLoan,
    toggleStatus,
    isLoading,
  };
}
