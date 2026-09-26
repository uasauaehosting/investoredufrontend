import { useSiteContent } from '../lib/useSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';

const FALLBACK = {
  content:
    "A guideline on financial inclusion index to be developed based on AFI's financial inclusion index (the Financial Inclusion Data Working Group (FIDWG)) for the UASA members to track the progress of financial inclusion in their nations.",
  contentAr:
    'دليل إرشادي حول مؤشر الشمول المالي الذي سيتم تطويره بناءً على مؤشر الإدماج المالي لأعضاء الاتحاد لتتبع التقدم المحرز في الشمول المالي في دولهم.',
};

export default function TheIndex() {
  const { lang, isRtl } = useLanguage();
  const { data } = useSiteContent('the_index', FALLBACK);

  // Use Arabic content field if available, otherwise fall back to translation map
  const content =
    lang === 'ar'
      ? ((data as typeof FALLBACK).contentAr || t(lang, 'theIndex.description', FALLBACK.contentAr))
      : (data.content as string);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            {t(lang, 'theIndex.badge', 'Financial Inclusion Index')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t(lang, 'theIndex.title', 'The Index')}
          </h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-[#009900] mb-6" dir={isRtl ? 'rtl' : 'ltr'}>
              {t(lang, 'theIndex.sectionTitle', 'Index')}
            </h2>
            <p
              className="text-gray-600 text-base sm:text-lg leading-relaxed"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
