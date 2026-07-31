import { FiSearch, FiDownload, FiX } from 'react-icons/fi';
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
  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
      <div className="w-full sm:w-64">
        <Input
          label="Search"
          icon={FiSearch}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-56">
        <DatePicker
          label="Search by date"
          value={date}
          onChange={onDateChange}
        />
      </div>

      <Button variant="secondary" icon={FiX} onClick={onClear}>
        Clear
      </Button>

      <div className="flex-1" />

      <Button variant="secondary" icon={FiDownload} onClick={onExportPdf}>
        Export PDF
      </Button>
    </div>
  );
}
