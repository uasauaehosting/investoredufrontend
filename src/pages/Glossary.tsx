import { useMemo, useState, useEffect } from 'react';
import { Code2, Download, Search, X } from 'lucide-react';
import { api } from '../lib/api';
import { normalizeMediaUrl } from '../lib/mediaUrl';
import glossaryData from '../data/glossaryTerms.json';

interface GlossaryTerm {
  english: string;
  french: string;
  arabic: string;
  definition: string;
  letter: string;
}

const FALLBACK = glossaryData as { pdfUrl: string; terms: GlossaryTerm[] };

const META_FALLBACK = {
  pdfUrl: FALLBACK.pdfUrl,
  backgroundImage: '/images/glossarybg.jpg',
};

const ALPHABET_FILTERS = ['ALL', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')] as const;
type AlphabetFilter = (typeof ALPHABET_FILTERS)[number];

const CELL_BORDER = 'border border-[#c0d0b0]';
const ROW_STRIPE = 'bg-[#f2f7e5]';

function matchesFilter(term: GlossaryTerm, filter: AlphabetFilter): boolean {
  if (filter === 'ALL') return true;
  const first = term.english.trim()[0]?.toUpperCase() ?? '';
  if (/[0-9]/.test(filter)) return first === filter;
  return first === filter;
}

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<AlphabetFilter>('ALL');
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [terms, setTerms] = useState<GlossaryTerm[]>(FALLBACK.terms);
  const [pdfUrl, setPdfUrl] = useState(META_FALLBACK.pdfUrl);
  const [backgroundImage, setBackgroundImage] = useState(META_FALLBACK.backgroundImage);

  useEffect(() => {
    Promise.all([
      api.get('/glossary').catch(() => null),
      api.get('/site-content/glossary_meta').catch(() => null),
    ]).then(([apiTerms, meta]) => {
      if (Array.isArray(apiTerms) && apiTerms.length > 0) {
        setTerms(
          apiTerms.map((t: { term: string; frenchTerm?: string; arabicTerm?: string; definition: string }) => ({
            english: t.term,
            french: t.frenchTerm ?? '',
            arabic: t.arabicTerm ?? '',
            definition: t.definition,
            letter: t.term.trim()[0]?.toUpperCase() ?? 'A',
          })),
        );
      }
      if (meta?.pdfUrl) setPdfUrl(meta.pdfUrl);
      if (meta?.backgroundImage) {
        setBackgroundImage(normalizeMediaUrl(meta.backgroundImage));
      }
    });
  }, []);

  const embedCode = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/glossary" width="100%" height="600" frameborder="0" title="UASA Glossary"></iframe>`;

  const filteredTerms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return terms.filter((term) => {
      if (!matchesFilter(term, activeFilter)) return false;
      if (!query) return true;
      return (
        term.english.toLowerCase().includes(query) ||
        term.french.toLowerCase().includes(query) ||
        term.arabic.includes(query) ||
        term.definition.toLowerCase().includes(query)
      );
    });
  }, [terms, search, activeFilter]);

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-[#009900] text-white py-8 px-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">UASA Glossary</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="mb-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-9 pe-9 py-2 border border-[#c0d0b0] focus:border-[#009900] focus:ring-1 focus:ring-[#009900]/30 outline-none text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Download size={15} /> Download PDF
              </a>
              <button
                onClick={() => setShowEmbed(!showEmbed)}
                className="px-3 py-2 border border-[#c0d0b0] text-sm font-medium text-gray-600 hover:bg-[#f2f7e5] flex items-center gap-2"
              >
                <Code2 size={15} /> Embed
              </button>
            </div>
          </div>

          {showEmbed && (
            <div className="p-3 border border-[#c0d0b0] bg-[#f2f7e5]/50">
              <p className="text-xs text-gray-500 mb-2">Copy this code to embed the glossary:</p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-white p-2 border border-[#c0d0b0] overflow-x-auto">{embedCode}</code>
                <button onClick={copyEmbed} className="px-3 py-1.5 bg-[#009900] text-white text-xs">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {ALPHABET_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`min-w-[28px] px-1.5 py-0.5 text-xs font-semibold border transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#009900] text-white border-[#009900]'
                    : 'bg-white text-gray-600 border-[#c0d0b0] hover:bg-[#f2f7e5]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500">{filteredTerms.length} terms found</p>
        </div>

        <div className="relative border border-[#c0d0b0] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: 'repeat',
              backgroundSize: 'auto',
            }}
            aria-hidden
          />

          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-white">
                  <th className={`${CELL_BORDER} px-4 py-3 text-center font-bold text-[#008000] uppercase tracking-wide w-[18%]`}>
                    Term in English
                  </th>
                  <th className={`${CELL_BORDER} px-4 py-3 text-center font-bold text-[#008000] uppercase tracking-wide w-[22%]`}>
                    Term in French
                  </th>
                  <th className={`${CELL_BORDER} px-4 py-3 text-center font-bold text-[#008000] uppercase tracking-wide w-[18%]`}>
                    Term in Arabic
                  </th>
                  <th className={`${CELL_BORDER} px-4 py-3 text-center font-bold text-[#008000] uppercase tracking-wide`}>
                    Explanation
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTerms.length === 0 ? (
                  <tr className="bg-white">
                    <td colSpan={4} className={`${CELL_BORDER} px-4 py-8 text-center text-gray-500`}>
                      No terms match your search.
                    </td>
                  </tr>
                ) : (
                  filteredTerms.map((term, index) => (
                    <tr key={`${term.english}-${index}`} className={index % 2 === 0 ? ROW_STRIPE : 'bg-white'}>
                      <td className={`${CELL_BORDER} px-4 py-3 text-center align-middle text-gray-900`}>
                        {term.english}
                      </td>
                      <td className={`${CELL_BORDER} px-4 py-3 text-center align-middle text-gray-900`}>
                        {term.french}
                      </td>
                      <td className={`${CELL_BORDER} px-4 py-3 text-center align-middle text-gray-900`} dir="rtl">
                        {term.arabic}
                      </td>
                      <td className={`${CELL_BORDER} px-4 py-3 text-right align-middle text-gray-800 leading-relaxed`} dir="rtl">
                        {term.definition}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
