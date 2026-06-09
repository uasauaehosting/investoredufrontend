import { FormEvent, useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import {
  POLICY_CATEGORIES,
  POLICY_INSTITUTIONS,
  PolicyCategory,
  PolicyInstitution,
} from '../lib/globalPolicyFilters';

interface GlobalPolicyArea {
  id: number;
  title: string;
  description: string | null;
  institution: string;
  category: string;
  file_url: string | null;
  date_published: string | null;
}

function buildQueryParams(institutions: PolicyInstitution[], categories: PolicyCategory[]): string {
  const params = new URLSearchParams();
  if (institutions.length > 0) {
    params.set('institutions', institutions.join(','));
  }
  if (categories.length > 0) {
    params.set('categories', categories.join(','));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

function getMultiSelectValues(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions)
    .map((option) => option.value)
    .filter((value) => value !== 'All');
}

export default function GlobalPolicyAreas() {
  const [selectedInstitutions, setSelectedInstitutions] = useState<PolicyInstitution[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PolicyCategory[]>([]);
  const [policyAreas, setPolicyAreas] = useState<GlobalPolicyArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const institutionSelect = form.elements.namedItem('institution') as HTMLSelectElement;
    const categorySelect = form.elements.namedItem('category') as HTMLSelectElement;

    const institutions = getMultiSelectValues(institutionSelect) as PolicyInstitution[];
    const categories = getMultiSelectValues(categorySelect) as PolicyCategory[];

    setSelectedInstitutions(institutions);
    setSelectedCategories(categories);
    setLoading(true);
    setError(null);
    setSubmitted(true);

    try {
      const data = await api.get(`/global-policy-areas${buildQueryParams(institutions, categories)}`);
      setPolicyAreas(data ?? []);
    } catch {
      setError('Failed to load global policy areas. Please try again.');
      setPolicyAreas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title="Global Policy Areas"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Financial Inclusion' },
          { label: 'Global Policy Areas' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-10">

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="institution" className="block text-sm font-bold text-[#00285e] mb-2">
                  Institution
                </label>
                <select
                  id="institution"
                  name="institution"
                  multiple
                  size={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#00285e] focus:outline-none focus:ring-2 focus:ring-[#00285e]/20"
                  style={{ height: '90px' }}
                >
                  <option value="All">All</option>
                  {POLICY_INSTITUTIONS.map((institution) => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-green-700">
                  Note: Press Ctrl key to choose multiple option
                </p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-bold text-[#00285e] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  multiple
                  size={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#00285e] focus:outline-none focus:ring-2 focus:ring-[#00285e]/20"
                  style={{ height: '100px' }}
                >
                  <option value="All">All</option>
                  {POLICY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-green-700">
                  Note: Press Ctrl key to choose multiple option
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-[#00285e] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#003580] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
          </form>

          {submitted && !loading && !error && (
            <div className="mt-10 border-t border-gray-100 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-bold text-[#00285e]">Results</h3>
                <p className="text-sm text-gray-500">
                  {policyAreas.length} resource{policyAreas.length === 1 ? '' : 's'} found
                  {(selectedInstitutions.length > 0 || selectedCategories.length > 0) && (
                    <> for selected filters</>
                  )}
                </p>
              </div>

              {policyAreas.length === 0 ? (
                <p className="text-gray-500 text-sm">No global policy areas match the selected filters.</p>
              ) : (
                <div className="space-y-4">
                  {policyAreas.map((policyArea) => (
                    <article
                      key={policyArea.id}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-5 hover:border-[#00285e]/20 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3">
                            <FileText size={18} className="text-[#00285e] mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-[#00285e] leading-snug">{policyArea.title}</h4>
                              {policyArea.description && (
                                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                  {policyArea.description}
                                </p>
                              )}
                              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700">
                                  {policyArea.institution}
                                </span>
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800">
                                  {policyArea.category}
                                </span>
                                {policyArea.date_published && (
                                  <span className="rounded-full bg-gray-200 px-2.5 py-1 font-medium text-gray-700">
                                    {policyArea.date_published}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {policyArea.file_url && (
                          <a
                            href={policyArea.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 self-start rounded-lg border border-[#00285e]/20 px-4 py-2 text-sm font-semibold text-[#00285e] hover:bg-[#00285e] hover:text-white transition-colors"
                          >
                            View
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
