import { useEffect, useState } from 'react';

import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

import { REMINDER_OPTIONS } from '../services/reminderService';

const EMPTY_FORM = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  reminder: 0,
};

export default function EventModal({
  isOpen,
  onClose,
  selectedDate,
  editingEvent,
  onSave,
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title || '',
        date: editingEvent.date || '',
        startTime: editingEvent.startTime || '',
        endTime: editingEvent.endTime || '',
        description: editingEvent.description || '',
        reminder: Number(editingEvent.reminder) || 0,
      });

      return;
    }

    setForm({
      ...EMPTY_FORM,
      date: selectedDate || '',
    });
  }, [editingEvent, selectedDate, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === 'reminder' ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.date) {
      return;
    }

    onSave({
      ...form,
      title: form.title.trim(),
      reminder: Number(form.reminder) || 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEvent ? 'Edit Event' : 'Add Event'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Event Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Doctor appointment"
            className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-blue"
            required
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Start
            </label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              End
            </label>

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add some details..."
            className="w-full resize-none rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-accent-blue"
          />
        </div>

        {/* Reminder */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">
            Reminder
          </label>

          <select
            name="reminder"
            value={form.reminder}
            onChange={handleChange}
            className="w-full rounded-lg border border-navy-700 bg-navy-900 px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue"
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="mt-1.5 text-[11px] text-text-muted">
            You will receive a browser notification before this event starts.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-navy-700 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {editingEvent ? 'Update Event' : 'Save Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
