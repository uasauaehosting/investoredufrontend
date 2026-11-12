import { Fragment } from 'react';
import { useSectionLang } from '../../lib/SectionLangContext';
import { pickLocalizedArray } from '../../lib/localizedText';
import { t } from '../../lib/translations';

interface Program {
  id: number;
  member_name: string;
  member_name_ar?: string | null;
  general_info: string[];
  general_info_ar?: string[] | null;
  education_materials: string[];
  education_materials_ar?: string[] | null;
  specific_materials: string[];
  specific_materials_ar?: string[] | null;
  assisting_groups: string[];
  assisting_groups_ar?: string[] | null;
  evaluation: string[];
  evaluation_ar?: string[] | null;
  successful_programs: string[];
  successful_programs_ar?: string[] | null;
}

type SectionKey = keyof Pick<
  Program,
  'general_info' | 'education_materials' | 'specific_materials' | 'assisting_groups' | 'evaluation' | 'successful_programs'
>;

type SectionArKey = keyof Pick<
  Program,
  'general_info_ar' | 'education_materials_ar' | 'specific_materials_ar' | 'assisting_groups_ar' | 'evaluation_ar' | 'successful_programs_ar'
>;

const PROGRAM_SECTION_KEYS: {
  key: SectionKey;
  arKey: SectionArKey;
  translationKey: string;
  fallback: string;
}[] = [
  { key: 'general_info',        arKey: 'general_info_ar',        translationKey: 'programs.section.generalInfo',        fallback: 'General Information' },
  { key: 'education_materials', arKey: 'education_materials_ar', translationKey: 'programs.section.educationMaterials', fallback: 'Investor Education Materials' },
  { key: 'specific_materials',  arKey: 'specific_materials_ar',  translationKey: 'programs.section.specificMaterials',  fallback: 'Specific Materials & Pedagogy' },
  { key: 'assisting_groups',    arKey: 'assisting_groups_ar',    translationKey: 'programs.section.assistingGroups',    fallback: 'Assisting Certain Groups' },
  { key: 'evaluation',          arKey: 'evaluation_ar',          translationKey: 'programs.section.evaluation',         fallback: 'Evaluation and Research' },
  { key: 'successful_programs', arKey: 'successful_programs_ar', translationKey: 'programs.section.successfulPrograms', fallback: 'Successful Programs' },
];

const thClass =
  'border border-[#ccc] px-3 py-2.5 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 bg-white';
const tdClass =
  'border border-[#ccc] px-3 py-2.5 text-start text-xs sm:text-sm text-gray-800 align-middle';

export default function ProgramsResultsTable({ programs }: { programs: Program[] }) {
  const { lang, isRtl, missingArPolicy } = useSectionLang();

  if (programs.length === 0) {
    return <p className="text-gray-500 text-sm">{t(lang, 'noMatch.programs', 'No programs match the selected filters.')}</p>;
  }

  return (
    // RTL wrapper: flips text direction when Arabic is active
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>
      {programs.map((program) => {
        // Resolve the member name for the header
        const memberName =
          lang === 'ar' && program.member_name_ar?.trim()
            ? program.member_name_ar
            : program.member_name;

        const sections = PROGRAM_SECTION_KEYS.filter((s) => {
          const enItems = program[s.key];
          return enItems.length > 0;
        });

        return (
          <div key={program.id} className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse border border-[#ccc] text-sm">
              <tbody>
                <tr>
                  <th colSpan={2} className="border border-[#ccc] bg-[#009900] px-4 py-3 text-center text-sm sm:text-base font-bold uppercase text-white">
                    {memberName}
                  </th>
                </tr>

                {sections.map((section) => {
                  // Pick localised items for this section
                  const items = pickLocalizedArray(
                    lang,
                    program[section.key],
                    program[section.arKey] ?? null,
                  );

                  // Apply missing-AR policy: skip whole section if no Arabic items
                  if (
                    lang === 'ar' &&
                    missingArPolicy === 'hide' &&
                    !(program[section.arKey] ?? []).some((s) => s?.trim())
                  ) {
                    return null;
                  }

                  if (items.length === 0) return null;

                  return (
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
                      {items.map((item, index) => (
                        <tr key={`${section.key}-${index}`} className={index % 2 === 0 ? 'bg-[#eef7ee]' : 'bg-white'}>
                          <td className={`${tdClass} text-center w-12`}>{index + 1}</td>
                          <td className={tdClass}>{item}</td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
