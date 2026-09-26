import { FormEvent, useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import PublicationsResultsTable from '../components/publications/PublicationsResultsTable';
import { api } from '../lib/api';
import {
  PUBLICATION_AUTHORITIES,
  PUBLICATION_CATEGORIES,
  PublicationAuthority,
  PublicationCategory,
} from '../lib/publicationFilters';
import { groupPublicationsByAuthority } from '../lib/publicationGrouping';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';

interface Publication {
  id: number;
  title: string;
  title_ar?: string | null;
  description: string | null;
  description_ar?: string | null;
  authority_name: string;
  category: PublicationCategory;
  file_url: string | null;
  date_published: string | null;
}

function buildQueryParams(authorities: PublicationAuthority[], categories: PublicationCategory[]): string {
  const params = new URLSearchParams();
  if (authorities.length > 0) params.set('authorities', authorities.join(','));
  if (categories.length > 0) params.set('categories', categories.join(','));
  const query = params.toString();
  return query ? `?${query}` : '';
}

function getMultiSelectValues(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions)
    .map((option) => option.value)
    .filter((value) => value !== 'All');
}

export default function Publications() {
  const { lang, isRtl } = useLanguage();
  const [selectedAuthorities, setSelectedAuthorities] = useState<PublicationAuthority[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PublicationCategory[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupedPublications = useMemo(
    () => groupPublicationsByAuthority(publications, selectedAuthorities),
    [publications, selectedAuthorities],
  );

  const fetchPublications = async (
    authorities: PublicationAuthority[],
    categories: PublicationCategory[],
  ) => {
    setLoading(true);
    setError(null);
    setSubmitted(true);
    try {
      const data = await api.get(`/publications${buildQueryParams(authorities, categories)}`);
      setPublications(data ?? []);
    } catch {
      setError(t(lang, 'publications.error', 'Failed to load publications. Please try again.'));
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPublications([], []); }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const authoritySelect = form.elements.namedItem('authority') as HTMLSelectElement;
    const categorySelect  = form.elements.namedItem('category')  as HTMLSelectElement;
    const authorities = getMultiSelectValues(authoritySelect) as PublicationAuthority[];
    const categories  = getMultiSelectValues(categorySelect)  as PublicationCategory[];
    setSelectedAuthorities(authorities);
    setSelectedCategories(categories);
    await fetchPublications(authorities, categories);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title={t(lang, 'publications.title', 'Publications')}
        items={[
          { label: t(lang, 'bc.home', 'Home'), href: '/' },
          { label: t(lang, 'nav.investorEducation', 'Investor Education') },
          { label: t(lang, 'nav.membersActivities', "Members' Activities"), href: '/education/members-activities' },
          { label: t(lang, 'publications.title', 'Publications') },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-10">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Authority filter */}
              <div dir={isRtl ? 'rtl' : 'ltr'}>
                <label htmlFor="authority" className="block text-sm font-bold text-[#009900] mb-2">
                  {t(lang, 'publications.authorityLabel', 'Authority')}
                </label>
                <select
                  id="authority"
                  name="authority"
                  multiple
                  size={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                  style={{ height: '90px' }}
                >
                  <option value="All">
                    {t(lang, 'publications.authorityAll', 'All')}
                  </option>
                  {PUBLICATION_AUTHORITIES.map((authority) => (
                    <option key={authority} value={authority}>{authority}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-green-700">
                  {t(lang, 'publications.ctrlHint', 'Note: Press Ctrl key to choose multiple options')}
                </p>
              </div>

              {/* Category filter */}
              <div dir={isRtl ? 'rtl' : 'ltr'}>
                <label htmlFor="category" className="block text-sm font-bold text-[#009900] mb-2">
                  {t(lang, 'publications.categoryLabel', 'Category')}
                </label>
                <select
                  id="category"
                  name="category"
                  multiple
                  size={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                  style={{ height: '100px' }}
                >
                  <option value="All">
                    {t(lang, 'publications.categoryAll', 'All')}
                  </option>
                  {PUBLICATION_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-green-700">
                  {t(lang, 'publications.ctrlHintCat', 'Note: Press Ctrl key to choose multiple options')}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-[#009900] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#006600] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? t(lang, 'publications.loading', 'Loading...')
                  : t(lang, 'publications.submit', 'Submit')}
              </button>
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
          </form>

          {submitted && !error && (
            <div className="mt-10 border-t border-gray-200 pt-8" dir={isRtl ? 'rtl' : 'ltr'}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t(lang, 'publications.resultsTitle', 'Publications')}
              </h2>
              <hr className="border-gray-300 mb-8" />
              {loading ? (
                <p className="text-sm text-gray-500">
                  {t(lang, 'publications.loading', 'Loading publications...')}
                </p>
              ) : (
                <PublicationsResultsTable groups={groupedPublications} />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
