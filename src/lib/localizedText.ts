import type { Lang } from './LanguageContext';

/** Pick Arabic text when lang is ar and Arabic value exists; otherwise English. */
export function pickLocalized(
  lang: Lang,
  en: string | null | undefined,
  ar: string | null | undefined,
): string {
  if (lang === 'ar' && ar?.trim()) return ar;
  return en ?? '';
}

/** Pick localized value from an object using `field` (en) and `fieldAr` (ar). */
export function pickField<T extends Record<string, unknown>>(
  lang: Lang,
  obj: T,
  field: string,
): string {
  const en = obj[field] as string | undefined;
  const ar = obj[`${field}Ar`] as string | undefined;
  return pickLocalized(lang, en, ar);
}

/** Localize string arrays stored as `field` / `fieldAr`. */
export function pickLocalizedArray(
  lang: Lang,
  en: string[] | null | undefined,
  ar: string[] | null | undefined,
): string[] {
  if (lang === 'ar' && Array.isArray(ar) && ar.some((s) => s?.trim())) {
    return ar;
  }
  return en ?? [];
}

/** Apply Arabic overrides to a site-content block (flat string + array fields). */
export function localizeBlock<T extends Record<string, unknown>>(
  lang: Lang,
  data: T,
  stringFields: string[],
  arrayFields: string[] = [],
): T {
  if (lang !== 'ar') return data;
  const result = { ...data } as T & Record<string, unknown>;
  for (const field of stringFields) {
    const ar = data[`${field}Ar` as keyof T] as string | undefined;
    if (ar?.trim()) result[field as keyof T] = ar as T[keyof T];
  }
  for (const field of arrayFields) {
    const ar = data[`${field}Ar` as keyof T] as string[] | undefined;
    if (Array.isArray(ar) && ar.some((s) => s?.trim())) {
      result[field as keyof T] = ar as T[keyof T];
    }
  }
  return result;
}
