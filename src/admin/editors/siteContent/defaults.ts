import type {
  HomeWelcomeContent,
  HomePortalContent,
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
  { key: 'home.welcome', label: 'Home — Welcome Section' },
  { key: 'home.portal_section', label: 'Home — Portal Cards' },
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
    title: 'Welcome to the UASA Investor Education Portal',
    paragraphs: [''],
    ctaText: 'Explore the Portal',
    ctaHref: '#',
    highlights: [{ icon: 'TrendingUp', title: '', description: '' }],
  } satisfies HomeWelcomeContent,
  'home.portal_section': {
    heroImage: '',
    cards: [{ title: '', href: '', image_url: '' }],
  } satisfies HomePortalContent,
  'about.hero': {
    badge: 'About UASA',
    badgeAr: '',
    title: '',
    titleAr: '',
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
    introAr: '',
  } satisfies BenchmarkingPageContent,
  additional_resources: {
    intro:
      'Explore supplementary reports, guidelines, and reference materials related to the UASA Financial Inclusion Index and regional benchmarking efforts.',
    introAr: '',
    resources: [{ title: '', url: '', description: '' }],
  } satisfies AdditionalResourcesContent,
  feedback: {
    title: 'Feedback & Inquiries',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    contactEmail: '',
    contactWebsite: '',
  } satisfies FeedbackContent,
  footer: {
    educationLinks: [''],
    educationLinksAr: [''],
    inclusionLinks: [''],
    inclusionLinksAr: [''],
    usefulLinks: [{ label: '', href: '' }],
    address: '',
    addressAr: '',
    phone: '',
    email: '',
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
