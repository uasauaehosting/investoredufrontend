export const EDUCATION_SECTIONS = {
  'reading-materials': {
    slug: 'reading-materials',
    title: 'Reading Materials',
    description: 'Comprehensive guides, literature, and investment frameworks.',
    listPath: '/education/reading-materials',
  },
  'members-activities': {
    slug: 'members-activities',
    title: "Members' Activities",
    description: 'Publications, educational programs, and portals from across the region.',
    listPath: '/education/members-activities',
  },
  alerts: {
    slug: 'alerts',
    title: 'Alerts & Bulletins',
    description: 'Stay informed with the latest market alerts and regulatory updates.',
    listPath: '/education/alerts',
  },
} as const;

export type EducationSectionSlug = keyof typeof EDUCATION_SECTIONS;

export interface EducationItem {
  id: number;
  section: EducationSectionSlug;
  title: string;
  description: string;
  imageUrl: string | null;
  content: string | null;
  displayOrder: number;
  isActive: boolean;
}

export function getSectionMeta(slug: string) {
  return EDUCATION_SECTIONS[slug as EducationSectionSlug] ?? null;
}

export function isValidSection(slug: string): slug is EducationSectionSlug {
  return slug in EDUCATION_SECTIONS;
}
