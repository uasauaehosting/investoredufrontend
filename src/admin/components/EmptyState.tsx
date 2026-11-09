import type { ReactNode } from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Consistent empty-state block shown when a list has no items.
 */
export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
      <div className="mb-4 text-gray-300">
        {icon ?? <PlusCircle size={40} strokeWidth={1.5} />}
      </div>
      <p className="text-sm font-semibold text-gray-600">{title}</p>
      {description && <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
