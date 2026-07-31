import { format, parseISO } from 'date-fns';
import { FiBookOpen } from 'react-icons/fi';

import EmptyState from '../../../components/common/EmptyState';
import { groupEntriesByDate } from '../utils/groupByDate';

/**
 * EntryList.jsx
 * Renders the left-panel entry list, grouped by date ("Today", "Yesterday",
 * then formatted dates). Highlights the currently open entry.
 */
export default function EntryList({ entries, activeEntryId, onSelect }) {
  if (!entries.length) {
    return (
      <EmptyState
        icon={FiBookOpen}
        message="No entries yet"
        subMessage="Tap New to write your first diary entry."
      />
    );
  }

  const groups = groupEntriesByDate(entries);

  return (
    <div className="divide-y divide-navy-700">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wide">
            {group.label}
          </p>
          {group.entries.map((entry) => {
            const preview =
              entry.content?.trim().slice(0, 60) || 'No content yet';
            const isActive = entry.id === activeEntryId;
            return (
              <button
                key={entry.id}
                onClick={() => onSelect(entry.id)}
                className={`w-full text-left px-4 py-3 transition-colors border-l-2 ${
                  isActive
                    ? 'bg-accent-blue/10 border-accent-blue'
                    : 'border-transparent hover:bg-navy-900'
                }`}
              >
                <p className="text-text-primary text-sm font-medium truncate">
                  {entry.title || 'Untitled'}
                </p>
                <p className="text-text-secondary text-xs mt-0.5 truncate">
                  {preview}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  {format(parseISO(entry.createdAt), 'h:mm a')}
                </p>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
