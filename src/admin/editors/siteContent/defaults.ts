import type {
  HomeWelcomeContent,
  HomePortalContent,
  HomeMembersHeaderContent,
  AboutHeroContent,
  PrinciplesPageContent,
  FrameworkPageContent,
  TheIndexContent,
  BenchmarkingPageContent,
  AdditionalResourcesContent,
  FeedbackContent,
  FooterContent,
  GlossaryMetaContent,
} from './PageForms';

export const PAGE_KEYS = [
  { key: 'home.welcome',         label: 'Home — Welcome Section' },
  { key: 'home.portal_section',  label: 'Home — Portal Banner & Cards' },
  { key: 'home.members_header',  label: 'Home — Members Section Banner' },
  { key: 'about.hero', label: 'About — Hero' },
  { key: 'principles', label: 'Principles Page' },
  { key: 'framework', label: 'Framework Page' },
  { key: 'the_index', label: 'The Index Page' },
  { key: 'benchmarking', label: 'Benchmarking Page' },
  { key: 'additional_resources', label: 'Additional Resources' },
  { key: 'feedback', label: 'Feedback Page' },
  { key: 'footer', label: 'Footer Links & Contact' },
  { key: 'glossary_meta', label: 'Glossary Page Meta' },
] as const;

export type PageKey = (typeof PAGE_KEYS)[number]['key'];

export const DEFAULTS: Record<PageKey, Record<string, unknown>> = {
  'home.welcome': {
    badge: 'Welcome',
    badgeAr: 'مرحباً',
    title: 'Welcome to the UASA Investor Education Portal',
    titleAr: 'مرحبا بكم في بوابة تعليم وتوعية المستثمرين',
    paragraphs: [''],
    paragraphsAr: [
      'تأسس اتحاد هيئات الأوراق المالية العربية عام 2007 وهو مؤسسة لا تهدف للربح تتمتع بالشخصية الاعتبارية المستقلة، مقرّه دولة الإمارات العربية المتحدة، ويضم في عضويته هيئات الأوراق المالية والجهات الرقابية على الأسواق.',
      'يهدف الاتحاد إلى الارتقاء بالمستوى التشريعي والتنظيمي لأسواق الأوراق المالية العربية بما يحقق العدالة والكفاءة والشفافية، ويسعى إلى تعزيز ثقافة الاستثمار وتوسيع قاعدته في الدول العربية.',
    ],
    ctaText: 'Explore the Portal',
    ctaTextAr: 'استكشف البوابة',
    ctaHref: '#',
    highlights: [{ icon: 'TrendingUp', title: '', description: '' }],
    highlightsAr: [
      { icon: 'TrendingUp', title: 'الاستثمار الذكي',    description: 'تعلم استراتيجيات مبنية على الأدلة لتنمية ثروتك وتحقيق أهدافك المالية.' },
      { icon: 'Shield',     title: 'حماية المستثمر',      description: 'افهم حقوقك وكيف تحمي نفسك من الاحتيال والسلوك المالي غير المشروع.' },
      { icon: 'Globe',      title: 'أسواق المال العربية', description: 'استكشف الفرص في الأسواق المالية العربية بثقة ومعرفة.' },
    ],
  } satisfies HomeWelcomeContent,
  'home.portal_section': {
    heroImage: '',
    heroTitle: 'UASA INVESTOR EDUCATION PORTAL',
    heroTitleAr: 'بوابة اتحاد هيئات الأوراق المالية العربية لتعليم وتوعية المستثمرين',
    cards: [{ title: '', titleAr: '', imageAr: '', href: '', image_url: '' }],
  } satisfies HomePortalContent,
  'home.members_header': {
    headerImage: '',
  } satisfies HomeMembersHeaderContent,
  'about.hero': {
    badge: 'About UASA',
    badgeAr: 'عن الاتحاد',
    title: '',
    titleAr: 'اتحاد هيئات الأوراق المالية العربية: بوابة تعليم وتوعية المستثمرين',
    sidebarImage: '',
  } satisfies AboutHeroContent,
  principles: {
    introParagraphs: [''],
    introParagraphsAr: [''],
    objectives: [''],
    objectivesAr: [''],
    benefits: [''],
    benefitsAr: [''],
  } satisfies PrinciplesPageContent,
  framework: {
    introParagraphs: [''],
    introParagraphsAr: [''],
    practices: [''],
    practicesAr: [''],
    imageUrl: '',
    pdfUrl: '',
  } satisfies FrameworkPageContent,
  the_index: {
    content: '',
    contentAr: '',
  } satisfies TheIndexContent,
  benchmarking: {
    intro:
      'A review of available data and measurement exercises with which UASA Members can design and evaluate Corporate Governance application in their countries (Based on the UASA Guide)',
    introAr:
      'مراجعة البيانات المتاحة وعمليات القياس التي يمكن لأعضاء الاتحاد تصميم وتقييم تطبيق حوكمة الشركات في بلدانهم (استناداً إلى دليل الاتحاد)',
  } satisfies BenchmarkingPageContent,
  additional_resources: {
    intro:
      'Explore supplementary reports, guidelines, and reference materials related to the UASA Financial Inclusion Index and regional benchmarking efforts.',
    introAr:
      'استكشف التقارير التكميلية والمبادئ التوجيهية والمواد المرجعية المتعلقة بمؤشر الشمول المالي للاتحاد وجهود القياس الإقليمية.',
    resources: [{ title: '', url: '', description: '' }],
  } satisfies AdditionalResourcesContent,
  feedback: {
    title: 'Feedback & Inquiries',
    titleAr: 'تواصل معنا',
    subtitle: '',
    subtitleAr: 'رأيك يهمنا. ساعدنا في تحسين البوابة أو تواصل معنا باستفساراتك.',
    contactEmail: '',
    contactWebsite: '',
  } satisfies FeedbackContent,
  footer: {
    educationLinks: ['Reading Materials', "Members' Activities", 'Alerts & Bulletins'],
    educationLinksAr: ['مواد القراءة', 'أنشطة الأعضاء', 'التنبيهات والنشرات'],
    inclusionLinks: ["Members Strategies & Projects", 'Global Policy Areas', 'Financial Inclusion Index'],
    inclusionLinksAr: ['استراتيجيات وبرامج الأعضاء', 'السياسات الدولية', 'مؤشر الشمول المالي'],
    usefulLinks: [{ label: '', href: '' }],
    address: 'Al Rashidiya, Umm Ramoul, Dubai',
    addressAr: 'الراشدية، أم الرمول دبي',
    phone: '+971 4 290 0000',
    email: 'info@uasa.ae',
  } satisfies FooterContent,
  glossary_meta: {
    pdfUrl: '',
    backgroundImage: '',
  } satisfies GlossaryMetaContent,
};

export function mergeWithDefaults<T extends Record<string, unknown>>(key: PageKey, data: Record<string, unknown>): T {
  const defaults = DEFAULTS[key] as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...defaults };

  for (const [field, defaultValue] of Object.entries(defaults)) {
    const value = data[field];
    if (value === undefined || value === null) {
      merged[field] = defaultValue;
    } else if (Array.isArray(defaultValue)) {
      merged[field] = Array.isArray(value) ? value : defaultValue;
    } else {
      merged[field] = value;
    }
  }

  return merged as T;
}
