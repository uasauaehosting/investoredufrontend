import { Fragment, useState } from 'react';
import { PublicationAuthorityGroup } from '../../lib/publicationGrouping';

interface DescriptionModalProps {
  title: string;
  description: string | null;
  onClose: () => void;
}

function DescriptionModal({ title, description, onClose }: DescriptionModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-labelledby="description-modal-title"
      >
        <h4 id="description-modal-title" className="text-lg font-bold text-[#009900] mb-3">
          {title}
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {description?.trim() || 'No description available.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded bg-[#009900] px-4 py-2 text-sm font-semibold text-white hover:bg-[#006600]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function DescriptionLink({
  title,
  description,
}: {
  title: string;
  description: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[#009900] hover:underline cursor-pointer text-sm"
      >
        View Description
      </button>
      {open && (
        <DescriptionModal title={title} description={description} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

const thClass =
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-white';
const tdClass = 'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm text-gray-800 align-middle';

export default function PublicationsResultsTable({
  groups,
}: {
  groups: PublicationAuthorityGroup[];
}) {
  if (groups.length === 0) {
    return <p className="text-gray-500 text-sm">No publications match the selected filters.</p>;
  }

  return (
    <div className="space-y-10">
      {groups.map((authorityGroup) => (
        <div key={authorityGroup.authority} className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse border border-[#ccc] text-sm">
            <tbody>
              <tr>
                <th
                  colSpan={4}
                  className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white"
                >
                  {authorityGroup.authority}
                </th>
              </tr>

              {authorityGroup.categories.map((categoryGroup) => (
                <Fragment key={`${authorityGroup.authority}-${categoryGroup.category}`}>
                  <tr>
                    <th
                      colSpan={4}
                      className="border border-[#ccc] bg-[#e8f5e9] px-4 py-2.5 text-center text-sm font-bold uppercase text-[#009900]"
                    >
                      {categoryGroup.category}
                    </th>
                  </tr>
                  <tr>
                    <th className={thClass}>Title</th>
                    <th className={thClass}>Type</th>
                    <th className={thClass}>Description</th>
                    <th className={thClass}>URL / File</th>
                  </tr>
                  {categoryGroup.items.map((publication, index) => (
                    <tr
                      key={publication.id}
                      className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}
                    >
                      <td className={tdClass}>{publication.title}</td>
                      <td className={tdClass}>{publication.category}</td>
                      <td className={tdClass}>
                        <DescriptionLink
                          title={publication.title}
                          description={publication.description}
                        />
                      </td>
                      <td className={tdClass}>
                        {publication.file_url ? (
                          <a
                            href={publication.file_url}
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
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
