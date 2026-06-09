import { FormEvent, useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import GlobalPolicyAreasResultsTable from '../components/global-policy-areas/GlobalPolicyAreasResultsTable';
import { api } from '../lib/api';
import { groupGlobalPolicyAreas } from '../lib/globalPolicyGrouping';
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

  const groupedPolicyAreas = useMemo(
    () => groupGlobalPolicyAreas(policyAreas, selectedInstitutions),
    [policyAreas, selectedInstitutions],
  );

  const fetchPolicyAreas = async (
    institutions: PolicyInstitution[],
    categories: PolicyCategory[],
  ) => {
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

  useEffect(() => {
    fetchPolicyAreas([], []);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const institutionSelect = form.elements.namedItem('institution') as HTMLSelectElement;
    const categorySelect = form.elements.namedItem('category') as HTMLSelectElement;

    const institutions = getMultiSelectValues(institutionSelect) as PolicyInstitution[];
    const categories = getMultiSelectValues(categorySelect) as PolicyCategory[];

    setSelectedInstitutions(institutions);
    setSelectedCategories(categories);
    await fetchPolicyAreas(institutions, categories);
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
                <label htmlFor="institution" className="block text-sm font-bold text-[#009900] mb-2">
                  Institution
                </label>
                <select
                  id="institution"
                  name="institution"
                  multiple
                  size={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
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
                <label htmlFor="category" className="block text-sm font-bold text-[#009900] mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  multiple
                  size={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
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
                className="inline-flex items-center justify-center rounded-lg bg-[#009900] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#006600] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
          </form>

          {submitted && !error && (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Global Policy Areas</h2>
              <hr className="border-gray-300 mb-8" />
              {loading ? (
                <p className="text-sm text-gray-500">Loading global policy areas...</p>
              ) : (
                <GlobalPolicyAreasResultsTable groups={groupedPolicyAreas} />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
