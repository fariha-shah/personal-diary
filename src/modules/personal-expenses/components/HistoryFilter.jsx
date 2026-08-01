import { FiSearch, FiDownload, FiX, FiCalendar } from 'react-icons/fi';

import DatePicker from '../../../components/common/DatePicker';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function HistoryFilter({
  date,
  onDateChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onClear,
  onExportPdf,
}) {
  const hasFilters = Boolean(searchQuery || date);

  return (
    <div
      className="
        bg-white
        border border-slate-200
        rounded-2xl
        p-4 sm:p-5
        shadow-sm
        animate-[fadeIn_0.35s_ease-out]
      "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-slate-800 font-semibold text-base">
            Transaction History
          </h3>

          <p className="text-slate-400 text-xs mt-0.5">
            Search and filter your financial records
          </p>
        </div>

        {hasFilters && (
          <span
            className="
              inline-flex items-center gap-1.5
              w-fit
              px-2.5 py-1
              rounded-full
              bg-blue-50
              text-blue-600
              text-xs
              font-medium
              animate-[fadeIn_0.2s_ease-out]
            "
          >
            Filters applied
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-3">
        {/* Search */}
        <div className="w-full lg:flex-1">
          <Input
            label="Search"
            icon={FiSearch}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="w-full lg:w-64">
          <DatePicker
            label="Search by date"
            value={date}
            onChange={onDateChange}
          />
        </div>

        {/* Clear */}
        <Button
          variant="secondary"
          icon={FiX}
          onClick={onClear}
          disabled={!hasFilters}
          className="
            !bg-slate-50
            !border-slate-200
            !text-slate-600
            hover:!bg-red-50
            hover:!text-red-500
            hover:!border-red-100
            transition-all
            duration-200
          "
        >
          Clear
        </Button>

        {/* Export */}
        <Button
          variant="primary"
          icon={FiDownload}
          onClick={onExportPdf}
          className="
            !bg-blue-500
            hover:!bg-blue-600
            shadow-sm
            hover:shadow-md
            transition-all
            duration-200
          "
        >
          Export PDF
        </Button>
      </div>

      {/* Active filter summary */}
      {hasFilters && (
        <div
          className="
            flex flex-wrap items-center gap-2
            mt-4 pt-3
            border-t border-slate-100
            animate-[fadeIn_0.25s_ease-out]
          "
        >
          <span className="text-xs text-slate-400">Active filters:</span>

          {searchQuery && (
            <span
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1
                rounded-full
                bg-slate-100
                text-slate-600
                text-xs
                font-medium
              "
            >
              <FiSearch size={12} />
              {searchQuery}
            </span>
          )}

          {date && (
            <span
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-1
                rounded-full
                bg-purple-50
                text-purple-600
                text-xs
                font-medium
              "
            >
              <FiCalendar size={12} />
              {date}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
