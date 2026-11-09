import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useLocalizedSiteContent } from '../lib/useLocalizedSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { pickField } from '../lib/localizedText';
import { t } from '../lib/translations';
import { normalizeMediaUrl } from '../lib/mediaUrl';

// ── Fallback content ──────────────────────────────────────────────────────────

const FALLBACK_PARAGRAPHS_EN = [
  'Established in 2007, the Union of Arab Securities Authorities (UASA henceforth) is not a profit entity with an independent legal status. The United Arab Emirates is the headquarters of the Union. The Members of the Union are Arab Securities Authorities and markets Regulators.',
  'The UASA aims to improve the legislative and regulatory framework of Arab securities markets with a view to achieving fairness, efficiency and transparency. It also seeks to unify efforts towards achieving effective levels of oversight over transactions in the Arab securities markets and to ensure coordination and cooperation among members to achieve maximum harmony and consistency with regard to relevant laws and regulations applicable in the Member States. The Union also aims to overcome difficulties facing investment in the Arab securities markets, and to expand the investment base, diversify its tools and promote the culture of investing in these markets.',
  "Raising awareness and education of investors in Arab countries, especially those with limited resources, is one of the Union's priorities and a main pillar of its strategic plan 2016 – 2017, and has a particular importance as it enhances investment culture and market efficiency. By setting up this web portal that includes investors' awareness and education initiatives of the Union's members.",
  "Investor education and awareness helps not only to protect investors, but it also contributes to the development of capital markets by enhancing investors' confidence as it complements the work on regulations, supervision and enforcement. Some regulators have used investor education as an important means to increase participation in the capital markets. Normally, regulators play a key role in investor education and in raising investor awareness. However, both public and private sectors could also play a supporting role in this regard.",
];

const FALLBACK_PARAGRAPHS_AR = [
  'تأسس اتحاد هيئات الأوراق المالية العربية عام 2007 وهو مؤسسة لا تهدف للربح تتمتع بالشخصية الاعتبارية المستقلة، مقرّه دولة الإمارات العربية المتحدة، ويضم في عضويته هيئات الأوراق المالية والجهات الرقابية على الأسواق. يهدف الاتحاد إلى الارتقاء بالمستوى التشريعي والتنظيمي لأسواق الأوراق المالية العربية بما يحقق العدالة والكفاءة والشفافية.',
  'يسعى الاتحاد إلى تعزيز التعاون والتنسيق المشترك بين أعضائه لتحقيق أقصى قدر من الانسجام والتوافق فيما يتعلق بالقوانين والأنظمة ذات العلاقة، فضلاً عن تذليل الصعوبات التي تعترض الاستثمار في أسواق الأوراق المالية العربية، وتوسيع قاعدته وتنويع أدواته وتعميق ثقافة الاستثمار.',
  'يحظى موضوع رفع مستوى الوعي والتعليم للمستثمرين في الدول العربية، خصوصاً الصغار منهم، باهتمام بالغ نظرا لدوره في رفع مستوى ثقافة الاستثمار وتعزيز كفاءة الأسواق، هو من أولويات الاتحاد ويمثل أحد محاور خطته الاستراتيجية 2016 - 2017 من خلال إنشاء بوابة إلكترونية خاصة بتوعية وتعليم المستثمرين.',
  'إن التثقيف المالي يساعد ليس فقط على حماية الأفراد المستثمرين بل يساهم أيضاً في تطوير الأسواق المالية من خلال تعزيز ثقة المستثمرين بهذه الأسواق وهو مكمّل لعمل الهيئات الرقابية المتعلق بالتنظيم والإشراف والتنفيذ.',
];

