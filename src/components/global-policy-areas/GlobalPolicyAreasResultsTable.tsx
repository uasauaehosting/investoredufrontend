import { Fragment, useState } from 'react';
import { PolicyInstitutionGroup } from '../../lib/globalPolicyGrouping';
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
  const viewDescSentinel = t(lang, 'table.viewDesc', 'View Description');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose} role="presentation">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="policy-desc-modal-title">
        <h4 id="policy-desc-modal-title" className="text-lg font-bold text-[#009900] mb-3">{title}</h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {description?.trim() && description !== 'View Description' && description !== viewDescSentinel
            ? description
            : t(lang, 'table.noDesc', 'No description available.')}
        </p>
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

const thClass = 'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-white';
const tdClass = 'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm text-gray-800 align-middle';

export default function GlobalPolicyAreasResultsTable({ groups }: { groups: PolicyInstitutionGroup[] }) {
  const { lang } = useLanguage();

  if (groups.length === 0) {
    return <p className="text-gray-500 text-sm">{t(lang, 'noMatch.globalPolicy', 'No global policy areas match the selected filters.')}</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((institutionGroup) => (
        <div key={institutionGroup.institution} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse border border-[#ccc] text-sm new-tab">
            <tbody>
              <tr>
                <th colSpan={4} className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold text-white">
                  {institutionGroup.institution}
                </th>
              </tr>

              {institutionGroup.isEmpty ? (
                <tr>
                  <td colSpan={4} className="border border-[#ccc] px-4 py-6 text-center text-sm text-gray-600">
                    {t(lang, 'table.noContent', 'No Content Found!')}
                  </td>
                </tr>
              ) : (
                institutionGroup.categories.map((categoryGroup) => (
                  <Fragment key={`${institutionGroup.institution}-${categoryGroup.category}`}>
                    <tr>
                      <th colSpan={4} className="border border-[#ccc] bg-[#e8f5e9] px-4 py-2.5 text-center text-sm font-bold text-[#009900]">
                        {categoryGroup.category}
                      </th>
                    </tr>
                    <tr>
                      <th className={thClass}>{t(lang, 'table.title',       'Title')}</th>
                      <th className={thClass}>{t(lang, 'table.type',        'Type')}</th>
                      <th className={thClass}>{t(lang, 'table.description', 'Description')}</th>
                      <th className={thClass}>{t(lang, 'table.urlFile',     'URL / File')}</th>
                    </tr>
                    {categoryGroup.items.map((item, index) => {
                      const title       = pickLocalized(lang, item.title,       item.title_ar);
                      const description = pickLocalized(lang, item.description, item.description_ar);
                      return (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}>
                          <td className={`${tdClass} text-start`}>{title}</td>
                          <td className={tdClass}>{t(lang, 'table.general', 'General')}</td>
                          <td className={tdClass}><DescriptionLink title={title} description={description} /></td>
                          <td className={tdClass}>
                            {item.file_url ? (
                              <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-[#009900] hover:underline font-medium">
                                {t(lang, 'table.link', 'Link')}
                              </a>
                            ) : <span className="text-gray-400">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
