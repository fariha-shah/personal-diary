import { useState, useEffect } from 'react';

const STORAGE_KEY = 'personal_diary_loans';

export function useLoan() {
  const [loanRecords, setLoanRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        setLoanRecords(JSON.parse(stored));
      }
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
      updatedAt: new Date().toISOString(),
      ...data,
    };

    setLoanRecords((prev) => [newRecord, ...prev]);
  };

  const updateLoan = (id, updates) => {
    setLoanRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : record
      )
    );
  };

  const deleteLoan = (id) => {
    setLoanRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const toggleStatus = (id) => {
    setLoanRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              status: record.status === 'Paid' ? 'Pending' : 'Paid',
              updatedAt: new Date().toISOString(),
            }
          : record
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
