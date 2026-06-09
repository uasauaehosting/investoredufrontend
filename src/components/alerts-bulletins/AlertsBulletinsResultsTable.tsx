export interface AlertBulletinItem {
  id: number;
  title: string;
  type: string;
  description: string;
  authority_name: string;
  year: string;
  date_published: string | null;
  link: string;
}

const thClass =
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-white';
const tdClass =
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm text-gray-800 align-middle';

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AlertsBulletinsEmptyRow() {
  return (
    <tr>
      <td colSpan={4} className="border border-[#ccc] px-4 py-6 text-center text-sm text-gray-600">
        No Content Found!
      </td>
    </tr>
  );
}

export function AlertsBulletinsDataRows({ items }: { items: AlertBulletinItem[] }) {
  return (
    <>
      <tr>
        <th className={thClass}>Title</th>
        <th className={thClass}>Type</th>
        <th className={thClass}>Date</th>
        <th className={thClass}>Link</th>
      </tr>
      {items.map((item, index) => (
        <tr key={item.id} className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}>
          <td className={`${tdClass} text-start`}>{item.title}</td>
          <td className={tdClass}>{item.type}</td>
          <td className={tdClass}>{formatDate(item.date_published)}</td>
          <td className={tdClass}>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#009900] hover:underline font-medium"
              >
                Link
              </a>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}
