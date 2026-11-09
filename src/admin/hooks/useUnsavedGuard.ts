import { useEffect, useRef } from 'react';

/**
 * Warns the user before they navigate away (browser tab close / refresh)
 * when there are unsaved changes in an editor form.
 *
 * Usage:
 *   const { markDirty, markClean } = useUnsavedGuard();
 *
 *   // call markDirty() whenever the form changes
 *   // call markClean() after a successful save or cancel
 */
export function useUnsavedGuard() {
  const dirty = useRef(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const markDirty = () => { dirty.current = true; };
  const markClean = () => { dirty.current = false; };

  /**
   * Call this before navigating away from the section (e.g. sidebar click).
   * Returns true if safe to navigate, false if user cancelled.
   */
  const confirmLeave = (): boolean => {
    if (!dirty.current) return true;
    const ok = window.confirm(
      'You have unsaved changes. Leave without saving?'
    );
    if (ok) dirty.current = false;
    return ok;
  };

  return { markDirty, markClean, confirmLeave };
}
