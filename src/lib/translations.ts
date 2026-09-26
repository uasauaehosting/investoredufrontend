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

// ─────────────────────────────────────────────────────────────────────────────
// The block below is appended — do NOT edit the ar map initialisation above.
// We extend AR_STRINGS after the fact so all keys remain in one place.
// ─────────────────────────────────────────────────────────────────────────────
Object.assign(ar, {

  // ── Investment Products / Literature ──────────────────────────────────────
  'investmentProducts.badge':      'مواد توعوية',
  'investmentProducts.title':      'مواد علمية / المنتجات الاستثمارية',
  'investmentProducts.library':    'مكتبة المنتجات الاستثمارية',
  'investmentProducts.backTo':     'العودة إلى مواد القراءة',
  'investmentProducts.readMore':   'اقرأ المزيد',
  'investmentProducts.empty':      'لم يتم نشر أي منتجات استثمارية بعد.',

  // ── Publications page ──────────────────────────────────────────────────────
  'publications.title':            'إصدارات',
  'publications.sectionTitle':     'أنشطة الأعضاء',
  'publications.authorityLabel':   'الهيئات',
  'publications.authorityAll':     'جميع الهيئات',
  'publications.categoryLabel':    'الفئات',
  'publications.categoryAll':      'جميع الفئات',
  'publications.ctrlHint':         'لاختيار أكثر من هيئة، الرجاء الضغط على Ctrl',
  'publications.ctrlHintCat':      'لاختيار أكثر من فئة، الرجاء الضغط على Ctrl',
  'publications.submit':           'موافق',
  'publications.loading':          'جارٍ التحميل...',
  'publications.resultsTitle':     'الإصدارات',
  'publications.error':            'تعذّر تحميل الإصدارات. الرجاء المحاولة مرة أخرى.',

  // ── Programs page ──────────────────────────────────────────────────────────
  'programs.title':                'برامج',
  'programs.selectMember':         'حدد عضو',
  'programs.submit':               'موافق',
  'programs.loading':              'جارٍ التحميل...',
  'programs.selectFirst':          'الرجاء اختيار عضو.',
  'programs.resultsTitle':         'النتائج',
  'programs.found':                'برنامج',
  'programs.foundPlural':          'برامج',
  'programs.error':                'تعذّر تحميل البرامج. الرجاء المحاولة مرة أخرى.',
  'programs.for':                  'للعضو',

  // ── Alerts & Bulletins ─────────────────────────────────────────────────────
  'alerts.sectionTitle':           'التنبيهات والنشرات',
  'alerts.allYears':               'جميع السنوات',
  'alerts.allAuthorities':         'جميع الهيئات',
  'alerts.authorityCol':           'الهيئات',
  'alerts.loading':                'جارٍ التحميل...',
  'alerts.empty':                  'لم يتم العثور على المحتوى!',
  'alerts.error':                  'تعذّر تحميل التنبيهات والنشرات.',

  // ── Global Policy Areas ────────────────────────────────────────────────────
  'globalPolicy.title':            'السياسات الدولية',
  'globalPolicy.institutionLabel': 'المنظمة / المؤسسة',
  'globalPolicy.institutionAll':   'جميع المنظمات / المؤسسات',
  'globalPolicy.categoryLabel':    'الفئة',
  'globalPolicy.categoryAll':      'جميع الفئات',
  'globalPolicy.ctrlHint':         'لاختيار أكثر من منظمة / مؤسسة، الرجاء الضغط على Ctrl',
  'globalPolicy.ctrlHintCat':      'لاختيار أكثر من فئة، الرجاء الضغط على Ctrl',
  'globalPolicy.submit':           'موافق',
  'globalPolicy.loading':          'جارٍ التحميل...',
  'globalPolicy.resultsTitle':     'السياسات الدولية',
  'globalPolicy.error':            'تعذّر تحميل السياسات الدولية.',

  // ── Financial Inclusion hub ────────────────────────────────────────────────
  'inclusion.title':               'الشمول المالي',
  'inclusion.subtitle':            'تعزيز الشمول المالي في العالم العربي',
  'inclusion.desc':                'تطوير خدمات مالية ميسّرة ومستدامة ومسؤولة لجميع شرائح المجتمع في الدول الأعضاء.',
  'inclusion.strategies':          'الاستراتيجيات والمشاريع',
  'inclusion.strategiesDesc':      'المبادرات الإقليمية الرامية إلى توسيع الوصول المالي والتحول الرقمي.',
  'inclusion.globalPolicy':        'السياسات الدولية',
  'inclusion.globalPolicyDesc':    'مواءمة الأسواق العربية مع معايير G20 ومنظمة OECD للشمول المالي.',
  'inclusion.benchmarking':        'مؤشر القياس',
  'inclusion.benchmarkingDesc':    'رصد التقدم المحرز من خلال مؤشر الشمول المالي للاتحاد.',
  'inclusion.bridgingTitle':       'ردم الفجوة من خلال الابتكار',
  'inclusion.point1':              'تعزيز الثقافة المالية للشباب والمرأة',
  'inclusion.point2':              'دعم شركات التكنولوجيا المالية وأنظمة الدفع الرقمي',
  'inclusion.point3':              'إرساء أطر حماية المستهلك',
  'inclusion.point4':              'القياس الإقليمي وصنع السياسات القائمة على البيانات',
  'inclusion.downloadReport':      'تنزيل التقرير الإقليمي',
  'inclusion.viewDetails':         'عرض التفاصيل',

  // ── Financial Inclusion Index / TheIndex ──────────────────────────────────
  'theIndex.badge':                'مؤشر الشمول المالي',
  'theIndex.title':                'مؤشر الشمول المالي',
  'theIndex.sectionTitle':         'مؤشر',
  'theIndex.description':          'دليل إرشادي حول مؤشر الشمول المالي الذي سيتم تطويره بناءً على مؤشر الإدماج المالي لأعضاء الاتحاد لتتبع التقدم المحرز في الشمول المالي في دولهم.',

  // ── Members Benchmarking ───────────────────────────────────────────────────
  'benchmarking.badge':            'مؤشر الشمول المالي',
  'benchmarking.title':            'تقييم أعضاء الاتحاد',
  'benchmarking.intro':            'مراجعة البيانات المتاحة وعمليات القياس التي يمكن لأعضاء الاتحاد تصميم وتقييم تطبيق حوكمة الشركات في بلدانهم (استناداً إلى دليل الاتحاد)',
  'benchmarking.yearLabel':        'السنة',
  'benchmarking.allYears':         'جميع السنوات',
  'benchmarking.allAuthorities':   'جميع الهيئات',
  'benchmarking.authorityCol':     'الهيئات',
  'benchmarking.yearCol':          'السنة',
  'benchmarking.titleCol':         'العنوان',
  'benchmarking.detailsCol':       'التفاصيل',
  'benchmarking.view':             'عرض',
  'benchmarking.noContent':        'لم يتم العثور على المحتوى!',
  'benchmarking.loading':          'جارٍ تحميل بيانات التقييم...',
  'benchmarking.ctrlHint':         'اضغط Ctrl (ويندوز) أو Cmd (ماك) لتحديد سنوات متعددة',

  // ── Additional Resources ───────────────────────────────────────────────────
  'additionalResources.badge':     'مؤشر الشمول المالي',
  'additionalResources.title':     'مواد إضافية',
  'additionalResources.intro':     'استكشف التقارير التكميلية والمبادئ التوجيهية والمواد المرجعية المتعلقة بمؤشر الشمول المالي للاتحاد وجهود القياس الإقليمية.',
  'additionalResources.empty':     'لم يتم العثور على المحتوى!',

  // ── Feedback page ──────────────────────────────────────────────────────────
  'feedback.title':                'تواصل معنا',
  'feedback.subtitle':             'رأيك يهمنا. ساعدنا في تحسين البوابة أو تواصل معنا باستفساراتك.',
  'feedback.formTitle':            'أرسل لنا رسالة',
  'feedback.namePlaceholder':      'الاسم الكامل',
  'feedback.emailPlaceholder':     'البريد الإلكتروني',
  'feedback.subjectLabel':         'الموضوع',
  'feedback.subjectPlaceholder':   'استفسار عام',
  'feedback.messagePlaceholder':   'كيف يمكننا مساعدتك؟',
  'feedback.sending':              'جارٍ الإرسال...',
  'feedback.sendBtn':              'إرسال',
  'feedback.success':              'شكراً! تم إرسال رسالتك بنجاح.',
  'feedback.error':                'عذراً، حدث خطأ ما. الرجاء المحاولة مرة أخرى.',
  'feedback.contactTitle':         'معلومات الاتصال',
  'feedback.emailLabel':           'راسلنا',
  'feedback.websiteLabel':         'الموقع الإلكتروني',
  'feedback.nameLabel':            'الاسم',
  'feedback.orgLabel':             'جهة العمل',
  'feedback.countryLabel':         'البلد',
  'feedback.contentLabel':         'المحتوى',

  // ── Detail pages (Principle / Framework) ─────────────────────────────────
  'detail.loading':                'جارٍ التحميل...',
  'detail.principleNotFound':      'لم يتم العثور على المبدأ.',
  'detail.frameworkNotFound':      'لم يتم العثور على الإطار العام.',
  'detail.backToPrinciples':       'العودة إلى المبادئ',
  'detail.backToFramework':        'العودة إلى الإطار العام',
  'detail.principlesBadge':        'المبادئ',
  'detail.frameworkBadge':         'الإطار العام',

  // ── Generic shared ─────────────────────────────────────────────────────────
  'generic.submit':                'موافق',
  'generic.loading':               'جارٍ التحميل...',
  'generic.noContent':             'لم يتم العثور على المحتوى!',
  'generic.ctrlHint':              'لاختيار أكثر من خيار، الرجاء الضغط على Ctrl',
  'generic.all':                   'الكل',
  'generic.results':               'نتيجة',
  'generic.resultsPlural':         'نتائج',
  'generic.view':                  'عرض',
  'generic.error':                 'تعذّر التحميل. الرجاء المحاولة مرة أخرى.',
});

