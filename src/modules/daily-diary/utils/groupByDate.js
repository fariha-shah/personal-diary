import { isToday, isYesterday, parseISO, format } from 'date-fns';

/**
 * utils/groupByDate.js
 *
 * Groups diary entries into labeled sections — "Today", "Yesterday", then
 * formatted dates ("July 28, 2026") — newest first. Used by EntryList to
 * render the notepad-style grouped sidebar.
 */
export function groupEntriesByDate(entries) {
  // Newest first: by date, then by creation time within the same date
  const sorted = [...entries].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const groups = [];
  const groupMap = new Map();

  sorted.forEach((entry) => {
    const dateObj = parseISO(entry.date);
    let label;
    if (isToday(dateObj)) label = 'Today';
    else if (isYesterday(dateObj)) label = 'Yesterday';
    else label = format(dateObj, 'MMMM d, yyyy');

    if (!groupMap.has(label)) {
      const group = { label, entries: [] };
      groupMap.set(label, group);
      groups.push(group);
    }
    groupMap.get(label).entries.push(entry);
  });

  return groups;
}
