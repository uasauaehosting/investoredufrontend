export interface MemberPortal {
  id: number;
  panelTitle: string;
  panelTitleAr?: string;
  displayTitle: string;
  displayTitleAr?: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
}

export const MEMBER_PORTALS: MemberPortal[] = [
  {
    id: 1,
    panelTitle: 'Conseil du Marché Financier - Tunisia',
    panelTitleAr: 'هيئة السوق المالية - تونس',
    displayTitle: 'Conseil du Marché Financier - Tunisia',
    displayTitleAr: 'هيئة السوق المالية - تونس',
    imageUrl: 'http://uasa.ae/en/galorg/30312018123118Tunisia2.png',
    imageAlt: 'Conseil du Marché Financier - Tunisia',
    link: 'https://www.myinvestia.com/',
  },
  {
    id: 2,
    panelTitle: "Commission d'Organisation et de Surveillance des opérations de Bourse",
    panelTitleAr: 'لجنة تنظيم عمليات البورصة ومراقبتها - الجزائر',
    displayTitle: 'COSOB - Algeria',
    displayTitleAr: 'لجنة تنظيم عمليات البورصة ومراقبتها - الجزائر',
    imageUrl: 'http://uasa.ae/en/galorg/30532018125329Algeria.png',
    imageAlt: 'COSOB - Algeria',
    link: 'http://www.cosob.org/guides/',
  },
  {
    id: 3,
    panelTitle: 'Saudi Capital Market Authority',
    panelTitleAr: 'هيئة السوق المالية - السعودية',
    displayTitle: 'Capital Market Authority of Saudi Arabia',
    displayTitleAr: 'هيئة السوق المالية - السعودية',
    imageUrl: 'http://uasa.ae/en/galorg/30542018125450KSA2.png',
    imageAlt: 'Capital Market Authority of Saudi Arabia',
    link: 'https://www.si.org.sa/?lang=en',
  },
  {
    id: 4,
    panelTitle: 'Syrian Commission on financial markets and securities',
    panelTitleAr: 'هيئة الأوراق والأسواق المالية - سوريا',
    displayTitle: 'Syrian Commission on financial markets and securities',
    displayTitleAr: 'هيئة الأوراق والأسواق المالية - سوريا',
    imageUrl: 'http://uasa.ae/en/galorg/30552018125546Syria.png',
    imageAlt: 'Syrian Commission on financial markets and securities',
    link: 'http://scfms.sy/awarenessLetters/ar/37/0/?????-???????',
  },
  {
    id: 5,
    panelTitle: 'Palestine Capital Market Authority',
    panelTitleAr: 'هيئة سوق رأس المال - فلسطين',
    displayTitle: 'Palestine Capital Market Authority - Palestine',
    displayTitleAr: 'هيئة سوق رأس المال - فلسطين',
    imageUrl: 'http://uasa.ae/en/galorg/30572018125706Palestine.png',
    imageAlt: 'Palestine Capital Market Authority - Palestine',
    link: 'http://www.pcma.ps/portal/awareness/SitePages/Home.aspx',
  },
  {
    id: 6,
    panelTitle: 'Qatar Financial Markets Authority',
    panelTitleAr: 'هيئة قطر للأسواق المالية - قطر',
    displayTitle: 'Qatar Financial Markets Authority - Qatar',
    displayTitleAr: 'هيئة قطر للأسواق المالية - قطر',
    imageUrl: 'http://uasa.ae/en/galorg/30592018125923Qatar.png',
    imageAlt: 'Qatar Financial Markets Authority - Qatar',
    link: 'https://www.qfma.org.qa/English/mediacenter/pages/investorawareness.aspx',
  },
  {
    id: 7,
    panelTitle: 'Kuwait Capital Markets Authority',
    panelTitleAr: 'هيئة أسواق المال - الكويت',
    displayTitle: 'Kuwait Capital Markets Authority',
    displayTitleAr: 'هيئة أسواق المال - الكويت',
    imageUrl: 'http://uasa.ae/en/galorg/30042018010402Kuwait.png',
    imageAlt: 'Kuwait Capital Markets Authority',
    link: 'https://www.cma.gov.kw/ar/web/cma/awareness',
  },
  {
    id: 8,
    panelTitle: 'Capital Markets Authority of Lebanon',
    panelTitleAr: 'هيئة الأسواق المالية - لبنان',
    displayTitle: 'Capital Markets Authority of Lebanon',
    displayTitleAr: 'هيئة الأسواق المالية - لبنان',
    imageUrl: 'http://uasa.ae/en/galorg/30272018012743Lebanon.png',
    imageAlt: 'Capital Markets Authority of Lebanon',
    link: 'https://www.cma.gov.lb/investor-education/',
  },
  {
    id: 9,
    panelTitle: 'Financial Regulatory Authority - Egypt',
    panelTitleAr: 'الهيئة العامة للرقابة المالية - مصر',
    displayTitle: 'Financial Regulatory Authority - Egypt',
    displayTitleAr: 'الهيئة العامة للرقابة المالية - مصر',
    imageUrl: 'http://uasa.ae/en/galorg/30432018014338Egypt.png',
    imageAlt: 'Financial Regulatory Authority - Egypt',
    link: 'http://www.iinvest.org.eg/general/index.jsp',
  },
  {
    id: 10,
    panelTitle: 'Autorité Marocaine du Marché des Capitaux (AMMC)',
    panelTitleAr: 'الهيئة المغربية لسوق الرساميل - المغرب',
    displayTitle: 'Autorité Marocaine du Marché des Capitaux - Morocco',
    displayTitleAr: 'الهيئة المغربية لسوق الرساميل - المغرب',
    imageUrl: 'http://uasa.ae/en/galorg/30442018014432Morocco.png',
    imageAlt: 'Autorité Marocaine du Marché des Capitaux - Morocco',
    link: 'http://www.ammc.ma/en/espace-epargnants',
  },
];
