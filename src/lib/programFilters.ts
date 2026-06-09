export const PROGRAM_MEMBERS = [
  'Jordan Securities Commission',
  'Capital Market Authority',
  'Conseil du Marché Financier - Tunisia',
  "Commission d'Organisation et de Surveillance des opérations de Bourse",
  'Saudi Capital Market Authority',
  'Syrian Commission on financial markets and securities',
  'Iraqi Securities Commission',
  'Financial Services Authority - Oman',
  'Palestine Capital Market Authority',
  'Qatar Financial Markets Authority',
  'Kuwait Capital Markets Authority',
  'Capital Markets Authority of Lebanon',
  'LIBYAN CAPITAL MARKET AUTHORITY - LIBYA',
  'Financial Regulatory Authority - Egypt',
  'Autorité Marocaine du Marché des Capitaux (AMMC)',
  'Dubai Financial Services Authority',
] as const;

export const GENERAL_INFO_OPTIONS = [
  { value: 'gi1', label: 'Stated Goal of Investor Education Program' },
  { value: 'gi2', label: 'Stated Institutional Support for Investor Education' },
  { value: 'gi3', label: 'Other authority(ies) in my jurisdiction providing Investor Education' },
  { value: 'gi4', label: 'What is New? (New programs, developments, policies etc.)' },
] as const;

export const EDUCATION_MATERIALS_OPTIONS = [
  { value: 'iem1', label: 'Investing - Basic Materials' },
  { value: 'iem2', label: 'Investing - Advanced Materials' },
  { value: 'iem3', label: 'Investment and Understanding Risk and Rewards' },
  { value: 'iem4', label: 'Different Types of Investments' },
  { value: 'iem5', label: 'Calculators / Tools' },
  { value: 'iem6', label: 'Materials Relating to Scams, Frauds, and/or Alerts to Investors' },
  { value: 'iem7', label: 'Classroom Instruction Materials' },
  { value: 'iem8', label: 'Complex and/or New Financial Products' },
  { value: 'iem9', label: 'Unique Resources for Investors' },
] as const;

export const SPECIFIC_MATERIALS_OPTIONS = [
  { value: 'sm1', label: 'Youth (Grade School)' },
  { value: 'sm2', label: 'High School' },
  { value: 'sm3', label: 'Saving for College' },
  { value: 'sm4', label: 'College' },
] as const;

export const ASSISTING_GROUPS_OPTIONS = [
  { value: 'sa1', label: 'Single Young Adults' },
  { value: 'sa2', label: 'Married Young Adults' },
  { value: 'sa3', label: 'Adults with Children' },
  { value: 'sa4', label: 'Preparing for Retirement' },
  { value: 'sa5', label: 'Retirement' },
  { value: 'sa6', label: 'Military' },
  { value: 'sa7', label: 'Investors who have "some" experience in investing' },
] as const;

export const EVALUATION_OPTIONS = [
  { value: 'er1', label: 'How do you evaluate investor education initiatives?' },
  {
    value: 'er2',
    label:
      'How do you determine if the investor education program influences investors in their investment decisions?',
  },
] as const;

export const SUCCESSFUL_PROGRAMS_OPTIONS = [
  { value: 'aie1', label: 'Program' },
  { value: 'aie2', label: 'Supporting Research' },
] as const;

export type ProgramMember = (typeof PROGRAM_MEMBERS)[number];

export interface ProgramFilterOption {
  value: string;
  label: string;
}

export const PROGRAM_FILTER_GROUPS = [
  { name: 'generalInfo', title: 'General Information:', options: GENERAL_INFO_OPTIONS },
  { name: 'educationMaterials', title: 'Investor Education Materials:', options: EDUCATION_MATERIALS_OPTIONS },
  {
    name: 'specificMaterials',
    title: 'Specific Materials, Instruction, and Pedagogy/Methodology for:',
    options: SPECIFIC_MATERIALS_OPTIONS,
  },
  {
    name: 'assistingGroups',
    title: 'Specific Materials, Instruction, and Pedagogy for Assisting Certain Groups:',
    options: ASSISTING_GROUPS_OPTIONS,
  },
  { name: 'evaluation', title: 'Evaluation and Research:', options: EVALUATION_OPTIONS },
  {
    name: 'successfulPrograms',
    title: 'Any investor education program that has been proven to be successful in positively impacting investors:',
    options: SUCCESSFUL_PROGRAMS_OPTIONS,
  },
] as const;

export function getLabelsFromSelect(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions).map((option) => option.text);
}
