import EmptyState from './EmptyState';

export default function Table({
  columns,
  data,
  emptyMessage = 'No records found',
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl2 border border-navy-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-900 border-b border-navy-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-text-secondary font-medium px-4 py-3 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="border-b border-navy-700 last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div
                      className="h-4 bg-navy-700/60 rounded animate-pulse"
                      style={{ width: `${60 + ((i * 13) % 30)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-navy-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy-900 border-b border-navy-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-text-secondary font-medium px-4 py-3 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-navy-700 last:border-0 hover:bg-navy-700/40 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-text-primary whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
