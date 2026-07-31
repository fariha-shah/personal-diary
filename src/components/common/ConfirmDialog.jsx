import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex gap-3">
        <div className="shrink-0 bg-accent-red/10 text-accent-red p-2.5 rounded-lg h-fit">
          <FiAlertTriangle size={20} />
        </div>
        <p className="text-text-secondary text-sm">{message}</p>
      </div>

      <div className="flex gap-3 pt-5">
        <Button variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
