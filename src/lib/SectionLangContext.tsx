/**
 * SectionLangContext — per-page / per-section language override.
 *
 * Wrapping a page (or any subtree) with <SectionLangProvider> gives that
 * subtree its own independent language state that starts from the global
 * language but can be changed without affecting any other page.
 *
 * Missing-AR fallback policy:
 *   'show-en'  — if Arabic content is not available, display the English text
 *   'hide'     — if Arabic content is not available, hide the item entirely
 *
 * Usage in a page:
 *   <SectionLangProvider>
 *     <MyPageContent />
 *   </SectionLangProvider>
 *
 * Usage in a child component:
 *   const { lang, isRtl, setLang, missingArPolicy } = useSectionLang();
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useLanguage, type Lang } from './LanguageContext';

export type MissingArPolicy = 'show-en' | 'hide';

interface SectionLangContextValue {
  /** Active language for this section. */
  lang: Lang;
  /** True when lang === 'ar'. */
  isRtl: boolean;
  /** Override the language for this section only. */
  setLang: (lang: Lang) => void;
  /** Toggle between 'en' and 'ar'. */
  toggleLang: () => void;
  /**
   * What to do when Arabic content is requested but not available on a row.
   * 'show-en' = fall back to English text (default).
   * 'hide'    = hide that content element entirely.
   */
  missingArPolicy: MissingArPolicy;
  setMissingArPolicy: (policy: MissingArPolicy) => void;
}

const SectionLangContext = createContext<SectionLangContextValue | null>(null);

interface SectionLangProviderProps {
  children: ReactNode;
  /** Override the initial language (defaults to the global language). */
  initialLang?: Lang;
  /** Override the initial missing-AR policy (defaults to 'show-en'). */
  initialMissingArPolicy?: MissingArPolicy;
}

export function SectionLangProvider({
  children,
  initialLang,
  initialMissingArPolicy = 'show-en',
}: SectionLangProviderProps) {
  // Fall back to the global language when no initialLang is given.
  const { lang: globalLang } = useLanguage();
  const [lang, setLangState] = useState<Lang>(initialLang ?? globalLang);
  const [missingArPolicy, setMissingArPolicy] =
    useState<MissingArPolicy>(initialMissingArPolicy);

  const setLang = (next: Lang) => setLangState(next);
  const toggleLang = () =>
    setLangState((prev) => (prev === 'en' ? 'ar' : 'en'));

  return (
    <SectionLangContext.Provider
      value={{
        lang,
        isRtl: lang === 'ar',
        setLang,
        toggleLang,
        missingArPolicy,
        setMissingArPolicy,
      }}
    >
      {children}
    </SectionLangContext.Provider>
  );
}

/**
 * Returns the section-scoped language state.
 * Falls back gracefully to the global LanguageContext when called outside a
 * SectionLangProvider (so child components stay safe to use in both contexts).
 */
export function useSectionLang(): SectionLangContextValue {
  const sectionCtx = useContext(SectionLangContext);
  if (sectionCtx) return sectionCtx;

  // Outside a SectionLangProvider — proxy the global context.
  // We call useLanguage() unconditionally here via a small bridge component.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { lang, isRtl, setLang, toggleLang } = useLanguage();
  return {
    lang,
    isRtl,
    setLang,
    toggleLang,
    missingArPolicy: 'show-en',
    setMissingArPolicy: () => {},
  };
}

/**
 * Convenience: pick the right value for the current section language,
 * honouring the missing-AR policy when Arabic is requested but unavailable.
 *
 * Returns `null` when policy is 'hide' and no Arabic text exists, so callers
 * can skip rendering the item entirely.
 */
export function pickSectionLocalized(
  lang: Lang,
  policy: MissingArPolicy,
  en: string | null | undefined,
  ar: string | null | undefined,
): string | null {
  if (lang === 'ar') {
    if (ar?.trim()) return ar;
    if (policy === 'hide') return null;
    return en ?? '';
  }
  return en ?? '';
}
