export const ALERT_BULLETIN_YEARS = [
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
] as const;

export const ALERT_BULLETIN_AUTHORITIES = [
  'Jordan Securities Commission',
  'Capital Market Authority',
  "Commission d'Organisation et de Surveillance des opérations de Bourse",
  'Saudi Capital Market Authority',
  'Syrian Commission on financial markets and securities',
  'Iraqi Securities Commission',
  'Financial Services Authority - Oman',
  'Palestine Capital Market Authority',
  'Qatar Financial Markets Authority',
  'Kuwait Capital Markets Authority',
  'Capital Markets Authority of Lebanon',
  'Financial Regulatory Authority - Egypt',
  'Autorité Marocaine du Marché des Capitaux (AMMC)',
  'Conseil du Marché Financier - Tunisia',
  'LIBYAN CAPITAL MARKET AUTHORITY - LIBYA',
  'Dubai Financial Services Authority',
] as const;

/** Arabic display names for ALERT_BULLETIN_AUTHORITIES (keyed by English value). */
export const ALERT_BULLETIN_AUTHORITIES_AR: Record<string, string> = {
  'Jordan Securities Commission':                                            'هيئة الأوراق المالية الأردنية',
  'Capital Market Authority':                                                'هيئة أسواق المال',
  "Commission d'Organisation et de Surveillance des opérations de Bourse":  'لجنة تنظيم ومراقبة عمليات البورصة',
  'Saudi Capital Market Authority':                                          'هيئة السوق المالية السعودية',
  'Syrian Commission on financial markets and securities':                   'هيئة الأوراق والأسواق المالية السورية',
  'Iraqi Securities Commission':                                             'هيئة الأوراق المالية العراقية',
  'Financial Services Authority - Oman':                                     'هيئة الخدمات المالية - عُمان',
  'Palestine Capital Market Authority':                                      'هيئة سوق رأس المال الفلسطينية',
  'Qatar Financial Markets Authority':                                       'هيئة قطر للأسواق المالية',
  'Kuwait Capital Markets Authority':                                        'هيئة أسواق المال الكويتية',
  'Capital Markets Authority of Lebanon':                                    'هيئة الأسواق المالية اللبنانية',
  'Financial Regulatory Authority - Egypt':                                  'الهيئة العامة للرقابة المالية - مصر',
  'Autorité Marocaine du Marché des Capitaux (AMMC)':                        'الهيئة المغربية لسوق الرساميل (AMMC)',
  'Conseil du Marché Financier - Tunisia':                                   'مجلس السوق المالية - تونس',
  'LIBYAN CAPITAL MARKET AUTHORITY - LIBYA':                                 'هيئة السوق المالية الليبية',
  'Dubai Financial Services Authority':                                      'هيئة دبي للخدمات المالية',
};

export type AlertBulletinYear = (typeof ALERT_BULLETIN_YEARS)[number];
export type AlertBulletinAuthority = (typeof ALERT_BULLETIN_AUTHORITIES)[number];

export const ALERT_BULLETIN_TYPES = ['Alert', 'Bulletin'] as const;
export type AlertBulletinType = (typeof ALERT_BULLETIN_TYPES)[number];
