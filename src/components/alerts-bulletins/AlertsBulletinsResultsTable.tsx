import { useLanguage } from '../../lib/LanguageContext';
import { pickLocalized } from '../../lib/localizedText';
import { t } from '../../lib/translations';

export interface AlertBulletinItem {
  id: number;
  title: string;
  titleAr?: string | null;
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

function formatDate(value: string | null, locale: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AlertsBulletinsEmptyRow() {
  const { lang } = useLanguage();
  return (
    <tr>
      <td colSpan={4} className="border border-[#ccc] px-4 py-6 text-center text-sm text-gray-600">
        {t(lang, 'table.noContent', 'No Content Found!')}
      </td>
    </tr>
  );
}

export function AlertsBulletinsDataRows({ items }: { items: AlertBulletinItem[] }) {
  const { lang } = useLanguage();
  const dateLocale = lang === 'ar' ? 'ar-AE' : 'en-GB';

  return (
    <>
      <tr>
        <th className={thClass}>{t(lang, 'table.title',    'Title')}</th>
        <th className={thClass}>{t(lang, 'table.type',     'Type')}</th>
        <th className={thClass}>{t(lang, 'table.date',     'Date')}</th>
        <th className={thClass}>{t(lang, 'table.link',     'Link')}</th>
      </tr>
      {items.map((item, index) => (
        <tr key={item.id} className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}>
          <td className={`${tdClass} text-start`}>{pickLocalized(lang, item.title, item.titleAr)}</td>
          <td className={tdClass}>{item.type}</td>
          <td className={tdClass}>{formatDate(item.date_published, dateLocale)}</td>
          <td className={tdClass}>
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#009900] hover:underline font-medium">
                {t(lang, 'table.link', 'Link')}
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
