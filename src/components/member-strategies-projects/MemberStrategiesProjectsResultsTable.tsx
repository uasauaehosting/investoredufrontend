import { useState } from 'react';
import { MemberStrategyProjectGroup } from '../../lib/strategiesProjectsGrouping';

interface DescriptionModalProps {
  title: string;
  description: string | null;
  onClose: () => void;
}

function DescriptionModal({ title, description, onClose }: DescriptionModalProps) {
  const text =
    description?.trim() && description !== 'View Description'
      ? description
      : 'No description available.';

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
        aria-labelledby="strategy-description-modal-title"
      >
        <h4 id="strategy-description-modal-title" className="text-lg font-bold text-[#009900] mb-3">
          {title}
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
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
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-[#f5f5f0]';
const tdClass =
  'border border-[#ccc] px-3 py-2.5 text-xs sm:text-sm text-gray-800 align-middle';

function getCategoryLabel(type?: string, categoryName?: string | null): string {
  return categoryName || type || '—';
}

export default function MemberStrategiesProjectsResultsTable({
  groups,
}: {
  groups: MemberStrategyProjectGroup[];
}) {
  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-8">
        No resources match your selected filters. Try adjusting your selection.
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
                <th
                  colSpan={4}
                  className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white"
                >
                  {group.member}
                </th>
              </tr>
              <tr>
                <th className={`${thClass} text-start`}>Title</th>
                <th className={thClass}>Category</th>
                <th className={thClass}>Description</th>
                <th className={thClass}>URL / File</th>
              </tr>
              {group.items.map((project, index) => (
                <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef7ee]'}>
                  <td className={`${tdClass} text-start`}>{project.title}</td>
                  <td className={`${tdClass} text-center`}>
                    {getCategoryLabel(project.type, project.categoryName)}
                  </td>
                  <td className={`${tdClass} text-center`}>
                    <DescriptionLink title={project.title} description={project.description} />
                  </td>
                  <td className={`${tdClass} text-center`}>
                    {project.fileUrl ? (
                      <a
                        href={project.fileUrl}
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
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
