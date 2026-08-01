import { useEffect, useState } from 'react';

import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

import { REMINDER_OPTIONS } from '../services/reminderService';
import { EVENT_COLORS } from '../services/eventColors';

const EMPTY_FORM = {
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  reminder: 0,
  color: 'purple',
};

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50';

const labelClass = 'mb-1.5 block text-xs font-semibold text-slate-600';

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
        color: editingEvent.color || 'purple',
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

  const handleSelectColor = (colorId) => {
    setForm((current) => ({ ...current, color: colorId }));
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
      color: form.color || 'purple',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingEvent ? 'Edit Event' : 'Add Event'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelClass}>Event Title</label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Doctor appointment"
            className={inputClass}
            required
          />
        </div>

        {/* Date & time */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Start</label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>End</label>

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add some details..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Color */}
        <div>
          <label className={labelClass}>Color</label>

          <div className="flex flex-wrap gap-2">
            {EVENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => handleSelectColor(color.id)}
                className={`h-7 w-7 rounded-full ${color.dot} transition-all ${
                  form.color === color.id
                    ? 'ring-2 ring-violet-500 ring-offset-2'
                    : 'opacity-50 hover:opacity-90'
                }`}
                aria-label={color.label}
              />
            ))}
          </div>
        </div>

        {/* Reminder */}
        <div>
          <label className={labelClass}>Reminder</label>

          <select
            name="reminder"
            value={form.reminder}
            onChange={handleChange}
            className={inputClass}
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <p className="mt-1.5 text-[11px] text-slate-400">
            You will get an in-app popup, plus a browser notification if
            allowed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
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
