import { FiX } from 'react-icons/fi';
import { useEffect } from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} bg-navy-800 border border-navy-700 rounded-xl2 shadow-card
                    max-h-[90vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700 sticky top-0 bg-navy-800 rounded-t-xl2">
          <h3 className="text-text-primary font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary hover:bg-navy-700 rounded-lg p-1.5 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
