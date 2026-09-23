import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useLocalizedSiteContent } from '../lib/useLocalizedSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { pickField } from '../lib/localizedText';
import { t } from '../lib/translations';

// English fallback paragraphs
const FALLBACK_PARAGRAPHS_EN = [
  'Established in 2007, the Union of Arab Securities Authorities (UASA henceforth) is not a profit entity with an independent legal status. The United Arab Emirates is the headquarters of the Union. The Members of the Union are Arab Securities Authorities and markets Regulators.',
  'The UASA aims to improve the legislative and regulatory framework of Arab securities markets with a view to achieving fairness, efficiency and transparency. It also seeks to unify efforts towards achieving effective levels of oversight over transactions in the Arab securities markets and to ensure coordination and cooperation among members to achieve maximum harmony and consistency with regard to relevant laws and regulations applicable in the Member States. The Union also aims to overcome difficulties facing investment in the Arab securities markets, and to expand the investment base, diversify its tools and promote the culture of investing in these markets.',
  "Raising awareness and education of investors in Arab countries, especially those with limited resources, is one of the Union's priorities and a main pillar of its strategic plan 2016 – 2017, and has a particular importance as it enhances investment culture and market efficiency. By setting up this web portal that includes investors' awareness and education initiatives of the Union's members.",
  "Investor education and awareness helps not only to protect investors, but it also contributes to the development of capital markets by enhancing investors' confidence as it complements the work on regulations, supervision and enforcement. Some regulators have used investor education as an important means to increase participation in the capital markets. Normally, regulators play a key role in investor education and in raising investor awareness. However, both public and private sectors could also play a supporting role in this regard.",
];

// Arabic fallback paragraphs — extracted from ar/About.html
const FALLBACK_PARAGRAPHS_AR = [
  'تأسس اتحاد هيئات الأوراق المالية العربية عام 2007 وهو مؤسسة لا تهدف للربح تتمتع بالشخصية الاعتبارية المستقلة، مقرّه دولة الإمارات العربية المتحدة، ويضم في عضويته هيئات الأوراق المالية والجهات الرقابية على الأسواق. يهدف الاتحاد إلى الارتقاء بالمستوى التشريعي والتنظيمي لأسواق الأوراق المالية العربية بما يحقق العدالة والكفاءة والشفافية، ويهدف أيضا إلى توحيد الجهود للوصول إلى مستويات فعالة للرقابة على المعاملات في أسواق الأوراق المالية العربية. كما يسعى الاتحاد إلى تعزيز التعاون والتنسيق المشترك بين أعضائه لتحقيق أقصى قدر من الانسجام والتوافق فيما يتعلق بالقوانين والأنظمة ذات العلاقة، فضلاً عن تذليل الصعوبات التي تعترض الاستثمار في أسواق الأوراق المالية العربية، وتوسيع قاعدته وتنويع أدواته وتعميق ثقافة الاستثمار.',
  'يحظى موضوع رفع مستوى الوعي والتعليم للمستثمرين في الدول العربية، خصوصاً الصغار منهم، باهتمام بالغ نظرا لدوره في رفع مستوى ثقافة الاستثمار وتعزيز كفاءة الأسواق، هو من أولويات الاتحاد ويمثل أحد محاور خطته الاستراتيجية 2016 - 2017 من خلال إنشاء بوابة إلكترونية خاصة بتوعية وتعليم المستثمرين تحتوي على مبادرات الاتحاد والأعضاء على حد سواء في هذا المجال.',
  'إن التثقيف المالي يساعد ليس فقط على حماية الأفراد المستثمرين بل يساهم أيضاً في تطوير الأسواق المالية من خلال تعزيز ثقة المستثمرين بهذه الأسواق وهو مكمّل لعمل الهيئات الرقابية المتعلق بالتنظيم والإشراف والتنفيذ. لقد عمدت بعض الهيئات الرقابية إلى جعل عملية تثقيف المستثمر وسيلة مهمة لزيادة المشاركة في أسواق رأس المال إذ تلعب هذه الهيئات دورا هاما في توعية وتعليم المستثمر كما يمكن لكل من القطاعين العام والخاص أن يؤديا دوراً مسانداً في هذا المجال.',
];

const HERO_FALLBACK = {
  badge: 'About UASA',
  badgeAr: 'عن البوابة',
  title: 'The Union Of Arab Securities Authorities: Investor Education & Awareness Portal',
  titleAr: 'اتحاد هيئات الأوراق المالية العربية: بوابة تعليم وتوعية المستثمرين',
};

export default function About() {
  const { lang } = useLanguage();
  const { data: hero } = useLocalizedSiteContent('about.hero', HERO_FALLBACK, ['badge', 'title']);
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  // Derive static fallback based on current language
  const fallbackParagraphs =
    lang === 'ar' ? FALLBACK_PARAGRAPHS_AR : FALLBACK_PARAGRAPHS_EN;

  useEffect(() => {
    api
      .get('/about/sections')
      .then((sections) => {
        if (Array.isArray(sections) && sections.length > 0) {
          setParagraphs(
            sections.map((s: { content: string; contentAr?: string }) =>
              pickField(lang, { content: s.content, contentAr: s.contentAr }, 'content'),
            ),
          );
        } else {
          // API returned empty — use static fallback for chosen language
          setParagraphs([]);
        }
      })
      .catch(() => setParagraphs([]));
  }, [lang]);

  // Use API paragraphs if loaded, otherwise fall back to static translations
  const displayParagraphs = paragraphs.length > 0 ? paragraphs : fallbackParagraphs;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
              {t(lang, 'about.badge', hero.badge)}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t(lang, 'about.title', hero.title)}
            </h1>
            <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {displayParagraphs.map((text, index) => (
              <p
                key={index}
                className="text-gray-600 text-base sm:text-lg leading-relaxed"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
