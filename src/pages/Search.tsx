import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Newspaper,
  BookOpen,
  GraduationCap,
  Globe,
  BookMarked,
  FileText,
  LayoutList,
  ShoppingBag,
  Bell,
  ExternalLink,
  Download,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';
import { api } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultType =
  | 'news'
  | 'publication'
  | 'program'
  | 'portal'
  | 'glossary'
  | 'principle'
  | 'framework'
  | 'investment-product'
  | 'alert';

interface SearchHit {
  id: number;
  type: ResultType;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  href: string;
  authorityName: string | null;
  fileUrl: string | null;
  externalLink: string | null;
  slug: string | null;
  alertType: string | null;
}

interface SearchResponse {
  query: string;
  total: number;
  results: SearchHit[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_ORDER: ResultType[] = [
  'news',
  'principle',
  'framework',
  'investment-product',
  'publication',
  'program',
  'portal',
  'alert',
  'glossary',
];

const TYPE_ICON: Record<ResultType, React.ReactNode> = {
  news:               <Newspaper     size={16} />,
  publication:        <FileText      size={16} />,
  program:            <GraduationCap size={16} />,
  portal:             <Globe         size={16} />,
  glossary:           <BookMarked    size={16} />,
  principle:          <BookOpen      size={16} />,
  framework:          <LayoutList    size={16} />,
  'investment-product': <ShoppingBag size={16} />,
  alert:              <Bell          size={16} />,
};

const TYPE_COLOUR: Record<ResultType, string> = {
  news:               'bg-blue-100   text-blue-700',
  publication:        'bg-purple-100 text-purple-700',
  program:            'bg-orange-100 text-orange-700',
  portal:             'bg-teal-100   text-teal-700',
  glossary:           'bg-yellow-100 text-yellow-700',
  principle:          'bg-green-100  text-green-700',
  framework:          'bg-emerald-100 text-emerald-700',
  'investment-product': 'bg-pink-100 text-pink-700',
  alert:              'bg-red-100    text-red-700',
};

function typeLabel(type: ResultType, lang: 'en' | 'ar'): string {
  const key = `search.type.${type}`;
  const defaults: Record<ResultType, string> = {
    news:               'News',
    publication:        'Publication',
    program:            'Program',
    portal:             'Portal',
    glossary:           'Glossary',
    principle:          'Principle',
    framework:          'Framework',
    'investment-product': 'Investment Product',
    alert:              'Alert / Bulletin',
  };
  return t(lang, key, defaults[type]);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypePill({ type, lang }: { type: ResultType; lang: 'en' | 'ar' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLOUR[type]}`}
    >
      {TYPE_ICON[type]}
      {typeLabel(type, lang)}
    </span>
  );
}

function ResultCard({ hit, lang, isRtl }: { hit: SearchHit; lang: 'en' | 'ar'; isRtl: boolean }) {
  const title       = (isRtl && hit.titleAr)       ? hit.titleAr       : hit.title;
  const description = (isRtl && hit.descriptionAr) ? hit.descriptionAr : hit.description;

  // Truncate description to ~180 chars for card display
  const shortDesc = description && description.length > 180
    ? description.slice(0, 180).trimEnd() + '…'
    : description;

  return (
    <article className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <TypePill type={hit.type} lang={lang} />
        {hit.authorityName && (
          <span className="text-xs text-gray-400 truncate max-w-[180px]">{hit.authorityName}</span>
        )}
      </div>

      {/* Title */}
      <h3 className={`text-base font-semibold text-gray-800 leading-snug line-clamp-2 ${isRtl ? 'text-right' : 'text-left'}`}>
        {title}
      </h3>

      {/* Description */}
      {shortDesc && (
        <p className={`text-sm text-gray-500 leading-relaxed line-clamp-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          {shortDesc}
        </p>
      )}

      {/* Action row */}
      <div className={`flex items-center gap-3 mt-auto flex-wrap ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Internal page link */}
        <Link
          to={hit.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#009900] hover:text-[#006600] transition-colors"
        >
          {t(lang, 'search.visitPage', 'Visit Page')}
          {isRtl
            ? <ArrowRight size={14} className="rotate-180" />
            : <ChevronRight size={14} />}
        </Link>

        {/* External link (portals / alerts with an external URL) */}
        {hit.externalLink && hit.externalLink !== hit.href && (
          <a
            href={hit.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#009900] transition-colors"
          >
            {t(lang, 'search.externalLink', 'External Link')}
            <ExternalLink size={13} />
          </a>
        )}

        {/* File download (publications / principles etc.) */}
        {hit.fileUrl && (
          <a
            href={hit.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#009900] transition-colors"
          >
            {t(lang, 'search.downloadFile', 'Download')}
            <Download size={13} />
          </a>
        )}
      </div>
    </article>
  );
}

function GroupSection({
  type,
  hits,
  lang,
  isRtl,
}: {
  type: ResultType;
  hits: SearchHit[];
  lang: 'en' | 'ar';
  isRtl: boolean;
}) {
  return (
    <section className="mb-10">
      <h2 className={`flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <span className={`w-5 h-5 flex items-center justify-center rounded-full ${TYPE_COLOUR[type]}`}>
          {TYPE_ICON[type]}
        </span>
        {typeLabel(type, lang)}
        <span className="text-gray-400 font-normal">({hits.length})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {hits.map((hit) => (
          <ResultCard key={`${hit.type}-${hit.id}`} hit={hit} lang={lang} isRtl={isRtl} />
        ))}
      </div>
    </section>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse space-y-3">
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const { lang, isRtl } = useLanguage();
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();

  const initialQ = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(initialQ);
  const [query,      setQuery]      = useState(initialQ);
  const [data,       setData]       = useState<SearchResponse | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Run a search whenever the URL ?q= changes
  const runSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    api
      .get(`/search?q=${encodeURIComponent(trimmed)}`)
      .then((res: SearchResponse) => { setData(res); setLoading(false); })
      .catch(() => {
        setError(t(lang, 'search.error', 'Search failed. Please try again.'));
        setLoading(false);
      });
  }, [lang]);

