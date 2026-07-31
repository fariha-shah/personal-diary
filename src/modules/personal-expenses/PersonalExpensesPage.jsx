import { useState } from 'react';
import { FiPlus, FiDollarSign, FiUsers, FiTrash2 } from 'react-icons/fi';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Tabs from '../../components/common/Tabs';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';

import SummaryCards from './components/SummaryCards';
import NetBalanceChart from './components/NetBalanceChart';
import HistoryFilter from './components/HistoryFilter';
import ExpenseForm from './components/ExpenseForm';
import LoanForm from './components/LoanForm';
import ExpenseCharts from './components/ExpenseCharts';
import LoanChart from './components/LoanChart';
import { useExpenses } from './hooks/useExpenses';
import { useLoan } from './hooks/useLoan';
import { exportExpensesPdf, exportLoansPdf } from './utils/pdfExport';

/**
 * PersonalExpensesPage.jsx
 *
 * Loan tab is fully functional —
 *   - "Add Loan" opens LoanForm inside a Modal
 *   - Records saved via useLoan() (localStorage-backed, same pattern as expenses)
 *   - Loan table shows real data + delete action + click-to-toggle status badge
 *   - Summary cards (Given / Taken / Net Balance) calculate from real records
 *
 * Both tabs are data-complete, with date-filtered history and charts.
 */

