import {
  PUBLICATION_AUTHORITIES,
  PUBLICATION_CATEGORIES,
  PublicationAuthority,
  PublicationCategory,
} from './publicationFilters';

export interface GroupedPublication {
  id: number;
  title: string;
  description: string | null;
  authority_name: string;
  category: PublicationCategory;
  file_url: string | null;
}

export interface PublicationAuthorityGroup {
  authority: PublicationAuthority;
  categories: PublicationCategoryGroup[];
}

export interface PublicationCategoryGroup {
  category: PublicationCategory;
  items: GroupedPublication[];
}

export function groupPublicationsByAuthority(
  publications: GroupedPublication[],
  selectedAuthorities: PublicationAuthority[] = [],
): PublicationAuthorityGroup[] {
  const authorityFilter =
    selectedAuthorities.length > 0 ? new Set<string>(selectedAuthorities) : null;

  const authoritiesToShow = authorityFilter
    ? PUBLICATION_AUTHORITIES.filter((authority) => authorityFilter.has(authority))
    : [...PUBLICATION_AUTHORITIES];

  return authoritiesToShow
    .map((authority) => {
      const authorityItems = publications.filter((item) => item.authority_name === authority);
      const categories = PUBLICATION_CATEGORIES.map((category) => ({
        category,
        items: authorityItems.filter((item) => item.category === category),
      })).filter((group) => group.items.length > 0);

      return { authority, categories };
    })
    .filter((group) => group.categories.length > 0);
}
