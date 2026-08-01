import { FiClock, FiTrash2, FiArrowUpRight } from 'react-icons/fi';
import EmptyState from '../../../components/common/EmptyState';

export default function HistoryPanel({ history, onSelect, onClear }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-navy-700">
        <div>
          <h2 className="text-text-primary font-semibold text-sm">
            Calculation History
          </h2>

          <p className="text-text-muted text-[11px] mt-0.5">
            Your recent calculations
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors"
            title="Clear history"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <EmptyState
            icon={FiClock}
            message="No calculations yet"
            subMessage="Your saved calculations will appear here."
          />
        ) : (
          <div className="divide-y divide-navy-700/50">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.result)}
                className="group w-full text-left px-4 py-3.5 hover:bg-navy-900/70 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary text-sm font-medium truncate">
                      {item.title}
                    </p>

                    <p className="text-text-muted text-[11px] mt-0.5 truncate">
                      {item.description}
                    </p>
                  </div>

                  <FiArrowUpRight
                    size={14}
                    className="text-text-muted group-hover:text-accent-blue transition-colors shrink-0 mt-0.5"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 mt-2">
                  <p className="text-text-secondary text-xs truncate">
                    {item.expression}
                  </p>

                  <p className="text-accent-blue text-sm font-semibold shrink-0">
                    {item.result}
                  </p>
                </div>

                <p className="text-text-muted text-[10px] mt-1.5">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
