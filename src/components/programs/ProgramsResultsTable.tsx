import { Fragment } from 'react';

interface Program {
  id: number;
  member_name: string;
  general_info: string[];
  education_materials: string[];
  specific_materials: string[];
  assisting_groups: string[];
  evaluation: string[];
  successful_programs: string[];
}

const PROGRAM_SECTIONS = [
  { key: 'general_info' as const, title: 'General Information' },
  { key: 'education_materials' as const, title: 'Investor Education Materials' },
  { key: 'specific_materials' as const, title: 'Specific Materials & Pedagogy' },
  { key: 'assisting_groups' as const, title: 'Assisting Certain Groups' },
  { key: 'evaluation' as const, title: 'Evaluation and Research' },
  { key: 'successful_programs' as const, title: 'Successful Programs' },
];

const thClass =
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-white';
const tdClass = 'border border-[#ccc] px-3 py-2.5 text-start text-xs sm:text-sm text-gray-800 align-middle';

export default function ProgramsResultsTable({ programs }: { programs: Program[] }) {
  if (programs.length === 0) {
    return <p className="text-gray-500 text-sm">No programs match the selected filters.</p>;
  }

  return (
    <div className="space-y-10">
      {programs.map((program) => {
        const sections = PROGRAM_SECTIONS.filter((section) => program[section.key].length > 0);

        return (
          <div key={program.id} className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse border border-[#ccc] text-sm">
              <tbody>
                <tr>
                  <th
                    colSpan={2}
                    className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white"
                  >
                    {program.member_name}
                  </th>
                </tr>

                {sections.map((section) => (
                  <Fragment key={section.key}>
                    <tr>
                      <th
                        colSpan={2}
                        className="border border-[#ccc] bg-[#e8f5e9] px-4 py-2.5 text-center text-sm font-bold uppercase text-[#009900]"
                      >
                        {section.title}
                      </th>
                    </tr>
                    <tr>
                      <th className={thClass}>#</th>
                      <th className={thClass}>Program Element</th>
                    </tr>
                    {program[section.key].map((item, index) => (
                      <tr
                        key={`${section.key}-${item}`}
                        className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}
                      >
                        <td className={`${tdClass} text-center w-12`}>{index + 1}</td>
                        <td className={tdClass}>{item}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
