export const POLICY_INSTITUTIONS = [
  'OECD',
  'Alliance For Financial Inclusion',
  'Others',
] as const;

/** Arabic display names for POLICY_INSTITUTIONS (keyed by English value). */
export const POLICY_INSTITUTIONS_AR: Record<string, string> = {
  'OECD':                           'منظمة التعاون الاقتصادي والتنمية (OECD)',
  'Alliance For Financial Inclusion': 'تحالف الشمول المالي',
  'Others':                         'أخرى',
};

export const POLICY_CATEGORIES = [
  'Consumer Empowerment and Market Conduct',
  'Digital Financial Services',
  'Emerging Financial Inclusion Areas',
  'Financial Inclusion Strategy',
  'Integrity and Stability',
  'Measuring Financial Inclusion',
  'Others',
  'Report',
  'SME Finance',
] as const;

/** Arabic display names for POLICY_CATEGORIES (keyed by English value). */
export const POLICY_CATEGORIES_AR: Record<string, string> = {
  'Consumer Empowerment and Market Conduct': 'تمكين المستهلك وسلوك السوق',
  'Digital Financial Services':              'الخدمات المالية الرقمية',
  'Emerging Financial Inclusion Areas':      'مجالات الشمول المالي الناشئة',
  'Financial Inclusion Strategy':            'استراتيجية الشمول المالي',
  'Integrity and Stability':                 'النزاهة والاستقرار',
  'Measuring Financial Inclusion':           'قياس الشمول المالي',
  'Others':                                  'أخرى',
  'Report':                                  'تقرير',
  'SME Finance':                             'تمويل المشاريع الصغيرة والمتوسطة',
};

export type PolicyInstitution = (typeof POLICY_INSTITUTIONS)[number];
export type PolicyCategory = (typeof POLICY_CATEGORIES)[number];
