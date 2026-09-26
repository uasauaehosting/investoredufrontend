import { Fragment } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { t } from '../../lib/translations';

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

type SectionKey = keyof Pick<
  Program,
  'general_info' | 'education_materials' | 'specific_materials' | 'assisting_groups' | 'evaluation' | 'successful_programs'
>;

const PROGRAM_SECTION_KEYS: { key: SectionKey; translationKey: string; fallback: string }[] = [
  { key: 'general_info',        translationKey: 'programs.section.generalInfo',        fallback: 'General Information' },
  { key: 'education_materials', translationKey: 'programs.section.educationMaterials', fallback: 'Investor Education Materials' },
  { key: 'specific_materials',  translationKey: 'programs.section.specificMaterials',  fallback: 'Specific Materials & Pedagogy' },
  { key: 'assisting_groups',    translationKey: 'programs.section.assistingGroups',    fallback: 'Assisting Certain Groups' },
  { key: 'evaluation',          translationKey: 'programs.section.evaluation',         fallback: 'Evaluation and Research' },
  { key: 'successful_programs', translationKey: 'programs.section.successfulPrograms', fallback: 'Successful Programs' },
];

const thClass =
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-white';
const tdClass =
  'border border-[#ccc] px-3 py-2.5 text-start text-xs sm:text-sm text-gray-800 align-middle';

export default function ProgramsResultsTable({ programs }: { programs: Program[] }) {
  const { lang } = useLanguage();

  if (programs.length === 0) {
    return <p className="text-gray-500 text-sm">{t(lang, 'noMatch.programs', 'No programs match the selected filters.')}</p>;
  }

  return (
    <div className="space-y-10">
      {programs.map((program) => {
        const sections = PROGRAM_SECTION_KEYS.filter((s) => program[s.key].length > 0);

        return (
          <div key={program.id} className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse border border-[#ccc] text-sm">
              <tbody>
                <tr>
                  <th colSpan={2} className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white">
                    {program.member_name}
                  </th>
                </tr>

                {sections.map((section) => (
                  <Fragment key={section.key}>
                    <tr>
                      <th colSpan={2} className="border border-[#ccc] bg-[#e8f5e9] px-4 py-2.5 text-center text-sm font-bold uppercase text-[#009900]">
                        {t(lang, section.translationKey, section.fallback)}
                      </th>
                    </tr>
                    <tr>
                      <th className={thClass}>{t(lang, 'table.num',            '#')}</th>
                      <th className={thClass}>{t(lang, 'table.programElement', 'Program Element')}</th>
                    </tr>
                    {program[section.key].map((item, index) => (
                      <tr key={`${section.key}-${item}`} className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}>
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
