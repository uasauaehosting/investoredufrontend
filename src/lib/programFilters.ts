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

/** Arabic display names for PROGRAM_MEMBERS (keyed by English value). */
export const PROGRAM_MEMBERS_AR: Record<string, string> = {
  'Jordan Securities Commission':                                            'هيئة الأوراق المالية الأردنية',
  'Capital Market Authority':                                                'هيئة أسواق المال',
  'Conseil du Marché Financier - Tunisia':                                   'مجلس السوق المالية - تونس',
  "Commission d'Organisation et de Surveillance des opérations de Bourse":  'لجنة تنظيم ومراقبة عمليات البورصة',
  'Saudi Capital Market Authority':                                          'هيئة السوق المالية السعودية',
  'Syrian Commission on financial markets and securities':                   'هيئة الأوراق والأسواق المالية السورية',
  'Iraqi Securities Commission':                                             'هيئة الأوراق المالية العراقية',
  'Financial Services Authority - Oman':                                     'هيئة الخدمات المالية - عُمان',
  'Palestine Capital Market Authority':                                      'هيئة سوق رأس المال الفلسطينية',
  'Qatar Financial Markets Authority':                                       'هيئة قطر للأسواق المالية',
  'Kuwait Capital Markets Authority':                                        'هيئة أسواق المال الكويتية',
  'Capital Markets Authority of Lebanon':                                    'هيئة الأسواق المالية اللبنانية',
  'LIBYAN CAPITAL MARKET AUTHORITY - LIBYA':                                 'هيئة السوق المالية الليبية',
  'Financial Regulatory Authority - Egypt':                                  'الهيئة العامة للرقابة المالية - مصر',
  'Autorité Marocaine du Marché des Capitaux (AMMC)':                        'الهيئة المغربية لسوق الرساميل (AMMC)',
  'Dubai Financial Services Authority':                                      'هيئة دبي للخدمات المالية',
};

export const GENERAL_INFO_OPTIONS = [
  { value: 'gi1', label: 'Stated Goal of Investor Education Program',                                      labelAr: 'الهدف المُعلَن لبرنامج تعليم المستثمرين' },
  { value: 'gi2', label: 'Stated Institutional Support for Investor Education',                            labelAr: 'الدعم المؤسسي المُعلَن لتعليم المستثمرين' },
  { value: 'gi3', label: 'Other authority(ies) in my jurisdiction providing Investor Education',           labelAr: 'هيئات أخرى في نطاق اختصاصي تُقدّم تعليم المستثمرين' },
  { value: 'gi4', label: 'What is New? (New programs, developments, policies etc.)',                       labelAr: 'ما الجديد؟ (برامج ومستجدات وسياسات جديدة...)' },
] as const;

export const EDUCATION_MATERIALS_OPTIONS = [
  { value: 'iem1', label: 'Investing - Basic Materials',                                                   labelAr: 'الاستثمار - مواد أساسية' },
  { value: 'iem2', label: 'Investing - Advanced Materials',                                                labelAr: 'الاستثمار - مواد متقدمة' },
  { value: 'iem3', label: 'Investment and Understanding Risk and Rewards',                                  labelAr: 'الاستثمار وفهم المخاطر والعوائد' },
  { value: 'iem4', label: 'Different Types of Investments',                                                labelAr: 'أنواع الاستثمارات المختلفة' },
  { value: 'iem5', label: 'Calculators / Tools',                                                           labelAr: 'الآلات الحاسبة / الأدوات' },
  { value: 'iem6', label: 'Materials Relating to Scams, Frauds, and/or Alerts to Investors',              labelAr: 'مواد تتعلق بعمليات الاحتيال والتنبيهات للمستثمرين' },
  { value: 'iem7', label: 'Classroom Instruction Materials',                                               labelAr: 'مواد التعليم الصفي' },
  { value: 'iem8', label: 'Complex and/or New Financial Products',                                         labelAr: 'المنتجات المالية المعقدة و/أو الجديدة' },
  { value: 'iem9', label: 'Unique Resources for Investors',                                                labelAr: 'موارد خاصة للمستثمرين' },
] as const;

