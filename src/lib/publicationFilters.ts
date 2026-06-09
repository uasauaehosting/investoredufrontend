export const PUBLICATION_AUTHORITIES = [
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

export const PUBLICATION_CATEGORIES = [
  'Brochure',
  'Code',
  'General',
  'Guide',
  'Others',
  'Report',
  'Study',
] as const;

export type PublicationAuthority = (typeof PUBLICATION_AUTHORITIES)[number];
export type PublicationCategory = (typeof PUBLICATION_CATEGORIES)[number];