// ── Additional strings for pages / result tables identified in audit ──────────
Object.assign(ar, {

  // ── InvestorEducation hub page ───────────────────────────────────────────────
  'education.badge':       'مركز التعلم',
  'education.hero.title':  'تمكين المستثمرين من خلال التعليم',
  'education.hero.desc':   'استكشف ثروة من الموارد المصممة لمساعدتك على التنقل في أسواق المال العربية بثقة ووضوح.',
  'education.learnMore':   'اعرف أكثر',
  'education.didYouKnow':  'هل تعلم؟',
  'education.callout.title': 'التعليم هو أفضل استثمار يمكنك القيام به.',
  'education.callout.desc':  'تتمركز بوابة الاتحاد الجهود التعليمية لأكثر من 16 هيئة للأوراق المالية العربية، مما يوفر لك مرجعاً موحداً لمبادئ الاستثمار وإدارة المخاطر.',
  'education.bullet1':     'موارد متعددة اللغات بالعربية والإنجليزية',
  'education.bullet2':     'أطر مالية منسقة من قبل خبراء',

  // ── News section (homepage & NewsList) ────────────────────────────────────
  'news.sectionTitle':     'أحدث الأخبار',
  'news.sectionSubtitle':  'ابق على اطلاع بأحدث أخبار تعليم المستثمرين في الأسواق العربية',
  'news.viewAll':          'عرض جميع الأخبار',
  'news.readMore':         'اقرأ المزيد',
  'news.download':         'تنزيل',
  'news.allNewsTitle':     'جميع الأخبار',
  'news.backToHome':       'العودة إلى الرئيسية',
  'news.empty':            'لا توجد أخبار حتى الآن.',
  'news.error':            'تعذّر تحميل الأخبار.',
  'news.loading':          'جارٍ التحميل...',
  'news.notFound':         'الخبر غير موجود.',
  'news.backToNews':       'العودة إلى الأخبار',
  'news.downloadDoc':      'تنزيل المستند',

  // ── EducationSectionList ──────────────────────────────────────────────────
  'educationList.readMore':  'اقرأ المزيد',
  'educationList.empty':     'لا توجد محتويات حتى الآن.',
  'educationList.error':     'تعذّر تحميل المحتوى.',
  'educationList.backTo':    'العودة إلى',

  // ── EducationItemDetail ───────────────────────────────────────────────────
  'educationDetail.loading':  'جارٍ التحميل...',
  'educationDetail.notFound': 'المحتوى غير موجود.',
  'educationDetail.backTo':   'العودة إلى',

  // ── InvestmentProductDetail ───────────────────────────────────────────────
  'investProduct.loading':   'جارٍ التحميل...',
  'investProduct.notFound':  'المنتج الاستثماري غير موجود.',
  'investProduct.backLink':  'العودة إلى المواد العلمية / المنتجات الاستثمارية',
  'investProduct.badge':     'مواد علمية / المنتجات الاستثمارية',

  // ── Result table shared strings ───────────────────────────────────────────
  'table.title':            'العنوان',
  'table.type':             'النوع',
  'table.category':         'الفئة',
  'table.description':      'الوصف',
  'table.urlFile':          'الرابط / الملف',
  'table.date':             'التاريخ',
  'table.link':             'الرابط',
  'table.noDesc':           'لا يوجد وصف متاح.',
  'table.viewDesc':         'عرض الوصف',
  'table.close':            'إغلاق',
  'table.noContent':        'لم يتم العثور على المحتوى!',
  'table.general':          'عام',
  'table.num':              '#',
  'table.programElement':   'عنصر البرنامج',

  // ── Programs result table section headings ────────────────────────────────
  'programs.section.generalInfo':         'معلومات عامة',
  'programs.section.educationMaterials':  'مواد تعليم المستثمرين',
  'programs.section.specificMaterials':   'المواد والمناهج المحددة',
  'programs.section.assistingGroups':     'مساعدة مجموعات معينة',
  'programs.section.evaluation':          'التقييم والبحوث',
  'programs.section.successfulPrograms':  'البرامج الناجحة',

  // ── Empty / no match strings ──────────────────────────────────────────────
  'noMatch.strategies':   'لا توجد موارد تطابق الفلاتر المحددة. جرّب تعديل اختيارك.',
  'noMatch.publications': 'لا توجد إصدارات تطابق الفلاتر المحددة.',
  'noMatch.programs':     'لا توجد برامج تطابق الفلاتر المحددة.',
  'noMatch.globalPolicy': 'لا توجد سياسات دولية تطابق الفلاتر المحددة.',
});
