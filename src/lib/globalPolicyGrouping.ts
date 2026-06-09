import {
  POLICY_CATEGORIES,
  POLICY_INSTITUTIONS,
  PolicyCategory,
  PolicyInstitution,
} from './globalPolicyFilters';

export interface GroupedPolicyArea {
  id: number;
  title: string;
  description: string | null;
  institution: string;
  category: string;
  file_url: string | null;
}

export interface PolicyCategoryGroup {
  category: PolicyCategory;
  items: GroupedPolicyArea[];
}

export interface PolicyInstitutionGroup {
  institution: PolicyInstitution;
  categories: PolicyCategoryGroup[];
  isEmpty: boolean;
}

export function groupGlobalPolicyAreas(
  items: GroupedPolicyArea[],
  selectedInstitutions: PolicyInstitution[] = [],
): PolicyInstitutionGroup[] {
  const institutionFilter =
    selectedInstitutions.length > 0 ? new Set<string>(selectedInstitutions) : null;

  const institutionsToShow = institutionFilter
    ? POLICY_INSTITUTIONS.filter((institution) => institutionFilter.has(institution))
    : [...POLICY_INSTITUTIONS];

  return institutionsToShow.map((institution) => {
    const institutionItems = items.filter((item) => item.institution === institution);
    const categories = POLICY_CATEGORIES.map((category) => ({
      category,
      items: institutionItems.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);

    return {
      institution,
      categories,
      isEmpty: categories.length === 0,
    };
  });
}
