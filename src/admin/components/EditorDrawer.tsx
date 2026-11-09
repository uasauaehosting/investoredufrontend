import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface EditorDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Sticky footer: Save / Cancel buttons */
  footer: ReactNode;
  children: ReactNode;
  width?: string;
}

/**
 * Right-side slide-over drawer used by all content editors.
 * The list stays fully visible behind it (backdrop dims on mobile).
 */
export default function EditorDrawer({
  open,
  onClose,
  title,
  subtitle,
  footer,
  children,
  width = 'max-w-xl',
}: EditorDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll while open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`
          fixed inset-y-0 end-0 z-50 flex flex-col bg-white shadow-2xl
          w-full ${width}
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-800 truncate">{title}</h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {children}
        </div>

        {/* Sticky footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      </div>
    </>
  );
}
