import { useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { localizeBlock } from './localizedText';
import { useSiteContent } from './useSiteContent';

/** Site content hook that applies Arabic overrides when lang is ar. */
export function useLocalizedSiteContent<T extends Record<string, unknown>>(
  key: string,
  fallback: T,
  stringFields: string[],
  arrayFields: string[] = [],
) {
  const { lang } = useLanguage();
  const { data, loading } = useSiteContent(key, fallback);
  const localized = useMemo(
    () => localizeBlock(lang, data as T & Record<string, unknown>, stringFields, arrayFields),
    [lang, data, stringFields, arrayFields],
  );
  return { data: localized, loading };
}
