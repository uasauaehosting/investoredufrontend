import { Save, X } from 'lucide-react';

interface DrawerFooterProps {
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
  saveLabel?: string;
  error?: string | null;
  success?: boolean;
}

/**
 * Reusable sticky footer for every editor drawer.
 * Shows Save / Cancel with optional error / success feedback.
 */
export default function DrawerFooter({
  onSave,
  onCancel,
  saving = false,
  saveLabel = 'Save',
  error,
  success,
}: DrawerFooterProps) {
  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          ✓ Saved successfully
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary flex items-center gap-1.5"
        >
          <Save size={14} />
          {saving ? 'Saving…' : saveLabel}
        </button>
        <button onClick={onCancel} className="btn-ghost flex items-center gap-1.5">
          <X size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}
