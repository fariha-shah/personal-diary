import Card from '../../components/common/Card';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryPanel from './components/HistoryPanel';
import { useCalculator } from './hooks/useCalculator';

export default function CalculatorPage() {
  const {
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
  } = useCalculator();

  return (
    <div className="animate-[fadeIn_0.35s_ease-out]">
      <div className="mb-4">
        <h1 className="text-text-primary text-2xl font-semibold">Calculator</h1>
        <p className="text-text-secondary text-sm mt-1">
          Quick calculations, with your recent history saved alongside.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full lg:w-96">
          <Display expression={expression} value={display} />
          <Keypad
            onDigit={inputDigit}
            onDecimal={inputDecimal}
            onOperator={inputOperator}
            onPercent={inputPercent}
            onEquals={calculate}
            onClearAll={clearAll}
            onClearEntry={clearEntry}
            onToggleSign={toggleSign}
          />
        </Card>

        <Card
          padding="p-0"
          className="w-full lg:w-72 h-80 lg:h-auto flex flex-col overflow-hidden"
        >
          <HistoryPanel
            history={history}
            onSelect={reuseHistoryResult}
            onClear={clearHistory}
          />
        </Card>
      </div>
    </div>
  );
}
