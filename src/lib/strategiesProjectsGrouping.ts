import { INCLUSION_MEMBER_FILTERS, matchesInclusionMember } from './inclusionMembers';

export interface StrategyProjectItem {
  id: number;
  title: string;
  description: string;
  memberName?: string;
  type?: string;
  categoryName?: string | null;
  fileUrl?: string;
}

export interface MemberStrategyProjectGroup {
  member: string;
  items: StrategyProjectItem[];
}

function memberSortIndex(memberName: string): number {
  const index = INCLUSION_MEMBER_FILTERS.findIndex((filter) =>
    matchesInclusionMember(memberName, filter),
  );
  return index === -1 ? INCLUSION_MEMBER_FILTERS.length : index;
}

export function groupStrategiesProjectsByMember(
  projects: StrategyProjectItem[],
): MemberStrategyProjectGroup[] {
  const groups = new Map<string, StrategyProjectItem[]>();

  for (const project of projects) {
    const member = project.memberName?.trim() || 'Unknown Authority';
    const existing = groups.get(member) ?? [];
    existing.push(project);
    groups.set(member, existing);
  }

  return Array.from(groups.entries())
    .map(([member, items]) => ({ member, items }))
    .sort((a, b) => memberSortIndex(a.member) - memberSortIndex(b.member));
}
