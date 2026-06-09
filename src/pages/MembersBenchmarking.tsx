import { useMemo, useState } from 'react';
import {
  BENCHMARKING_AUTHORITIES,
  BENCHMARKING_RECORDS,
  BENCHMARKING_YEARS,
  BenchmarkingAuthority,
  BenchmarkingYear,
  filterBenchmarkingRecords,
} from '../lib/benchmarking';

const intro =
  'A review of available data and measurement exercises with which UASA Members can design and evaluate Corporate Governance application in their countries (Based on the UASA Guide)';

export default function MembersBenchmarking() {
  const [selectedYears, setSelectedYears] = useState<BenchmarkingYear[]>(['All Years']);
  const [selectedAuthority, setSelectedAuthority] =
    useState<BenchmarkingAuthority>('All Authorities');

  const filteredRecords = useMemo(
    () => filterBenchmarkingRecords(BENCHMARKING_RECORDS, selectedYears, selectedAuthority),
    [selectedYears, selectedAuthority],
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#00285e] to-[#003580] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#00285e] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            Financial Inclusion Index
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            UASA Members&apos; Benchmarking
          </h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{intro}</p>
          </div>

          <div className="w-full mb-8">
            <label htmlFor="benchmarking-years" className="block text-sm font-semibold text-[#00285e] mb-2">
              Year
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
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00285e]/20"
            >
              {BENCHMARKING_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple years
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-[#00285e] text-white">
                  <th colSpan={2} className="px-4 py-3 text-start font-semibold align-middle">
                    Authority
                  </th>
                  <th colSpan={2} className="px-4 py-3 text-start font-semibold align-middle">
                    <select
                      value={selectedAuthority}
                      onChange={(e) =>
                        setSelectedAuthority(e.target.value as BenchmarkingAuthority)
                      }
                      className="w-full max-w-md rounded-lg border border-white/20 bg-white text-[#00285e] px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    >
                      {BENCHMARKING_AUTHORITIES.map((authority) => (
                        <option key={authority} value={authority}>
                          {authority}
                        </option>
                      ))}
                    </select>
                  </th>
                </tr>
                {filteredRecords.length > 0 && (
                  <tr className="bg-blue-50 text-[#00285e]">
                    <th className="px-4 py-3 text-start font-semibold">Authority</th>
                    <th className="px-4 py-3 text-start font-semibold">Year</th>
                    <th className="px-4 py-3 text-start font-semibold">Title</th>
                    <th className="px-4 py-3 text-start font-semibold">Details</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center text-gray-500">
                      No Content Found!
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record, index) => (
                    <tr
                      key={`${record.authority}-${record.year}-${index}`}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">{record.authority}</td>
                      <td className="px-4 py-3 text-gray-600">{record.year}</td>
                      <td className="px-4 py-3 text-gray-800">{record.title}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.fileUrl ? (
                          <a
                            href={record.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00285e] font-semibold hover:text-amber-600 transition-colors"
                          >
                            View
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
