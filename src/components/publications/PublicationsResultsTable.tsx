import { Fragment, useState } from 'react';
import { PublicationAuthorityGroup } from '../../lib/publicationGrouping';
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose} role="presentation">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="pub-desc-modal-title">
        <h4 id="pub-desc-modal-title" className="text-lg font-bold text-[#009900] mb-3">{title}</h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {description?.trim() || t(lang, 'table.noDesc', 'No description available.')}
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

export default function PublicationsResultsTable({ groups }: { groups: PublicationAuthorityGroup[] }) {
  const { lang } = useLanguage();

  if (groups.length === 0) {
    return <p className="text-gray-500 text-sm">{t(lang, 'noMatch.publications', 'No publications match the selected filters.')}</p>;
  }

  return (
    <div className="space-y-10">
      {groups.map((authorityGroup) => (
        <div key={authorityGroup.authority} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse border border-[#ccc] text-sm">
            <tbody>
              <tr>
                <th colSpan={4} className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white">
                  {authorityGroup.authority}
                </th>
              </tr>
              {authorityGroup.categories.map((categoryGroup) => (
                <Fragment key={`${authorityGroup.authority}-${categoryGroup.category}`}>
                  <tr>
                    <th colSpan={4} className="border border-[#ccc] bg-[#e8f5e9] px-4 py-2.5 text-center text-sm font-bold uppercase text-[#009900]">
                      {categoryGroup.category}
                    </th>
                  </tr>
                  <tr>
                    <th className={thClass}>{t(lang, 'table.title',   'Title')}</th>
                    <th className={thClass}>{t(lang, 'table.type',    'Type')}</th>
                    <th className={thClass}>{t(lang, 'table.description', 'Description')}</th>
                    <th className={thClass}>{t(lang, 'table.urlFile', 'URL / File')}</th>
                  </tr>
                  {categoryGroup.items.map((publication, index) => {
                    const title       = pickLocalized(lang, publication.title,       publication.title_ar);
                    const description = pickLocalized(lang, publication.description, publication.description_ar);
                    return (
                      <tr key={publication.id} className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}>
                        <td className={tdClass}>{title}</td>
                        <td className={tdClass}>{publication.category}</td>
                        <td className={tdClass}><DescriptionLink title={title} description={description} /></td>
                        <td className={tdClass}>
                          {publication.file_url ? (
                            <a href={publication.file_url} target="_blank" rel="noopener noreferrer" className="text-[#009900] hover:underline font-medium">
                              {t(lang, 'table.link', 'Link')}
                            </a>
                          ) : <span className="text-gray-400">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
