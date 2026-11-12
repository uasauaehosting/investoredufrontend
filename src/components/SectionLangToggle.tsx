/**
 * SectionLangToggle
 *
 * A compact EN / AR toggle button that controls the language for the
 * nearest SectionLangProvider.  Also exposes a "Missing Arabic" fallback
 * policy selector (show English fallback vs. hide the item).
 *
 * Designed to drop into any page header area without changing the overall
 * layout — it is self-contained and reads/writes only section-scoped state.
 */

import { Globe } from 'lucide-react';
import { useSectionLang, type MissingArPolicy } from '../lib/SectionLangContext';
import type { Lang } from '../lib/LanguageContext';

interface SectionLangToggleProps {
  /**
   * When true the missing-AR policy selector is rendered beneath the
   * language buttons.  Defaults to true.
   */
  showPolicySelector?: boolean;
  /** Additional Tailwind classes applied to the outer wrapper. */
  className?: string;
}

export default function SectionLangToggle({
  showPolicySelector = true,
  className = '',
}: SectionLangToggleProps) {
  const { lang, setLang, missingArPolicy, setMissingArPolicy } =
    useSectionLang();

  const langs: { value: Lang; label: string; labelNative: string }[] = [
    { value: 'en', label: 'EN', labelNative: 'English' },
    { value: 'ar', label: 'AR', labelNative: 'العربية' },
  ];

  const policies: { value: MissingArPolicy; label: string }[] = [
    { value: 'show-en', label: 'Show English fallback' },
    { value: 'hide',    label: 'Hide if no Arabic' },
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Language pill toggle */}
      <div className="flex items-center gap-2">
        <Globe size={14} className="text-[#009900] shrink-0" />
        <div
          className="flex rounded-lg border border-[#009900]/30 overflow-hidden text-xs font-semibold"
          role="group"
          aria-label="Section display language"
        >
          {langs.map(({ value, label, labelNative }, i) => (
            <button
              key={value}
              type="button"
              onClick={() => setLang(value)}
              aria-pressed={lang === value}
              title={labelNative}
              className={`
                px-3 py-1.5 transition-colors
                ${lang === value
                  ? 'bg-[#009900] text-white'
                  : 'bg-white text-[#009900] hover:bg-green-50'}
                ${i > 0 ? 'border-s border-[#009900]/30' : ''}
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Active language label */}
        <span className="text-xs text-gray-500 select-none">
          {lang === 'ar' ? 'العربية' : 'English'}
        </span>
      </div>

      {/* Missing-AR policy selector — only visible when Arabic is active */}
      {showPolicySelector && lang === 'ar' && (
        <div className="flex items-center gap-2 ms-6">
          <span className="text-[11px] text-gray-400 shrink-0">
            If no Arabic:
          </span>
          <div
            className="flex rounded-md border border-gray-200 overflow-hidden text-[11px] font-medium"
            role="group"
            aria-label="Fallback policy when Arabic content is missing"
          >
            {policies.map(({ value, label }, i) => (
              <button
                key={value}
                type="button"
                onClick={() => setMissingArPolicy(value)}
                aria-pressed={missingArPolicy === value}
                className={`
                  px-2.5 py-1 transition-colors
                  ${missingArPolicy === value
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'}
                  ${i > 0 ? 'border-s border-gray-200' : ''}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
