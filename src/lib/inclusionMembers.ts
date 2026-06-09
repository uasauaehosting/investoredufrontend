export const INCLUSION_MEMBER_FILTERS = [
  'Jordan Securities Commission',
  'Capital Market Authority',
  "Commission d'Organisation et de Surveillance des opérations de Bourse (COSOB)",
  'Saudi Capital Market Authority',
  'Syrian Commission on Financial Markets and Securities',
  'Iraqi Securities Commission',
  'Financial Services Authority – Oman',
  'Palestine Capital Market Authority',
  'Qatar Financial Markets Authority',
  'Kuwait Capital Markets Authority',
  'Capital Markets Authority of Lebanon',
  'Financial Regulatory Authority – Egypt',
  'Autorité Marocaine du Marché des Capitaux (AMMC)',
  'Conseil du Marché Financier – Tunisia',
  'Libyan Capital Market Authority – Libya',
  'Dubai Financial Services Authority',
] as const;

export const INCLUSION_CATEGORY_FILTERS = ['Strategy', 'Report'] as const;

export type InclusionMemberFilter = (typeof INCLUSION_MEMBER_FILTERS)[number];
export type InclusionCategoryFilter = (typeof INCLUSION_CATEGORY_FILTERS)[number];

const MEMBER_MATCH_KEYWORDS: Record<InclusionMemberFilter, string[]> = {
  'Jordan Securities Commission': ['jordan', 'jsc'],
  'Capital Market Authority': ['capital market authority'],
  "Commission d'Organisation et de Surveillance des opérations de Bourse (COSOB)": ['cosob', 'algeria'],
  'Saudi Capital Market Authority': ['saudi', 'saudi arabia'],
  'Syrian Commission on Financial Markets and Securities': ['syria', 'syrian'],
  'Iraqi Securities Commission': ['iraq', 'iraqi'],
  'Financial Services Authority – Oman': ['oman'],
  'Palestine Capital Market Authority': ['palestine'],
  'Qatar Financial Markets Authority': ['qatar'],
  'Kuwait Capital Markets Authority': ['kuwait'],
  'Capital Markets Authority of Lebanon': ['lebanon'],
  'Financial Regulatory Authority – Egypt': ['egypt'],
  'Autorité Marocaine du Marché des Capitaux (AMMC)': ['morocco', 'ammc', 'marocaine'],
  'Conseil du Marché Financier – Tunisia': ['tunisia', 'conseil du marché'],
  'Libyan Capital Market Authority – Libya': ['libya', 'libyan'],
  'Dubai Financial Services Authority': ['dubai', 'dfsa'],
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[–—-]/g, ' ');
}

export function matchesInclusionMember(memberName: string | undefined, filter: InclusionMemberFilter): boolean {
  if (!memberName) return false;
  const normalizedMember = normalizeText(memberName);
  const keywords = MEMBER_MATCH_KEYWORDS[filter].map(normalizeText);
  const normalizedFilter = normalizeText(filter);

  if (filter === 'Capital Market Authority') {
    const exclusions = ['saudi', 'kuwait', 'lebanon', 'palestine', 'qatar', 'jordan', 'iraq', 'syria', 'libya'];
    if (exclusions.some((term) => normalizedMember.includes(term))) return false;
    return normalizedMember.includes('capital market authority') || normalizedMember.includes('uae');
  }

  if (normalizedMember.includes(normalizedFilter)) return true;
  return keywords.some((keyword) => normalizedMember.includes(keyword));
}

export function matchesInclusionCategory(
  fields: { type?: string; categoryName?: string | null; title?: string; description?: string },
  filter: InclusionCategoryFilter,
): boolean {
  const haystack = normalizeText(
    [fields.type, fields.categoryName, fields.title, fields.description].filter(Boolean).join(' '),
  );

  if (filter === 'Strategy') {
    return (
      haystack.includes('strategy') ||
      haystack.includes('strategic') ||
      haystack.includes('strategic plan') ||
      fields.type?.toLowerCase() === 'strategy'
    );
  }

  return (
    haystack.includes('report') ||
    haystack.includes('rapport') ||
    fields.type?.toLowerCase() === 'report'
  );
}
