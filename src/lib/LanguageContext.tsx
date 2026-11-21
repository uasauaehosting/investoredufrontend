import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Lang = 'en' | 'ar';

interface LanguageContextValue {
  lang: Lang;
  isRtl: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /**
   * Prefix any app-internal path with the current language segment.
   * e.g. prefixPath('/news') → '/en/news'
   * e.g. prefixPath('/') → '/en'
   */
  prefixPath: (path: string) => string;
  /**
   * Switch language and navigate to the equivalent page in the new language.
   * Pass the current pathname so the segment swap is accurate.
   */
  switchLang: (toPath: string) => void;
}

const STORAGE_KEY = 'uasa-lang';

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Extract the lang segment from a pathname that starts with /en or /ar. */
export function extractLangFromPath(pathname: string): Lang | null {
  const segment = pathname.split('/')[1];
  if (segment === 'en' || segment === 'ar') return segment;
  return null;
}

/** Strip the leading /en or /ar segment from a pathname. */
export function stripLangFromPath(pathname: string): string {
  const lang = extractLangFromPath(pathname);
  if (!lang) return pathname;
  const rest = pathname.slice(lang.length + 1); // e.g. '/en/news' → '/news'
  return rest || '/';
}

/** Prepend a lang segment to an app-internal path. */
export function addLangPrefix(lang: Lang, path: string): string {
  const stripped = stripLangFromPath(path); // idempotent — remove existing prefix
  if (stripped === '/') return `/${lang}`;
  return `/${lang}${stripped}`;
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en';
    } catch {
      return 'en';
    }
  });

  const isRtl = lang === 'ar';

  // Apply dir/lang to <html> and persist to localStorage whenever lang changes.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
  }, [lang, isRtl]);

  const setLang = useCallback((newLang: Lang) => setLangState(newLang), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en')),
    [],
  );

  // prefixPath and switchLang are stubbed here because the Provider lives
  // outside the Router (in main.tsx). The real implementations that need
  // useNavigate / useLocation are injected by LanguageSyncer below.
  // Components that need them must call useLanguage() — it always gets the
  // version patched by LanguageSyncer once that mounts.
  const prefixPath = useCallback(
    (path: string) => addLangPrefix(lang, path),
    [lang],
  );

  // switchLang stub — overwritten by LanguageSyncer
  const switchLang = useCallback(
    (_toPath: string) => {
      toggleLang();
    },
    [toggleLang],
  );

  return (
    <LanguageContext.Provider
      value={{ lang, isRtl, setLang, toggleLang, prefixPath, switchLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// ─── LanguageSyncer ─────────────────────────────────────────────────────────

/**
 * Mount this component **inside** BrowserRouter (anywhere in the tree) to
 * keep the URL and the language context in sync bidirectionally:
 *
 * • URL → Context: when the user loads /ar/... the context lang becomes 'ar'.
 * • Context → URL: when setLang / toggleLang is called the URL prefix is
 *   updated to match by patching switchLang on the context value.
 *
 * Place it once, e.g. just inside <Routes> in App.tsx.
 */
export function LanguageSyncer() {
  const { lang, setLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Sync URL → context whenever the pathname changes.
  useEffect(() => {
    const urlLang = extractLangFromPath(location.pathname);
    if (urlLang && urlLang !== lang) {
      setLang(urlLang);
    }
  // We only want to react to pathname changes, not to `lang` changes
  // (that direction is handled by the Header's switchLang call).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Patch switchLang on the context so Header.toggleLang can navigate.
  // We abuse the fact that LanguageContext.Provider value object is mutable
  // through a ref trick — instead, we expose switchLang via a module-level ref
  // that LanguageProvider reads.  The simplest correct approach is to store the
  // navigate function in a module-level mutable cell after mount.
  useEffect(() => {
    _navigateCell.fn = navigate;
  }, [navigate]);

  return null;
}

/** Module-level cell so LanguageProvider can call navigate without being inside Router. */
const _navigateCell: { fn: ReturnType<typeof useNavigate> | null } = { fn: null };

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  // Augment switchLang to use the live navigate function when available.
  const switchLang = useCallback(
    (currentPathname: string) => {
      const currentLang = extractLangFromPath(currentPathname) ?? ctx.lang;
      const newLang: Lang = currentLang === 'en' ? 'ar' : 'en';
      ctx.setLang(newLang);
      const newPath = addLangPrefix(newLang, stripLangFromPath(currentPathname));
      if (_navigateCell.fn) {
        _navigateCell.fn(newPath, { replace: true });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ctx.lang, ctx.setLang],
  );

  return { ...ctx, switchLang };
}
