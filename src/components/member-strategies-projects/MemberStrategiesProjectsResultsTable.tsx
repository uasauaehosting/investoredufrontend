import { useState } from 'react';
import { MemberStrategyProjectGroup } from '../../lib/strategiesProjectsGrouping';
import { useLanguage } from '../../lib/LanguageContext';
import { pickLocalized } from '../../lib/localizedText';
import { t } from '../../lib/translations';

function DescriptionModal({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string | null;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const text =
    description?.trim() && description !== 'View Description'
      ? description
      : t(lang, 'table.noDesc', 'No description available.');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose} role="presentation">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="strat-desc-modal-title">
        <h4 id="strat-desc-modal-title" className="text-lg font-bold text-[#009900] mb-3">{title}</h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
        <button type="button" onClick={onClose} className="mt-6 rounded bg-[#009900] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006600]">
          {t(lang, 'table.close', 'Close')}
        </button>
      </div>
    </div>
  );
}

function DescriptionLink({ title, description }: { title: string; description: string | null }) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-[#009900] hover:underline cursor-pointer text-sm">
        {t(lang, 'table.viewDesc', 'View Description')}
      </button>
      {open && <DescriptionModal title={title} description={description} onClose={() => setOpen(false)} />}
    </>
  );
}

const thClass = 'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-[#f5f5f0]';
const tdClass = 'border border-[#ccc] px-3 py-2.5 text-xs sm:text-sm text-gray-800 align-middle';

function getCategoryLabel(type?: string, categoryName?: string | null): string {
  return categoryName || type || '—';
}

export default function MemberStrategiesProjectsResultsTable({ groups }: { groups: MemberStrategyProjectGroup[] }) {
  const { lang } = useLanguage();

  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        {t(lang, 'noMatch.strategies', 'No resources match your selected filters. Try adjusting your selection.')}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.member} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse border border-[#ccc] text-sm">
            <tbody>
              <tr>
                <th colSpan={4} className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white">
                  {group.member}
                </th>
              </tr>
              <tr>
                <th className={`${thClass} text-start`}>{t(lang, 'table.title',       'Title')}</th>
                <th className={thClass}>                  {t(lang, 'table.category',    'Category')}</th>
                <th className={thClass}>                  {t(lang, 'table.description', 'Description')}</th>
                <th className={thClass}>                  {t(lang, 'table.urlFile',     'URL / File')}</th>
              </tr>
              {group.items.map((project, index) => {
                const title       = pickLocalized(lang, project.title,       project.titleAr);
                const description = pickLocalized(lang, project.description, project.descriptionAr);
                return (
                  <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef7ee]'}>
                    <td className={`${tdClass} text-start`}>{title}</td>
                    <td className={`${tdClass} text-center`}>{getCategoryLabel(project.type, project.categoryName)}</td>
                    <td className={`${tdClass} text-center`}><DescriptionLink title={title} description={description} /></td>
                    <td className={`${tdClass} text-center`}>
                      {project.fileUrl ? (
                        <a href={project.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[#009900] hover:underline font-medium">
                          {t(lang, 'table.link', 'Link')}
                        </a>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
