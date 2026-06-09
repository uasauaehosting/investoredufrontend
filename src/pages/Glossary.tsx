import { useMemo, useState, useEffect } from 'react';
import { BookOpen, Code2, Download, Search, X } from 'lucide-react';
import { api } from '../lib/api';
import glossaryData from '../data/glossaryTerms.json';

interface GlossaryTerm {
  english: string;
  french: string;
  arabic: string;
  definition: string;
  letter: string;
}

const FALLBACK = glossaryData as { pdfUrl: string; terms: GlossaryTerm[] };

const ALPHABET_FILTERS = ['ALL', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')] as const;
type AlphabetFilter = (typeof ALPHABET_FILTERS)[number];

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
  const [pdfUrl, setPdfUrl] = useState(FALLBACK.pdfUrl);

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
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#00285e] to-[#003580] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <BookOpen className="mx-auto mb-4 text-amber-400" size={40} />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">UASA Glossary</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">
            Multilingual financial terms in English, French, and Arabic
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search terms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-11 pe-10 py-3 rounded-xl border border-gray-200 focus:border-[#00285e] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap">
                <Download size={16} /> Download PDF
              </a>
              <button onClick={() => setShowEmbed(!showEmbed)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                <Code2 size={16} /> Embed
              </button>
            </div>
          </div>

          {showEmbed && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Copy this code to embed the glossary:</p>
              <div className="flex gap-2">
                <code className="flex-1 text-xs bg-white p-3 rounded-lg border overflow-x-auto">{embedCode}</code>
                <button onClick={copyEmbed} className="px-3 py-2 bg-[#00285e] text-white text-xs rounded-lg">{copied ? 'Copied!' : 'Copy'}</button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mt-4">
            {ALPHABET_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === filter ? 'bg-[#00285e] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{filteredTerms.length} terms found</p>

        <div className="grid gap-4">
          {filteredTerms.map((term, index) => (
            <div key={`${term.english}-${index}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#00285e] mb-2">{term.english}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                {term.french && <span><strong>FR:</strong> {term.french}</span>}
                {term.arabic && <span><strong>AR:</strong> {term.arabic}</span>}
              </div>
              <p className="text-gray-600 leading-relaxed">{term.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
