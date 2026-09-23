import { createContext, useContext, useState, type ReactNode } from 'react';

/** Which language content fields are visible in the admin forms. */
export type AdminLangMode = 'en' | 'ar' | 'both';

interface AdminLangContextValue {
  mode: AdminLangMode;
  setMode: (mode: AdminLangMode) => void;
  showEn: boolean;
  showAr: boolean;
}

const STORAGE_KEY = 'uasa-admin-lang-mode';

function readStored(): AdminLangMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'ar' || stored === 'both') return stored;
  } catch {
    // ignore
  }
  return 'both';
}

const AdminLangContext = createContext<AdminLangContextValue | null>(null);

export function AdminLangProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AdminLangMode>(readStored);

  const setMode = (next: AdminLangMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <AdminLangContext.Provider
      value={{
        mode,
        setMode,
        showEn: mode === 'en' || mode === 'both',
        showAr: mode === 'ar' || mode === 'both',
      }}
    >
      {children}
    </AdminLangContext.Provider>
  );
}

export function useAdminLang(): AdminLangContextValue {
  const ctx = useContext(AdminLangContext);
  if (!ctx) throw new Error('useAdminLang must be used within AdminLangProvider');
  return ctx;
}
