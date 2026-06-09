export const EDUCATION_SECTIONS = {
  'reading-materials': {
    slug: 'reading-materials',
    title: 'Reading Materials',
    titleAr: 'المواد القرائية',
    description: 'Comprehensive guides, literature, and investment frameworks.',
    descriptionAr: 'أدلة شاملة وأدبيات وأطر استثمارية.',
    listPath: '/education/reading-materials',
  },
  'members-activities': {
    slug: 'members-activities',
    title: "Members' Activities",
    titleAr: 'أنشطة الأعضاء',
    description: 'Publications, educational programs, and portals from across the region.',
    descriptionAr: 'منشورات وبرامج تعليمية وبوابات من مختلف أنحاء المنطقة.',
    listPath: '/education/members-activities',
  },
  alerts: {
    slug: 'alerts',
    title: 'Alerts & Bulletins',
    titleAr: 'التنبيهات والنشرات',
    description: 'Stay informed with the latest market alerts and regulatory updates.',
    descriptionAr: 'ابق على اطلاع بأحدث تنبيهات السوق والتحديثات التنظيمية.',
    listPath: '/education/alerts',
  },
} as const;

export type EducationSectionSlug = keyof typeof EDUCATION_SECTIONS;

export interface EducationItem {
  id: number;
  section: EducationSectionSlug;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string | null;
  content: string | null;
  contentAr?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export function getSectionMeta(slug: string) {
  return EDUCATION_SECTIONS[slug as EducationSectionSlug] ?? null;
}

export function isValidSection(slug: string): slug is EducationSectionSlug {
  return slug in EDUCATION_SECTIONS;
}
