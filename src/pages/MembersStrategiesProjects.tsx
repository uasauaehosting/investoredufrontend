import { useEffect, useMemo, useState } from 'react';
import { FileText, Filter, X } from 'lucide-react';
import { api } from '../lib/api';
import {
  INCLUSION_CATEGORY_FILTERS,
  INCLUSION_MEMBER_FILTERS,
  InclusionCategoryFilter,
  InclusionMemberFilter,
  matchesInclusionCategory,
  matchesInclusionMember,
} from '../lib/inclusionMembers';

interface StrategyProject {
  id: number;
  title: string;
  description: string;
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

export default function MembersStrategiesProjects() {
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

  const hasActiveFilters = selectedMembers.length > 0 || selectedCategories.length > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            Financial Inclusion
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Members Strategies &amp; Projects
          </h1>
          <p className="text-green-100 max-w-4xl mt-6 text-base sm:text-lg leading-relaxed">
            Browse strategies, reports, and financial inclusion initiatives published by UASA member
            authorities. Select one or more members and categories below to discover resources, best
            practices, and projects supporting financial inclusion, investor protection, and capital
            market development across the region.
          </p>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
          <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-[#009900]" />
                <h2 className="font-bold text-[#009900]">Filters</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-[#009900] uppercase tracking-wide mb-4">
                  Active Member Filter
                </h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pe-1">
                  {INCLUSION_MEMBER_FILTERS.map((member) => (
                    <FilterCheckbox
                      key={member}
                      label={member}
                      checked={selectedMembers.includes(member)}
                      onChange={() => toggleMember(member)}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-[#009900] uppercase tracking-wide mb-4">
                  Category Filter
                </h3>
                <div className="space-y-3">
                  {INCLUSION_CATEGORY_FILTERS.map((category) => (
                    <FilterCheckbox
                      key={category}
                      label={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading
                  ? 'Loading resources...'
                  : `${filteredProjects.length} resource${filteredProjects.length === 1 ? '' : 's'} found`}
              </p>
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-[#009900] text-xs font-medium"
                    >
                      {member.split(' ').slice(0, 2).join(' ')}
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
                      {category}
                      <button onClick={() => toggleCategory(category)} aria-label={`Remove ${category}`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading && (
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-center text-red-500 py-12">{error}</p>}

            {!loading && !error && filteredProjects.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <FileText size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  {hasActiveFilters
                    ? 'No resources match your selected filters. Try adjusting your selection.'
                    : 'No strategies or projects are available yet.'}
                </p>
              </div>
            )}

            {!loading && !error && filteredProjects.length > 0 && (
              <div className="grid gap-6">
                {filteredProjects.map((project) => {
                  const displayDate = project.date || project.start_date;
                  return (
                    <article
                      key={project.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {project.memberName && (
                          <span className="px-3 py-1 rounded-full bg-green-50 text-[#009900] text-xs font-semibold">
                            {project.memberName}
                          </span>
                        )}
                        {(project.categoryName || project.type) && (
                          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                            {project.categoryName || project.type}
                          </span>
                        )}
                        {displayDate && (
                          <span className="text-xs text-gray-400 ms-auto">
                            {new Date(displayDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#009900] mb-3">{project.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                      {project.fileUrl && (
                        <a
                          href={project.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#009900] hover:text-amber-600 transition-colors"
                        >
                          <FileText size={16} />
                          View Document
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
