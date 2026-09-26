import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import {
  BENCHMARKING_AUTHORITIES,
  BENCHMARKING_YEARS,
  BenchmarkingAuthority,
  BenchmarkingYear,
  BenchmarkingRecord,
  filterBenchmarkingRecords,
  fromApiBenchmarkingRecord,
} from '../lib/benchmarking';
import { useLocalizedSiteContent } from '../lib/useLocalizedSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { pickLocalized } from '../lib/localizedText';
import { t } from '../lib/translations';

const INTRO_FALLBACK =
  'A review of available data and measurement exercises with which UASA Members can design and evaluate Corporate Governance application in their countries (Based on the UASA Guide)';

export default function MembersBenchmarking() {
  const { lang, isRtl } = useLanguage();
  const { data: pageContent } = useLocalizedSiteContent(
    'benchmarking',
    { intro: INTRO_FALLBACK, introAr: '' },
    ['intro'],
  );
  const [records, setRecords] = useState<BenchmarkingRecord[]>([]);
  const [years, setYears] = useState<BenchmarkingYear[]>([...BENCHMARKING_YEARS]);
  const [loading, setLoading] = useState(true);
  const [selectedYears, setSelectedYears] = useState<BenchmarkingYear[]>(['All Years']);
  const [selectedAuthority, setSelectedAuthority] = useState<BenchmarkingAuthority>('All Authorities');

  useEffect(() => {
    Promise.all([
      api.get('/benchmarking').catch(() => []),
      api.get('/benchmarking/filters').catch(() => null),
    ])
      .then(([rows, filters]) => {
        if (Array.isArray(rows)) setRecords(rows.map((row) => fromApiBenchmarkingRecord(row)));
        if (filters?.years?.length)  setYears(['All Years', ...filters.years]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = useMemo(
    () => filterBenchmarkingRecords(records, selectedYears, selectedAuthority),
    [records, selectedYears, selectedAuthority],
  );

  // Resolve intro: use Arabic override from CMS if present, else from translation map
  const introText =
    lang === 'ar'
      ? (((pageContent as { introAr?: string }).introAr) || t(lang, 'benchmarking.intro', INTRO_FALLBACK))
      : (pageContent.intro as string);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            {t(lang, 'benchmarking.badge', 'Financial Inclusion Index')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t(lang, 'benchmarking.title', "UASA Members' Benchmarking")}
          </h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          {/* Intro paragraph */}
          <div className="max-w-4xl mx-auto text-center mb-10">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed" dir={isRtl ? 'rtl' : 'ltr'}>
              {introText}
            </p>
          </div>

          {/* Year filter */}
          <div className="w-full mb-8">
            <label htmlFor="benchmarking-years" className="block text-sm font-semibold text-[#009900] mb-2" dir={isRtl ? 'rtl' : 'ltr'}>
              {t(lang, 'benchmarking.yearLabel', 'Year')}
            </label>
            <select
              id="benchmarking-years"
              multiple
              size={4}
              value={selectedYears}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions).map(
                  (option) => option.value as BenchmarkingYear,
                );
                if (options.length === 0 || options.includes('All Years')) {
                  setSelectedYears(['All Years']);
                  return;
                }
                setSelectedYears(options);
              }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === 'All Years' ? t(lang, 'benchmarking.allYears', 'All Years') : year}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {t(lang, 'benchmarking.ctrlHint', 'Hold Ctrl (Windows) or Cmd (Mac) to select multiple years')}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-[#009900] text-white">
                  <th colSpan={2} className="px-4 py-3 text-start font-semibold align-middle" dir={isRtl ? 'rtl' : 'ltr'}>
                    {t(lang, 'benchmarking.authorityCol', 'Authority')}
                  </th>
                  <th colSpan={2} className="px-4 py-3 text-start font-semibold align-middle">
                    <select
                      value={selectedAuthority}
                      onChange={(e) => setSelectedAuthority(e.target.value as BenchmarkingAuthority)}
                      className="w-full max-w-md rounded-lg border border-white/20 bg-white text-[#009900] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    >
                      {BENCHMARKING_AUTHORITIES.map((authority) => (
                        <option key={authority} value={authority}>
                          {authority === 'All Authorities'
                            ? t(lang, 'benchmarking.allAuthorities', 'All Authorities')
                            : authority}
                        </option>
                      ))}
                    </select>
                  </th>
                </tr>
                {filteredRecords.length > 0 && (
                  <tr className="bg-green-50 text-[#009900]">
                    <th className="px-4 py-3 text-start font-semibold">{t(lang, 'benchmarking.authorityCol', 'Authority')}</th>
                    <th className="px-4 py-3 text-start font-semibold">{t(lang, 'benchmarking.yearCol',      'Year')}</th>
                    <th className="px-4 py-3 text-start font-semibold">{t(lang, 'benchmarking.titleCol',     'Title')}</th>
                    <th className="px-4 py-3 text-start font-semibold">{t(lang, 'benchmarking.detailsCol',   'Details')}</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center text-gray-500">
                      {t(lang, 'benchmarking.loading', 'Loading benchmarking data...')}
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center text-gray-500">
                      {t(lang, 'benchmarking.noContent', 'No Content Found!')}
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record, index) => (
                    <tr
                      key={`${record.authority}-${record.year}-${index}`}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {pickLocalized(lang, record.authority, record.authorityNameAr)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{record.year}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {pickLocalized(lang, record.title, record.indicatorAr)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.fileUrl ? (
                          <a
                            href={record.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#009900] font-semibold hover:text-amber-600 transition-colors"
                          >
                            {t(lang, 'benchmarking.view', 'View')}
                          </a>
                        ) : (
                          record.description || '—'
                        )}
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
