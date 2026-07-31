import { FiInbox } from 'react-icons/fi';

export default function EmptyState({
  icon: Icon = FiInbox,
  message = 'Nothing here yet',
  subMessage,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-navy-700/50 rounded-full p-4 mb-3">
        <Icon size={28} className="text-text-muted" />
      </div>
      <p className="text-text-primary font-medium">{message}</p>
      {subMessage && (
        <p className="text-text-secondary text-sm mt-1 max-w-xs">
          {subMessage}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
