export const POLICY_INSTITUTIONS = [
  'OECD',
  'Alliance For Financial Inclusion',
  'Others',
] as const;

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

export type PolicyInstitution = (typeof POLICY_INSTITUTIONS)[number];
export type PolicyCategory = (typeof POLICY_CATEGORIES)[number];
