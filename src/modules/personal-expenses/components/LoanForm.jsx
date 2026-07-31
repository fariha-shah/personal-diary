import { useState } from 'react';

import Input from '../../../components/common/Input';
import Dropdown from '../../../components/common/Dropdown';
import DatePicker from '../../../components/common/DatePicker';
import Button from '../../../components/common/Button';

import { LOAN_TYPES, LOAN_STATUS } from '../utils/constants';

const emptyForm = {
  name: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  type: '',
  status: 'Pending', // sensible default — a new loan starts unpaid
};

export default function LoanForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter the person's name";
    if (!form.amount || Number(form.amount) <= 0)
      next.amount = 'Enter a valid amount';
    if (!form.date) next.date = 'Date is required';
    if (!form.type) next.type = 'Select Given or Taken';
    if (!form.status) next.status = 'Select a status';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        placeholder="e.g. Ahmed Khan"
        value={form.name}
        onChange={(e) => setField('name', e.target.value)}
        error={errors.name}
      />

      <Input
        label="Amount (PKR)"
        type="number"
        min="0"
        step="0.01"
        placeholder="e.g. 5000"
        value={form.amount}
        onChange={(e) => setField('amount', e.target.value)}
        error={errors.amount}
      />

      <Dropdown
        label="Type"
        options={LOAN_TYPES}
        value={form.type}
        onChange={(val) => setField('type', val)}
        placeholder="Given or Taken?"
        error={errors.type}
      />

      <DatePicker
        label="Date"
        value={form.date}
        onChange={(e) => setField('date', e.target.value)}
        error={errors.date}
      />

      <Dropdown
        label="Status"
        options={LOAN_STATUS}
        value={form.status}
        onChange={(val) => setField('status', val)}
        placeholder="Select status"
        error={errors.status}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth>
          Save Loan
        </Button>
      </div>
    </form>
  );
}
