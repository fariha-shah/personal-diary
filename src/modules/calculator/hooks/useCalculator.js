import { useState, useEffect, useCallback } from 'react';
import { performOperation, formatNumber } from '../utils/operations';

const HISTORY_KEY = 'personal_diary_calculator_history';
const MAX_DISPLAY_DIGITS = 12;

export function useCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load calculator history:', err);
    }
  }, []);

  const persistHistory = (next) => {
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  };

  const inputDigit = useCallback(
    (digit) => {
      setDisplay((prev) => {
        if (overwrite) return digit;
        if (prev === '0') return digit;
        if (prev.replace('-', '').replace('.', '').length >= MAX_DISPLAY_DIGITS)
          return prev;
        return prev + digit;
      });
      setOverwrite(false);
    },
    [overwrite]
  );

  const inputDecimal = useCallback(() => {
    setDisplay((prev) => {
      if (overwrite) return '0.';
      if (prev.includes('.')) return prev;
      return `${prev}.`;
    });
    setOverwrite(false);
  }, [overwrite]);

  const toggleSign = useCallback(() => {
    setDisplay((prev) => {
      if (prev === '0') return prev;
      return prev.startsWith('-') ? prev.slice(1) : `-${prev}`;
    });
  }, []);

  const clearAll = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setStoredValue(null);
    setOperator(null);
    setOverwrite(true);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
    setOverwrite(true);
  }, []);

  const backspace = useCallback(() => {
    if (overwrite) return;
    setDisplay((prev) => {
      const next = prev.slice(0, -1);
      return next === '' || next === '-' ? '0' : next;
    });
  }, [overwrite]);

  // Pressing an operator either starts a new pending operation, or — if one
  // is already in progress and the user has typed a new number — resolves
  // it first (this is what makes "5 + 3 + 2 =" chain correctly).
  const inputOperator = useCallback(
    (nextOp) => {
      const current = parseFloat(display);

      if (operator && !overwrite) {
        const result = performOperation(storedValue, operator, current);
        const formatted = formatNumber(result);
        setDisplay(formatted);
        setStoredValue(parseFloat(formatted));
        setExpression(`${formatted} ${nextOp}`);
      } else {
        setStoredValue(current);
        setExpression(`${formatNumber(current)} ${nextOp}`);
      }
      setOperator(nextOp);
      setOverwrite(true);
    },
    [display, operator, overwrite, storedValue]
  );

  // iOS-style %: "200 + 10%" means 10% OF 200, not 10 as a raw number.
  const inputPercent = useCallback(() => {
    const current = parseFloat(display);
    const result =
      operator && storedValue !== null
        ? (storedValue * current) / 100
        : current / 100;
    setDisplay(formatNumber(result));
    setOverwrite(true);
  }, [display, operator, storedValue]);

  const calculate = useCallback(() => {
    if (operator === null || storedValue === null) return;
    const current = parseFloat(display);
    const result = performOperation(storedValue, operator, current);
    const formatted = formatNumber(result);
    const fullExpression = `${expression} ${formatNumber(current)}`;

    setDisplay(formatted);
    setExpression('');
    setStoredValue(null);
    setOperator(null);
    setOverwrite(true);

    if (formatted !== 'Error') {
      const entry = {
        id: crypto.randomUUID(),
        expression: fullExpression,
        result: formatted,
        timestamp: new Date().toISOString(),
      };
      persistHistory([entry, ...history].slice(0, 50)); // cap at 50 entries
    }
  }, [operator, storedValue, display, expression, history]);

  const clearHistory = useCallback(() => {
    persistHistory([]);
  }, []);

  const reuseHistoryResult = useCallback((value) => {
    setDisplay(value);
    setExpression('');
    setStoredValue(null);
    setOperator(null);
    setOverwrite(true);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
      else if (e.key === '.') inputDecimal();
      else if (e.key === '+' || e.key === '-') inputOperator(e.key);
      else if (e.key === '*') inputOperator('×');
      else if (e.key === '/') {
        e.preventDefault(); // stop Firefox's quick-find from opening
        inputOperator('÷');
      } else if (e.key === '%') inputPercent();
      else if (e.key === 'Enter' || e.key === '=') calculate();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clearAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    inputDigit,
    inputDecimal,
    inputOperator,
    inputPercent,
    calculate,
    backspace,
    clearAll,
  ]);

  return {
    display,
    expression,
    history,
    inputDigit,
    inputDecimal,
    inputOperator,
    inputPercent,
    calculate,
    clearAll,
    clearEntry,
    toggleSign,
    clearHistory,
    reuseHistoryResult,
  };
}