  // Trigger on initial render and whenever URL param changes
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setInputValue(q);
    setQuery(q);
    if (q) runSearch(q);
  }, [searchParams, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // Group and order results by type
  const grouped = data
    ? TYPE_ORDER.reduce<Record<string, SearchHit[]>>((acc, type) => {
        const hits = data.results.filter((r) => r.type === type);
        if (hits.length) acc[type] = hits;
        return acc;
      }, {})
    : {};

  const totalCount = data?.total ?? 0;

  const totalLabel = totalCount === 1
    ? `1 ${t(lang, 'search.total', 'result')}`
    : `${totalCount} ${t(lang, 'search.totalPlural', 'results')}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title={t(lang, 'search.title', 'Search Results')}
        items={[
          { label: t(lang, 'bc.home', 'Home'), href: '/' },
          { label: t(lang, 'search.title', 'Search Results') },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className={`flex gap-2 mb-8 max-w-2xl ${isRtl ? 'flex-row-reverse ms-auto' : ''}`}
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t(lang, 'search.placeholder', 'Search the portal…')}
              className="w-full border border-gray-300 rounded-full px-5 py-2.5 text-sm pe-11 focus:outline-none focus:ring-2 focus:ring-[#009900]/30 focus:border-[#009900]"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <SearchIcon
              size={16}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${isRtl ? 'start-3.5' : 'end-3.5'}`}
            />
          </div>
          <button
            type="submit"
            className="bg-[#009900] hover:bg-[#006600] text-white rounded-full px-6 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
          >
            {t(lang, 'search.button', 'Search')}
          </button>
        </form>

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {loading && (
          <div>
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <SkeletonGrid />
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        )}

        {/* ── No results ─────────────────────────────────────────────────── */}
        {!loading && !error && data && totalCount === 0 && (
          <div className={`text-center py-16 ${isRtl ? 'rtl' : ''}`}>
            <SearchIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-600 font-medium mb-1">
              {t(lang, 'search.noResults', 'No results found for')}
              {' '}
              <span className="text-[#009900] font-bold">"{query}"</span>
            </p>
            <p className="text-gray-400 text-sm">
              {t(lang, 'search.noResultsHint', 'Try different keywords or check your spelling.')}
            </p>
          </div>
        )}

        {/* ── Results ────────────────────────────────────────────────────── */}
        {!loading && !error && data && totalCount > 0 && (
          <>
            {/* Summary bar */}
            <div className={`flex items-center gap-2 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <p className={`text-sm text-gray-500 ${isRtl ? 'text-right' : ''}`}>
                {t(lang, 'search.resultsFor', 'Results for')}
                {' '}
                <span className="font-semibold text-gray-800">"{query}"</span>
                {' — '}
                <span className="text-[#009900] font-semibold">{totalLabel}</span>
              </p>
            </div>

            {/* Grouped sections in prescribed order */}
            {(Object.keys(grouped) as ResultType[]).map((type) => (
              <GroupSection
                key={type}
                type={type}
                hits={grouped[type]}
                lang={lang}
                isRtl={isRtl}
              />
            ))}
          </>
        )}

        {/* ── Empty state before first search ───────────────────────────── */}
        {!loading && !error && !data && !query && (
          <div className={`text-center py-16 ${isRtl ? 'rtl' : ''}`}>
            <SearchIcon size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 text-sm">
              {t(lang, 'search.placeholder', 'Search the portal…')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