export const SPECIFIC_MATERIALS_OPTIONS = [
  { value: 'sm1', label: 'Youth (Grade School)',   labelAr: 'الشباب (المرحلة الابتدائية)' },
  { value: 'sm2', label: 'High School',            labelAr: 'المرحلة الثانوية' },
  { value: 'sm3', label: 'Saving for College',     labelAr: 'الادخار للدراسة الجامعية' },
  { value: 'sm4', label: 'College',                labelAr: 'المرحلة الجامعية' },
] as const;

export const ASSISTING_GROUPS_OPTIONS = [
  { value: 'sa1', label: 'Single Young Adults',                                              labelAr: 'الشباب غير المتزوج' },
  { value: 'sa2', label: 'Married Young Adults',                                             labelAr: 'الشباب المتزوج' },
  { value: 'sa3', label: 'Adults with Children',                                             labelAr: 'الكبار الذين لديهم أطفال' },
  { value: 'sa4', label: 'Preparing for Retirement',                                         labelAr: 'الاستعداد للتقاعد' },
  { value: 'sa5', label: 'Retirement',                                                       labelAr: 'التقاعد' },
  { value: 'sa6', label: 'Military',                                                         labelAr: 'العسكريون' },
  { value: 'sa7', label: 'Investors who have "some" experience in investing',                labelAr: 'المستثمرون الذين لديهم "بعض" الخبرة في الاستثمار' },
] as const;

export const EVALUATION_OPTIONS = [
  { value: 'er1', label: 'How do you evaluate investor education initiatives?',              labelAr: 'كيف تُقيّم مبادرات تعليم المستثمرين؟' },
  {
    value: 'er2',
    label: 'How do you determine if the investor education program influences investors in their investment decisions?',
    labelAr: 'كيف تحدد ما إذا كان برنامج تعليم المستثمرين يؤثر على قراراتهم الاستثمارية؟',
  },
] as const;

export const SUCCESSFUL_PROGRAMS_OPTIONS = [
  { value: 'aie1', label: 'Program',            labelAr: 'البرنامج' },
  { value: 'aie2', label: 'Supporting Research', labelAr: 'الأبحاث الداعمة' },
] as const;

export type ProgramMember = (typeof PROGRAM_MEMBERS)[number];

export interface ProgramFilterOption {
  value: string;
  label: string;
  labelAr?: string;
}

export const PROGRAM_FILTER_GROUPS = [
  {
    name: 'generalInfo',
    title: 'General Information:',
    titleAr: 'معلومات عامة:',
    options: GENERAL_INFO_OPTIONS,
  },
  {
    name: 'educationMaterials',
    title: 'Investor Education Materials:',
    titleAr: 'مواد تعليم المستثمرين:',
    options: EDUCATION_MATERIALS_OPTIONS,
  },
  {
    name: 'specificMaterials',
    title: 'Specific Materials, Instruction, and Pedagogy/Methodology for:',
    titleAr: 'المواد والتعليم والمنهجية المحددة لـ:',
    options: SPECIFIC_MATERIALS_OPTIONS,
  },
  {
    name: 'assistingGroups',
    title: 'Specific Materials, Instruction, and Pedagogy for Assisting Certain Groups:',
    titleAr: 'مواد وتعليم ومنهجية خاصة لمساعدة مجموعات معينة:',
    options: ASSISTING_GROUPS_OPTIONS,
  },
  {
    name: 'evaluation',
    title: 'Evaluation and Research:',
    titleAr: 'التقييم والبحوث:',
    options: EVALUATION_OPTIONS,
  },
  {
    name: 'successfulPrograms',
    title: 'Any investor education program that has been proven to be successful in positively impacting investors:',
    titleAr: 'أي برنامج لتعليم المستثمرين ثبتت فاعليته في التأثير الإيجابي على المستثمرين:',
    options: SUCCESSFUL_PROGRAMS_OPTIONS,
  },
] as const;

export function getLabelsFromSelect(select: HTMLSelectElement): string[] {
  return Array.from(select.selectedOptions).map((option) => option.text);
}