const HERO_FALLBACK = {
  badge: 'About UASA',
  badgeAr: 'عن البوابة',
  title: 'The Union Of Arab Securities Authorities: Investor Education & Awareness Portal',
  titleAr: 'اتحاد هيئات الأوراق المالية العربية: بوابة تعليم وتوعية المستثمرين',
  sidebarImage: '',
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Section {
  content: string;
  contentAr?: string;
  imageUrl?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function About() {
  const { lang } = useLanguage();
  const { data: hero } = useLocalizedSiteContent('about.hero', HERO_FALLBACK, ['badge', 'title']);
  const [sections, setSections] = useState<Section[]>([]);

  const isRtl = lang === 'ar';
  const fallbackParagraphs = isRtl ? FALLBACK_PARAGRAPHS_AR : FALLBACK_PARAGRAPHS_EN;

  useEffect(() => {
    api
      .get('/about/sections')
      .then((data) => setSections(Array.isArray(data) && data.length > 0 ? data : []))
      .catch(() => setSections([]));
  }, [lang]);

  const isFallback = sections.length === 0;

  // Sidebar image comes from site_content (about.hero.sidebarImage) — set in admin under "About — Hero"
  const sidebarImage = normalizeMediaUrl((hero as any).sidebarImage) || null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* ── Hero banner ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#006600] via-[#009900] to-[#00b300]">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28" dir={isRtl ? 'rtl' : 'ltr'}>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#006600] text-xs font-bold rounded-full mb-6 tracking-widest uppercase shadow-sm">
            {t(lang, 'about.badge', hero.badge)}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-4xl">
            {t(lang, 'about.title', hero.title)}
          </h1>
          <div className="h-1 w-20 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Inner two-column layout */}
          <div className={`flex flex-col lg:flex-row ${isRtl ? 'lg:flex-row-reverse' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>

            {/* ── Left column: image / logo sidebar ──────────────────────── */}
            <div className={`lg:w-64 xl:w-72 flex-shrink-0 bg-gray-50 border-b lg:border-b-0 ${isRtl ? 'lg:border-l' : 'lg:border-r'} border-gray-100 flex flex-col items-center justify-start gap-6 p-8`}>

              {sidebarImage && sidebarImage.length > 0 ? (
                /* Image set via CMS → About — Hero → Sidebar Image */
                <div className="w-full rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={sidebarImage}
                    alt="UASA"
                    className="w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ) : (
                /* Default: UASA logo placeholder matching the screenshot style */
                <div className="flex flex-col items-center gap-3 pt-4">
                  {/* Emblem ring */}
                  <div className="w-24 h-24 rounded-full border-4 border-[#009900] flex items-center justify-center bg-white shadow-md">
                    <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Simplified UASA-style geometric emblem */}
                      <circle cx="40" cy="40" r="36" stroke="#009900" strokeWidth="2" fill="none"/>
                      <polygon points="40,10 50,32 74,32 55,47 62,70 40,56 18,70 25,47 6,32 30,32" fill="#009900" opacity="0.15" stroke="#009900" strokeWidth="1.5"/>
                      <text x="40" y="44" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#009900" fontFamily="serif">UASA</text>
                    </svg>
                  </div>
                  <p className="text-center text-xs font-bold text-[#009900] leading-snug tracking-wide uppercase">
                    {isRtl ? 'اتحاد هيئات الأوراق المالية العربية' : 'Union of Arab Securities Authorities'}
                  </p>
                  <div className="w-16 h-0.5 bg-[#009900]/30 rounded-full" />
                </div>
              )}
            </div>

            {/* ── Right column: title + all paragraphs ───────────────────── */}
            <div className="flex-1 min-w-0 p-8 sm:p-10 lg:p-12">

              {/* Section title */}
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 uppercase tracking-wide leading-snug border-b-2 border-[#009900] pb-3">
                {t(lang, 'about.title', hero.title)}
              </h2>

              {/* All paragraphs / rich content — continuous flow, no cards */}
              <div className="space-y-5">
                {isFallback
                  ? fallbackParagraphs.map((text, i) => (
                      <p key={i} className="text-gray-700 text-sm sm:text-base leading-relaxed">
                        {text}
                      </p>
                    ))
                  : sections.map((section, i) => {
                      const text = pickField(lang, { content: section.content, contentAr: section.contentAr }, 'content');
                      return (
                        <div
                          key={i}
                          className="text-gray-700 text-sm sm:text-base leading-relaxed prose prose-sm prose-gray max-w-none"
                          dangerouslySetInnerHTML={{ __html: text }}
                        />
                      );
                    })
                }
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
