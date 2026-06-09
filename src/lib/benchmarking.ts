export const BENCHMARKING_YEARS = [
  'All Years',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
] as const;

export const BENCHMARKING_AUTHORITIES = [
  'All Authorities',
  'Jordan Securities Commission',
  'Capital Market Authority',
  "Commission d'Organisation et de Surveillance des opérations de Bourse",
  'Saudi Capital Market Authority',
  'Syrian Commission on financial markets and securities',
  'Iraqi Securities Commission',
  'Financial Services Authority - Oman',
  'Palestine Capital Market Authority',
  'Qatar Financial Markets Authority',
  'Kuwait Capital Markets Authority',
  'Capital Markets Authority of Lebanon',
  'Financial Regulatory Authority - Egypt',
  'Autorité Marocaine du Marché des Capitaux (AMMC)',
  'Conseil du Marché Financier - Tunisia',
  'LIBYAN CAPITAL MARKET AUTHORITY - LIBYA',
  'Dubai Financial Services Authority',
] as const;

export type BenchmarkingYear = (typeof BENCHMARKING_YEARS)[number];
export type BenchmarkingAuthority = (typeof BENCHMARKING_AUTHORITIES)[number];

export interface BenchmarkingRecord {
  authority: string;
  authorityNameAr?: string;
  year: string;
  title: string;
  indicatorAr?: string;
  description?: string;
  fileUrl?: string;
}

export const BENCHMARKING_RECORDS: BenchmarkingRecord[] = [];

interface ApiBenchmarkingRow {
  id?: number;
  authorityName: string;
  authorityNameAr?: string | null;
  year: string;
  indicator?: string | null;
  indicatorAr?: string | null;
  value?: string | null;
  data?: Record<string, unknown> | null;
}

export function fromApiBenchmarkingRecord(row: ApiBenchmarkingRow): BenchmarkingRecord {
  const data = row.data ?? {};
  return {
    authority: row.authorityName,
    authorityNameAr: row.authorityNameAr ?? undefined,
    year: row.year,
    title: String(data.title ?? row.indicator ?? ''),
    indicatorAr: row.indicatorAr ?? undefined,
    description: data.description != null ? String(data.description) : row.value ?? undefined,
    fileUrl: data.fileUrl != null ? String(data.fileUrl) : undefined,
  };
}

export function toApiBenchmarkingPayload(record: BenchmarkingRecord) {
  return {
    authorityName: record.authority,
    authorityNameAr: record.authorityNameAr?.trim() || null,
    year: record.year,
    indicator: null,
    indicatorAr: record.indicatorAr?.trim() || null,
    value: null,
    data: {
      title: record.title,
      description: record.description ?? '',
      fileUrl: record.fileUrl ?? '',
    },
    isActive: true,
  };
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesBenchmarkingAuthority(
  recordAuthority: string,
  filter: BenchmarkingAuthority,
): boolean {
  if (filter === 'All Authorities') return true;

  const normalizedRecord = normalizeText(recordAuthority);
  const normalizedFilter = normalizeText(filter);

  if (normalizedRecord.includes(normalizedFilter) || normalizedFilter.includes(normalizedRecord)) {
    return true;
  }

  if (filter === 'Capital Market Authority') {
    const exclusions = ['saudi', 'kuwait', 'lebanon', 'palestine', 'qatar', 'jordan', 'iraq', 'syria', 'libya'];
    if (exclusions.some((term) => normalizedRecord.includes(term))) return false;
    return normalizedRecord.includes('capital market authority');
  }

  if (filter.includes('COSOB') || filter.includes('Organisation')) {
    return normalizedRecord.includes('cosob') || normalizedRecord.includes('organisation');
  }

  if (filter.includes('LIBYAN')) {
    return normalizedRecord.includes('libya');
  }

  return false;
}

export function filterBenchmarkingRecords(
  records: BenchmarkingRecord[],
  selectedYears: BenchmarkingYear[],
  selectedAuthority: BenchmarkingAuthority,
): BenchmarkingRecord[] {
  const useAllYears =
    selectedYears.length === 0 ||
    selectedYears.includes('All Years') ||
    selectedYears.length === BENCHMARKING_YEARS.length - 1;

  const activeYears = selectedYears.filter((year) => year !== 'All Years');

  return records.filter((record) => {
    const yearMatch = useAllYears || activeYears.includes(record.year as BenchmarkingYear);
    const authorityMatch = matchesBenchmarkingAuthority(record.authority, selectedAuthority);
    return yearMatch && authorityMatch;
  });
}
