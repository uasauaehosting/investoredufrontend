import type {
  HomeWelcomeContent,
  HomePortalContent,
  AboutHeroContent,
  PrinciplesPageContent,
  FrameworkPageContent,
  TheIndexContent,
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
    title: '',
  } satisfies AboutHeroContent,
  principles: {
    introParagraphs: [''],
    objectives: [''],
    benefits: [''],
  } satisfies PrinciplesPageContent,
  framework: {
    introParagraphs: [''],
    practices: [''],
    imageUrl: '',
    pdfUrl: '',
  } satisfies FrameworkPageContent,
  the_index: {
    content: '',
  } satisfies TheIndexContent,
  feedback: {
    title: 'Feedback & Inquiries',
    subtitle: '',
    contactEmail: '',
    contactWebsite: '',
  } satisfies FeedbackContent,
  footer: {
    educationLinks: [''],
    inclusionLinks: [''],
    usefulLinks: [{ label: '', href: '' }],
    address: '',
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