export default function PersonalExpensesPage() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [searchDate, setSearchDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'expense' | 'loan', id }

  const {
    expenses,
    addExpense,
    deleteExpense,
    isLoading: expensesLoading,
  } = useExpenses();
  const {
    loanRecords,
    addLoan,
    deleteLoan,
    toggleStatus,
    isLoading: loanLoading,
  } = useLoan();

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const totalGiven = loanRecords
    .filter((r) => r.type === 'Given')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const totalTaken = loanRecords
    .filter((r) => r.type === 'Taken')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  // Net Loan Balance must reflect only OUTSTANDING loans — i.e. records
  // still marked "Pending". Once a record is marked "Paid" (return ho
  // chuka hai, chahe humne diya tha ya liya tha), it should stop
  // affecting the net balance even though it stays visible in the
  // table/history for record-keeping. The "Loan Given"/"Loan Taken"
  // summary cards above intentionally keep showing the FULL historical
  // total (Paid + Pending) — only this net figure is Pending-only.
  const pendingGiven = loanRecords
    .filter((r) => r.type === 'Given' && r.status === 'Pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const pendingTaken = loanRecords
    .filter((r) => r.type === 'Taken' && r.status === 'Pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const netLoan = pendingGiven - pendingTaken;

  // STEP 6: filter by the searched date, if one is set.
  // Summary cards intentionally use the UNFILTERED totals above — they
  // always reflect the whole picture, while only the tables below narrow
  // down to a specific day. This matches the voice note request: "aaj 30
  // date hai, 15 date ka record dhoondna hai" — search narrows the list,
  // it doesn't change the running totals.
  //
  // NEW: also filter by a free-text query, matched (case-insensitive)
  // against the fields that make sense per tab — Category/Payment/Amount
  // for Expenses, Name/Type/Amount for Loan. Date filter and text search
  // combine (AND), so you can narrow by both at once.
  const query = searchQuery.trim().toLowerCase();

  const filteredExpenses = expenses
    .filter((e) => !searchDate || e.date === searchDate)
    .filter((e) => {
      if (!query) return true;
      const haystack = [
        e.category,
        e.paymentMethod,
        e.description,
        String(e.amount),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

  const filteredLoans = loanRecords
    .filter((r) => !searchDate || r.date === searchDate)
    .filter((r) => {
      if (!query) return true;
      const haystack = [r.name, r.type, r.status, String(r.amount)]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

  const loanColumns = [
    { key: 'date', label: 'Date' },
    { key: 'name', label: 'Name' },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge tone={row.type === 'Given' ? 'orange' : 'purple'}>
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => `PKR ${Number(row.amount).toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <button onClick={() => toggleStatus(row.id)} title="Click to toggle">
          <Badge tone={row.status === 'Paid' ? 'green' : 'orange'}>
            {row.status}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={() =>
            setDeleteTarget({ type: 'loan', id: row.id, label: row.name })
          }
          className="text-text-muted hover:text-accent-red transition-colors"
          title="Delete record"
        >
          <FiTrash2 size={16} />
        </button>
      ),
    },
  ];

  const expenseColumns = [
    { key: 'date', label: 'Date' },
    { key: 'category', label: 'Category' },
    { key: 'description', label: 'Description' },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (row) => (
        <Badge tone={row.paymentMethod === 'Cash' ? 'green' : 'blue'}>
          {row.paymentMethod}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => `PKR ${Number(row.amount).toLocaleString()}`,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={() =>
            setDeleteTarget({
              type: 'expense',
              id: row.id,
              label: row.description,
            })
          }
          className="text-text-muted hover:text-accent-red transition-colors"
          title="Delete expense"
        >
          <FiTrash2 size={16} />
        </button>
      ),
    },
  ];

  const handleAddClick = () => setIsModalOpen(true);

  const handleExpenseSubmit = (data) => {
    addExpense(data);
    setIsModalOpen(false);
  };

  const handleLoanSubmit = (data) => {
    addLoan(data);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'expense') deleteExpense(deleteTarget.id);
    else deleteLoan(deleteTarget.id);
  };

  const handleExportPdf = () => {
    if (activeTab === 'expenses') {
      const filteredTotal = filteredExpenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
      exportExpensesPdf(filteredExpenses, filteredTotal, searchDate);
    } else {
      const givenInView = filteredLoans
        .filter((r) => r.type === 'Given')
        .reduce((sum, r) => sum + Number(r.amount), 0);
      const takenInView = filteredLoans
        .filter((r) => r.type === 'Taken')
        .reduce((sum, r) => sum + Number(r.amount), 0);
      exportLoansPdf(filteredLoans, givenInView, takenInView, searchDate);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.35s_ease-out]">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-text-primary text-2xl font-semibold">
            Personal Expenses
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track your daily spending and manage loan records.
          </p>
        </div>
        <Button icon={FiPlus} onClick={handleAddClick}>
          {activeTab === 'expenses' ? 'Add Expense' : 'Add Loan'}
        </Button>
      </div>

      {/* Summary stats */}
      <SummaryCards
        totalSpent={totalSpent}
        totalGiven={totalGiven}
        totalTaken={totalTaken}
        netLoan={netLoan}
      />

      {/* Net Financial Position — combines BOTH tabs' data, always visible
          regardless of which tab is active, since it's the overall picture. */}
      <NetBalanceChart expenses={expenses} loanRecords={loanRecords} />

      {/* Tabs + content */}
      <Card padding="p-0" className="overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-navy-700">
          <Tabs
            tabs={[
              {
                label: 'Expenses',
                value: 'expenses',
                icon: FiDollarSign,
                count: expenses.length,
              },
              {
                label: 'Loan',
                value: 'loan',
                icon: FiUsers,
                count: loanRecords.length,
              },
            ]}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="p-5 space-y-5">
          <HistoryFilter
            date={searchDate}
            onDateChange={(e) => setSearchDate(e.target.value)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={
              activeTab === 'expenses'
                ? 'Search by category, payment, or amount...'
                : 'Search by name, type, or amount...'
            }
            onClear={() => {
              setSearchDate('');
              setSearchQuery('');
            }}
            onExportPdf={handleExportPdf}
          />

          {(searchDate || query) && (
            <p className="text-text-secondary text-sm">
              Showing filtered results
              {searchDate && (
                <>
                  {' '}
                  for{' '}
                  <span className="text-text-primary font-medium">
                    {searchDate}
                  </span>
                </>
              )}
              {query && (
                <>
                  {' '}
                  matching "
                  <span className="text-text-primary font-medium">
                    {searchQuery}
                  </span>
                  "
                </>
              )}
            </p>
          )}

          {activeTab === 'expenses' ? (
            <Table
              columns={expenseColumns}
              data={filteredExpenses}
              isLoading={expensesLoading}
              emptyMessage={
                searchDate || query
                  ? 'No expenses match your search'
                  : 'No expenses added yet'
              }
            />
          ) : (
            <Table
              columns={loanColumns}
              data={filteredLoans}
              isLoading={loanLoading}
              emptyMessage={
                searchDate || query
                  ? 'No loan records match your search'
                  : 'No loan records yet'
              }
            />
          )}
        </div>
      </Card>

      {activeTab === 'expenses' ? (
        <ExpenseCharts expenses={expenses} />
      ) : (
        <LoanChart totalGiven={totalGiven} totalTaken={totalTaken} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeTab === 'expenses' ? 'Add Expense' : 'Add Loan'}
      >
        {activeTab === 'expenses' ? (
          <ExpenseForm
            onSubmit={handleExpenseSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        ) : (
          <LoanForm
            onSubmit={handleLoanSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget?.type === 'expense'
            ? 'Delete this expense?'
            : 'Delete this loan record?'
        }
        message={
          deleteTarget?.label
            ? `"${deleteTarget.label}" will be permanently removed.`
            : 'This record will be permanently removed.'
        }
      />
    </div>
  );
}
