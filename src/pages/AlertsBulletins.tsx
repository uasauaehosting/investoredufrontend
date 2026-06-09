import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  AlertBulletinItem,
  AlertsBulletinsDataRows,
  AlertsBulletinsEmptyRow,
} from '../components/alerts-bulletins/AlertsBulletinsResultsTable';
import { api } from '../lib/api';
import { ALERT_BULLETIN_AUTHORITIES, ALERT_BULLETIN_YEARS } from '../lib/alertBulletinFilters';

function getSelectedYears(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions)
    .map((option) => option.value)
    .filter((value) => value !== 'All Years');
}

function filterByYears(items: AlertBulletinItem[], years: string[]): AlertBulletinItem[] {
  if (years.length === 0) return items;
  return items.filter((item) => years.includes(item.year));
}

export default function AlertsBulletins() {
  const [selectedAuthority, setSelectedAuthority] = useState('All Authorities');
  const [items, setItems] = useState<AlertBulletinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (authority: string, years: string[]) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ is_active: 'true' });
      if (authority && authority !== 'All Authorities') {
        params.set('authority', authority);
      }
      const data = await api.get(`/alerts-bulletins?${params.toString()}`);
      setItems(filterByYears(data ?? [], years));
    } catch {
      setError('Failed to load alerts and bulletins. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems('All Authorities', []);
  }, [fetchItems]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const years = getSelectedYears(event.currentTarget);
    fetchItems(selectedAuthority, years);
  };

  const handleAuthorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const authority = event.currentTarget.value;
    setSelectedAuthority(authority);
    const yearSelect = document.getElementById('alerts-year') as HTMLSelectElement | null;
    const years = yearSelect ? getSelectedYears(yearSelect) : [];
    fetchItems(authority, years);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title="Alerts & Bulletins"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Investor Education', href: '/education/reading-materials' },
          { label: 'Alerts & Bulletins' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <h2 className="text-xl font-bold text-[#009900] mb-4">Alerts & Bulletins</h2>
          <hr className="border-gray-300 mb-6" />

          <select
            id="alerts-year"
            name="year"
            multiple
            size={4}
            onChange={handleYearChange}
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20 mb-8"
          >
            <option value="All Years">All Years</option>
            {ALERT_BULLETIN_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse border border-[#ccc] text-sm new-tab">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    align="left"
                    scope="col"
                    className="border border-[#ccc] bg-white px-4 py-3 text-start text-sm font-bold text-gray-900"
                  >
                    Authority
                  </th>
                  <th
                    colSpan={2}
                    scope="col"
                    className="border border-[#ccc] bg-white px-4 py-3 text-sm"
                  >
                    <select
                      name="authority"
                      value={selectedAuthority}
                      onChange={handleAuthorityChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                    >
                      <option value="All Authorities">All Authorities</option>
                      {ALERT_BULLETIN_AUTHORITIES.map((authority) => (
                        <option key={authority} value={authority}>
                          {authority}
                        </option>
                      ))}
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-[#ccc] px-4 py-6 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-[#ccc] px-4 py-6 text-center text-sm text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <AlertsBulletinsEmptyRow />
                ) : (
                  <AlertsBulletinsDataRows items={items} />
                )}
              </tbody>
            </table>
          </div>

          <div className="clearfix mt-6" aria-hidden="true">
            &nbsp;
          </div>
        </section>
      </div>
    </div>
  );
}
