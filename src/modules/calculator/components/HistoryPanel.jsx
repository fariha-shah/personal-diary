import { FiClock, FiTrash2 } from 'react-icons/fi';
import EmptyState from '../../../components/common/EmptyState';

export default function HistoryPanel({ history, onSelect, onClear }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700">
        <h2 className="text-text-primary font-medium text-sm">History</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-text-muted hover:text-accent-red transition-colors"
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
            subMessage="Your history will show up here."
          />
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.result)}
              className="w-full text-left px-4 py-2.5 border-b border-navy-700/50 hover:bg-navy-900 transition-colors"
            >
              <p className="text-text-secondary text-xs truncate">
                {item.expression} =
              </p>
              <p className="text-text-primary text-sm font-medium truncate">
                {item.result}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
