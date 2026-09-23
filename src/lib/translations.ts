/**
 * Arabic UI strings extracted from the ar/ static HTML archive.
 * Usage: import { t } from '../lib/translations';
 *        const label = t(lang, 'nav.home');
 *
 * All strings are kept in an `ar` map; the helper returns the Arabic value
 * when lang === 'ar', and falls back to the English default otherwise.
 */

import type { Lang } from './LanguageContext';

const ar: Record<string, string> = {
  // ── Site-wide ──────────────────────────────────────────────────────────────
  'site.tagline': 'بوابة تعليم وتوعية المستثمرين',
  'site.subtitle': 'اتحاد هيئات الأوراق المالية العربية',

  // ── Navigation ─────────────────────────────────────────────────────────────
  'nav.home': 'الصفحة الرئيسية',
  'nav.about': 'عن البوابة',
  'nav.investorEducation': 'تعليم المستثمر',
  'nav.readingMaterials': 'مواد توعوية',
  'nav.principles': 'المبادئ',
  'nav.framework': 'الإطار العام',
  'nav.investmentProducts': 'مواد علمية / المنتجات الاستثمارية',
  'nav.membersActivities': 'أنشطة الأعضاء',
  'nav.publications': 'إصدارات',
  'nav.programs': 'برامج',
  'nav.portals': 'بوابات توعية وتعليم المستثمرين',
  'nav.alertsBulletins': 'التنبيهات والنشرات',
  'nav.financialInclusion': 'الشمول المالي',
  'nav.membersStrategies': 'استراتيجيات وبرامج الأعضاء',
  'nav.globalPolicyAreas': 'السياسات الدولية',
  'nav.financialInclusionIndex': 'مؤشر الشمول المالي',
  'nav.theIndex': 'مؤشر الشمول المالي',
  'nav.membersBenchmarking': 'تقييم أعضاء الاتحاد',
  'nav.additionalResources': 'مواد إضافية',
  'nav.glossary': 'قاموس المصطلحات المالية',
  'nav.feedback': 'تواصل معنا',

  // ── Home page ──────────────────────────────────────────────────────────────
  'home.welcome': 'مرحبا بكم في بوابة تعليم وتوعية المستثمرين',
  'home.latestNews': 'أحدث الأخبار',
  'home.membersPortals': 'بوابات أعضاء اتحاد هيئات الأوراق المالية العربية لتعليم المستثمرين',

  // ── About page ─────────────────────────────────────────────────────────────
  'about.badge': 'عن البوابة',
  'about.title': 'اتحاد هيئات الأوراق المالية العربية: بوابة تعليم وتوعية المستثمرين',
  'about.para1':
    'تأسس اتحاد هيئات الأوراق المالية العربية عام 2007 وهو مؤسسة لا تهدف للربح تتمتع بالشخصية الاعتبارية المستقلة، مقرّه دولة الإمارات العربية المتحدة، ويضم في عضويته هيئات الأوراق المالية والجهات الرقابية على الأسواق. يهدف الاتحاد إلى الارتقاء بالمستوى التشريعي والتنظيمي لأسواق الأوراق المالية العربية بما يحقق العدالة والكفاءة والشفافية، ويهدف أيضا إلى توحيد الجهود للوصول إلى مستويات فعالة للرقابة على المعاملات في أسواق الأوراق المالية العربية. كما يسعى الاتحاد إلى تعزيز التعاون والتنسيق المشترك بين أعضائه لتحقيق أقصى قدر من الانسجام والتوافق فيما يتعلق بالقوانين والأنظمة ذات العلاقة، فضلاً عن تذليل الصعوبات التي تعترض الاستثمار في أسواق الأوراق المالية العربية، وتوسيع قاعدته وتنويع أدواته وتعميق ثقافة الاستثمار.',
  'about.para2':
    'يحظى موضوع رفع مستوى الوعي والتعليم للمستثمرين في الدول العربية، خصوصاً الصغار منهم، باهتمام بالغ نظرا لدوره في رفع مستوى ثقافة الاستثمار وتعزيز كفاءة الأسواق، هو من أولويات الاتحاد ويمثل أحد محاور خطته الاستراتيجية 2016 - 2017 من خلال إنشاء بوابة إلكترونية خاصة بتوعية وتعليم المستثمرين تحتوي على مبادرات الاتحاد والأعضاء على حد سواء في هذا المجال.',
  'about.para3':
    'إن التثقيف المالي يساعد ليس فقط على حماية الأفراد المستثمرين بل يساهم أيضاً في تطوير الأسواق المالية من خلال تعزيز ثقة المستثمرين بهذه الأسواق وهو مكمّل لعمل الهيئات الرقابية المتعلق بالتنظيم والإشراف والتنفيذ. لقد عمدت بعض الهيئات الرقابية إلى جعل عملية تثقيف المستثمر وسيلة مهمة لزيادة المشاركة في أسواق رأس المال إذ تلعب هذه الهيئات دورا هاما في توعية وتعليم المستثمر كما يمكن لكل من القطاعين العام والخاص أن يؤديا دوراً مسانداً في هذا المجال.',

  // ── Principles page ────────────────────────────────────────────────────────
  'principles.badge': 'مواد توعوية',
  'principles.title': 'المبادئ',
  'principles.library': 'مكتبة المبادئ',
  'principles.backToReading': 'العودة إلى مواد القراءة',
  'principles.readMore': 'اقرأ المزيد',
  'principles.empty': 'لم يتم نشر أي مبادئ بعد.',

  // ── Framework page ─────────────────────────────────────────────────────────
  'framework.badge': 'مواد توعوية',
  'framework.title': 'الإطار العام',
  'framework.library': 'مكتبة الإطار العام',
  'framework.backToReading': 'العودة إلى مواد القراءة',
  'framework.readMore': 'اقرأ المزيد',
  'framework.empty': 'لم يتم نشر أي أطر عامة بعد.',

  // ── Portals page ───────────────────────────────────────────────────────────
  'portals.title': 'بوابات توعية وتعليم المستثمرين',
  'portals.sectionTitle': 'بوابات الهيئات الأعضاء',
  'portals.intro':
    'استكشف بوابات تعليم المستثمرين من هيئات الأعضاء في الاتحاد عبر المنطقة العربية. اختر أحد الأعضاء أدناه لعرض بوابتهم والوصول إلى الموارد التعليمية المحلية.',
  'portals.visitPortal': 'زيارة البوابة',
  'portals.visitDesc':
    'زيارة البوابة الرسمية لتعليم المستثمرين للاطلاع على الموارد والأدلة والمواد التوعوية.',
  'portals.available': 'بوابة متاحة',
  'portals.availablePlural': 'بوابات متاحة',
  'portals.empty': 'لا توجد بوابات متاحة حتى الآن.',
  'portals.link': 'حلقة الوصل',

  // ── Members Strategies page ────────────────────────────────────────────────
  'strategies.badge': 'الشمول المالي',
  'strategies.title': 'استراتيجيات وبرامج الأعضاء',
  'strategies.description':
    'تصفح الاستراتيجيات والتقارير ومبادرات الشمول المالي المنشورة من قِبل هيئات الأعضاء في الاتحاد. اختر عضواً أو أكثر وفئة من الفئات أدناه للاطلاع على الموارد وأفضل الممارسات والمشاريع الداعمة للشمول المالي.',
  'strategies.filtersTitle': 'الفلاتر',
  'strategies.memberFilter': 'فلتر الهيئات',
  'strategies.categoryFilter': 'فلتر الفئة',
  'strategies.clearFilters': 'مسح الفلاتر',
  'strategies.selectFilters': 'اختر هيئة أو فئة لعرض الاستراتيجيات والمشاريع.',
  'strategies.loading': 'جارٍ تحميل الموارد...',
  'strategies.found': 'نتيجة',
  'strategies.foundPlural': 'نتائج',
  'strategies.empty': 'لا توجد استراتيجيات أو مشاريع حتى الآن.',

  // ── Category filters ───────────────────────────────────────────────────────
  'filter.strategy': 'استراتيجية',
  'filter.report': 'تقرير',

  // ── Glossary page ──────────────────────────────────────────────────────────
  'glossary.title': 'قاموس المصطلحات المالية',
  'glossary.searchPlaceholder': 'ابحث عن مصطلح...',
  'glossary.download': 'تنزيل ملف PDF',
  'glossary.embed': 'تضمين',
  'glossary.embedInstruction': 'انسخ هذا الكود لتضمين القاموس:',
  'glossary.copy': 'نسخ',
  'glossary.copied': 'تم النسخ!',
  'glossary.colEnglish': 'المصطلح بالإنجليزية',
  'glossary.colFrench': 'المصطلح بالفرنسية',
  'glossary.colArabic': 'المصطلح بالعربية',
  'glossary.colExplanation': 'الشرح',
  'glossary.noResults': 'لا توجد مصطلحات تطابق بحثك.',
  'glossary.termsFound': 'مصطلح موجود',
  'glossary.termsFoundPlural': 'مصطلحات موجودة',

  // ── Alerts & Bulletins ─────────────────────────────────────────────────────
  'alerts.title': 'التنبيهات والنشرات',

  // ── Footer ─────────────────────────────────────────────────────────────────
  'footer.investorEducation': 'تعليم المستثمر',
  'footer.financialInclusion': 'الشمول المالي',
  'footer.links': 'الروابط',
  'footer.address': 'معلومات الاتصال',
  'footer.addressValue': 'الراشدية، أم الرمول دبي، صندوق بريد 117555 دبي، إ.ع.م',
  'footer.phone': '+971 4 290 0000',
  'footer.direct': '+971 4 290 0056',
  'footer.fax': '+971 4 290 0059',
  'footer.email': 'info@uasa.ae',
  'footer.followUs': 'تواصل معنا',
  'footer.copyright': '© 2017 - بوابة تعليم المستثمر - جميع الحقوق محفوظة',
  'footer.privacy': 'سياسة الخصوصية',
  'footer.terms': 'شروط الاستخدام',
  'footer.sitemap': 'خريطة الموقع',
  'footer.educationLinks': ['المبادئ', 'أنشطة الأعضاء', 'التنبيهات والنشرات'],
  'footer.inclusionLinks': ['استراتيجيات وبرامج الأعضاء', 'السياسات الدولية', 'مؤشر الشمول المالي'],

  // ── Breadcrumbs & generic ──────────────────────────────────────────────────
  'bc.home': 'الصفحة الرئيسية',
  'bc.investorEducation': 'تعليم المستثمر',
  'bc.readingMaterials': 'مواد توعوية',
  'bc.membersActivities': 'أنشطة الأعضاء',
  'bc.financialInclusion': 'الشمول المالي',
  'generic.backToReading': 'العودة إلى مواد القراءة',
};

/**
 * Translate a key: returns the Arabic string when lang === 'ar',
 * otherwise returns the provided English default (or the key itself).
 */
export function t(lang: Lang, key: string, defaultEn = ''): string {
  if (lang === 'ar') {
    return ar[key] ?? defaultEn;
  }
  return defaultEn;
}

/** Shorthand: pick the AR map value unconditionally (for const lookup). */
export function arText(key: string): string {
  return ar[key] ?? '';
}

export const AR_STRINGS = ar;
