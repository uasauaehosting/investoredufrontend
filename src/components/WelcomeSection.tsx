import { TrendingUp, Shield, Globe } from 'lucide-react';
import { useLocalizedSiteContent } from '../lib/useLocalizedSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { pickField } from '../lib/localizedText';
import { t } from '../lib/translations';

const ICON_MAP = { TrendingUp, Shield, Globe } as const;

// English fallback values
const FALLBACK = {
  badge:    'Welcome',
  badgeAr:  'مرحباً',
  title:    'Welcome to the UASA Investor Education Portal',
  titleAr:  'مرحبا بكم في بوابة تعليم وتوعية المستثمرين',
  paragraphs: [
    'The Union of Arab Securities Authorities (UASA) Investor Education Portal is your gateway to financial knowledge and empowerment. Our mission is to build a financially literate society across the Arab world by providing accessible, accurate, and comprehensive investment education resources.',
    'Whether you are a first-time investor or an experienced market participant, our portal offers tools, guides, and resources to help you make informed financial decisions and navigate Arab capital markets with confidence.',
  ],
  paragraphsAr: [
    'تأسس اتحاد هيئات الأوراق المالية العربية عام 2007 وهو مؤسسة لا تهدف للربح تتمتع بالشخصية الاعتبارية المستقلة، مقرّه دولة الإمارات العربية المتحدة، ويضم في عضويته هيئات الأوراق المالية والجهات الرقابية على الأسواق.',
    'يهدف الاتحاد إلى الارتقاء بالمستوى التشريعي والتنظيمي لأسواق الأوراق المالية العربية بما يحقق العدالة والكفاءة والشفافية، ويسعى إلى تعزيز ثقافة الاستثمار وتوسيع قاعدته في الدول العربية.',
  ],
  ctaText:  'Explore the Portal',
  ctaTextAr:'استكشف البوابة',
  ctaHref:  '#',
  highlights: [
    { icon: 'TrendingUp', title: 'Smart Investing',    description: 'Learn evidence-based strategies to grow your wealth and achieve your financial goals.' },
    { icon: 'Shield',     title: 'Investor Protection', description: 'Understand your rights and how to protect yourself from fraud and financial misconduct.' },
    { icon: 'Globe',      title: 'Arab Capital Markets', description: 'Explore opportunities across Arab financial markets with informed confidence.' },
  ],
  highlightsAr: [
    { icon: 'TrendingUp', title: 'الاستثمار الذكي',      description: 'تعلم استراتيجيات مبنية على الأدلة لتنمية ثروتك وتحقيق أهدافك المالية.' },
    { icon: 'Shield',     title: 'حماية المستثمر',        description: 'افهم حقوقك وكيف تحمي نفسك من الاحتيال والسلوك المالي غير المشروع.' },
    { icon: 'Globe',      title: 'أسواق المال العربية',   description: 'استكشف الفرص في الأسواق المالية العربية بثقة ومعرفة.' },
  ],
};

export default function WelcomeSection() {
  const { lang, isRtl } = useLanguage();
  const { data } = useLocalizedSiteContent(
    'home.welcome',
    FALLBACK,
    ['badge', 'title', 'ctaText'],
    ['paragraphs'],
  );

  // Resolve Arabic-first for each field
  type WelcomeData = typeof FALLBACK & { badgeAr?: string; titleAr?: string; ctaTextAr?: string; paragraphsAr?: string[]; highlightsAr?: typeof FALLBACK.highlightsAr };
  const d = data as WelcomeData;

  const badge      = lang === 'ar' ? (d.badgeAr   || t(lang, 'home.welcome', d.badge))   : d.badge;
  const title      = lang === 'ar' ? (d.titleAr   || t(lang, 'about.title',  d.title))   : d.title;
  const ctaText    = lang === 'ar' ? (d.ctaTextAr || t(lang, 'portals.visitPortal', d.ctaText)) : d.ctaText;
  const paragraphs: string[] =
    lang === 'ar' && Array.isArray(d.paragraphsAr) && d.paragraphsAr.length
      ? d.paragraphsAr
      : (d.paragraphs as string[]);

  const highlights = d.highlights ?? FALLBACK.highlights;
  const highlightsAr = d.highlightsAr ?? FALLBACK.highlightsAr;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: text */}
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-amber-500 rounded" />
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
                {badge}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#009900] leading-tight mb-5">
              {title}
            </h1>
            {paragraphs.map((p, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">{p}</p>
            ))}
            <a
              href={d.ctaHref}
              className="inline-block bg-[#009900] hover:bg-[#006600] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {ctaText}
            </a>
          </div>

          {/* Right: highlight cards */}
          <div className="grid grid-cols-1 gap-4">
            {highlights.map((item, index) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] ?? TrendingUp;
              const arItem = highlightsAr?.[index];
              const cardTitle = lang === 'ar' && arItem?.title
                ? arItem.title
                : pickField(lang, { title: item.title, titleAr: arItem?.title }, 'title');
              const cardDesc = lang === 'ar' && arItem?.description
                ? arItem.description
                : pickField(lang, { description: item.description, descriptionAr: arItem?.description }, 'description');

              return (
                <div
                  key={`${item.title}-${index}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-50 transition-colors group border border-transparent hover:border-green-200"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#009900] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 transition-colors shadow-sm">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#009900] text-sm mb-1">{cardTitle}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{cardDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
