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

export type AlertBulletinYear = (typeof ALERT_BULLETIN_YEARS)[number];
export type AlertBulletinAuthority = (typeof ALERT_BULLETIN_AUTHORITIES)[number];

export const ALERT_BULLETIN_TYPES = ['Alert', 'Bulletin'] as const;
export type AlertBulletinType = (typeof ALERT_BULLETIN_TYPES)[number];
