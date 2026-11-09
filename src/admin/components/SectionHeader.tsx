import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  hint?: ReactNode;
  action?: ReactNode;
}

/**
 * Consistent page-level header used at the top of every editor section.
 */
export default function SectionHeader({ title, description, hint, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        {hint && <div className="mt-1">{hint}</div>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
