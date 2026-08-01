import { FiFileText, FiInfo, FiGrid } from 'react-icons/fi';

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

    title,
    description,
    setTitle,
    setDescription,

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
      {/* Page Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <FiGrid className="text-accent-blue" size={20} />
          </div>

          <div>
            <h1 className="text-text-primary text-2xl font-semibold">
              Calculator
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">
        {/* Left Side */}
        <div className="space-y-4">
          {/* Calculation Information */}
          <Card className="p-4 sm:p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
                <FiFileText className="text-accent-blue" size={17} />
              </div>

              <div>
                <h2 className="text-text-primary text-sm font-semibold">
                  Calculation Details
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="calculation-title"
                  className="block text-text-secondary text-xs font-medium mb-1.5"
                >
                  Calculation Title
                </label>

                <input
                  id="calculation-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monthly Grocery"
                  className="w-full h-10 px-3 rounded-lg bg-navy-900 border border-navy-700 text-text-primary text-sm placeholder:text-text-muted outline-none transition-all focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/10"
                />
              </div>

              <div>
                <label
                  htmlFor="calculation-description"
                  className="block text-text-secondary text-xs font-medium mb-1.5"
                >
                  Description
                </label>

                <input
                  id="calculation-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Grocery expense calculation"
                  className="w-full h-10 px-3 rounded-lg bg-navy-900 border border-navy-700 text-text-primary text-sm placeholder:text-text-muted outline-none transition-all focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/10"
                />
              </div>
            </div>
          </Card>

          {/* Calculator */}
          <Card className="p-4 sm:p-5 max-w-xl">
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
        </div>

        {/* History */}
        <Card
          padding="p-0"
          className="w-full h-[430px] xl:h-auto xl:min-h-[620px] flex flex-col overflow-hidden"
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
