import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import MemberStrategiesProjectsResultsTable from '../components/member-strategies-projects/MemberStrategiesProjectsResultsTable';
import { api } from '../lib/api';
import {
  INCLUSION_CATEGORY_FILTERS,
  INCLUSION_MEMBER_FILTERS,
  INCLUSION_MEMBER_FILTER_AR,
  INCLUSION_CATEGORY_FILTER_AR,
  InclusionCategoryFilter,
  InclusionMemberFilter,
  matchesInclusionCategory,
  matchesInclusionMember,
} from '../lib/inclusionMembers';
import { groupStrategiesProjectsByMember } from '../lib/strategiesProjectsGrouping';
import { useLanguage } from '../lib/LanguageContext';
import { SectionLangProvider, useSectionLang } from '../lib/SectionLangContext';
import { t } from '../lib/translations';

interface StrategyProject {
  id: number;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  memberId?: number;
  memberName?: string;
  type?: string;
  categoryName?: string | null;
  date?: string;
  start_date?: string;
  fileUrl?: string;
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#009900] focus:ring-[#009900]/30"
      />
      <span className="text-sm text-gray-600 group-hover:text-[#009900] leading-snug">{label}</span>
    </label>
  );
}

function MembersStrategiesProjectsInner() {
  const { lang, isRtl } = useSectionLang();
  const [projects, setProjects] = useState<StrategyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<InclusionMemberFilter[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<InclusionCategoryFilter[]>([]);

  useEffect(() => {
    api
      .get('/investor-education/member-strategies-projects')
      .then((data) => setProjects(data ?? []))
      .catch(() => setError('Failed to load strategies and projects.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleMember = (member: InclusionMemberFilter) => {
    setSelectedMembers((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member],
    );
  };

  const toggleCategory = (category: InclusionCategoryFilter) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedMembers([]);
    setSelectedCategories([]);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const memberMatch =
        selectedMembers.length === 0 ||
        selectedMembers.some((member) => matchesInclusionMember(project.memberName, member));

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => matchesInclusionCategory(project, category));

      return memberMatch && categoryMatch;
    });
  }, [projects, selectedMembers, selectedCategories]);

  const [memberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const memberDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target as Node)) {
        setMemberDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupedProjects = useMemo(
    () => groupStrategiesProjectsByMember(filteredProjects),
    [filteredProjects],
  );

  const hasActiveFilters = selectedMembers.length > 0 || selectedCategories.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
            <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full tracking-widest uppercase">
              {t(lang, 'strategies.badge', 'Financial Inclusion')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t(lang, 'strategies.title', 'Members Strategies & Projects')}
          </h1>
          <p className="text-green-100 max-w-4xl mt-6 text-base sm:text-lg leading-relaxed" dir={isRtl ? 'rtl' : 'ltr'}>
            {t(
              lang,
              'strategies.description',
              'Browse strategies, reports, and financial inclusion initiatives published by UASA member authorities. Select one or more members and categories below to discover resources, best practices, and projects supporting financial inclusion, investor protection, and capital market development across the region.',
            )}
          </p>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* ── Filter bar: two columns side-by-side ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#009900]" />
              <h2 className="font-bold text-[#009900]">
                {t(lang, 'strategies.filtersTitle', 'Filters')}
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                <X size={14} />
                {t(lang, 'strategies.clearFilters', 'Clear')}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* Row 1 — Member filter dropdown */}
            <div ref={memberDropdownRef} className="relative">
              <h3 className="text-sm font-bold text-[#009900] uppercase tracking-wide mb-3">
                {t(lang, 'strategies.memberFilter', 'Active Member Filter')}
              </h3>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setMemberDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-[#009900]/40 px-4 py-2.5 text-sm text-gray-700 transition-colors"
              >
                <span className="truncate">
                  {selectedMembers.length === 0
                    ? t(lang, 'strategies.selectMember', 'Select member(s)…')
                    : selectedMembers.length === 1
                      ? (lang === 'ar' ? (INCLUSION_MEMBER_FILTER_AR[selectedMembers[0]] ?? selectedMembers[0]) : selectedMembers[0])
                      : `${selectedMembers.length} ${t(lang, 'strategies.membersSelected', 'members selected')}`}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-[#009900] transition-transform duration-200 ${memberDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown panel */}
              {memberDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg py-2 max-h-72 overflow-y-auto">
                  {INCLUSION_MEMBER_FILTERS.map((member) => {
                    const label = lang === 'ar' ? (INCLUSION_MEMBER_FILTER_AR[member] ?? member) : member;
                    const checked = selectedMembers.includes(member);
                    return (
                      <label
                        key={member}
                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-sm transition-colors ${checked ? 'bg-green-50 text-[#009900]' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMember(member)}
                          className="w-4 h-4 rounded border-gray-300 text-[#009900] focus:ring-[#009900]/30"
                        />
                        <span className="leading-snug">{label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Row 2 — Category filter */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-[#009900] uppercase tracking-wide mb-4">
                {t(lang, 'strategies.categoryFilter', 'Category Filter')}
              </h3>
              <div className="flex flex-wrap gap-x-10 gap-y-3">
                {INCLUSION_CATEGORY_FILTERS.map((category) => (
                  <FilterCheckbox
                    key={category}
                    label={lang === 'ar' ? (INCLUSION_CATEGORY_FILTER_AR[category] ?? category) : category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        <section>
            {hasActiveFilters && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">
                  {loading
                    ? t(lang, 'strategies.loading', 'Loading resources...')
                    : `${filteredProjects.length} ${filteredProjects.length === 1 ? t(lang, 'strategies.found', 'resource found') : t(lang, 'strategies.foundPlural', 'resources found')}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-[#009900] text-xs font-medium"
                    >
                      {lang === 'ar'
                        ? (INCLUSION_MEMBER_FILTER_AR[member] ?? member).split(' ').slice(0, 3).join(' ')
                        : member.split(' ').slice(0, 2).join(' ')}
                      <button onClick={() => toggleMember(member)} aria-label={`Remove ${member}`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium"
                    >
                      {lang === 'ar' ? (INCLUSION_CATEGORY_FILTER_AR[category] ?? category) : category}
                      <button onClick={() => toggleCategory(category)} aria-label={`Remove ${category}`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!hasActiveFilters && !loading && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <p className="text-gray-500">
                  {t(lang, 'strategies.selectFilters', 'Select one or more member or category filters to view strategies and projects.')}
                </p>
              </div>
            )}

            {hasActiveFilters && loading && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center animate-pulse">
                <p className="text-gray-400">{t(lang, 'strategies.loading', 'Loading resources...')}</p>
              </div>
            )}

            {hasActiveFilters && error && (
              <p className="text-center text-red-500 py-12">{error}</p>
            )}

            {hasActiveFilters && !loading && !error && (
              <MemberStrategiesProjectsResultsTable groups={groupedProjects} />
            )}
        </section>
      </div>
    </div>
  );
}

export default function MembersStrategiesProjects() {
  const { lang: globalLang } = useLanguage();
  return (
    <SectionLangProvider initialLang={globalLang}>
      <MembersStrategiesProjectsInner />
    </SectionLangProvider>
  );
}
