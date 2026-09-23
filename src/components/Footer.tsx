import { Facebook, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useLocalizedSiteContent } from '../lib/useLocalizedSiteContent';
import { useFooterStats } from '../lib/useSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { pickLocalized } from '../lib/localizedText';
import { t } from '../lib/translations';

const FALLBACK_STATS = [
  { value: '10+', label: 'Member States',        labelAr: 'الدول الأعضاء' },
  { value: '1000+', label: 'Educational Resources', labelAr: 'موارد تعليمية' },
  { value: '50+', label: 'Publications',          labelAr: 'إصدارات' },
  { value: '20+', label: 'Years of Service',       labelAr: 'سنوات من الخدمة' },
];

const FALLBACK_FOOTER = {
  educationLinks: ['Investment Basics', 'Types of Investments', 'Investment Risks', 'Market Indices', 'Protecting Against Fraud', 'Savings and Investment'],
  educationLinksAr: ['المبادئ', 'إصدارات', 'التنبيهات والنشرات', 'مواد علمية / المنتجات الاستثمارية', 'برامج', 'بوابات توعية وتعليم المستثمرين'],
  inclusionLinks: ['Financial Literacy', 'Digital Finance', 'Microfinance', 'Women Empowerment', 'Youth Financial Education'],
  inclusionLinksAr: ['استراتيجيات وبرامج الأعضاء', 'السياسات الدولية', 'مؤشر الشمول المالي', 'تقييم أعضاء الاتحاد', 'مواد إضافية'],
  usefulLinks: [
    { label: 'UASA Official Website', href: '#' },
    { label: 'IOSCO', href: '#' },
    { label: 'World Federation of Exchanges', href: '#' },
    { label: 'Arab Monetary Fund', href: '#' },
    { label: 'Securities Commission Resources', href: '#' },
  ],
  address: 'Union of Arab Securities Authorities, Abu Dhabi, UAE',
  addressAr: 'الراشدية، أم الرمول دبي، صندوق بريد 117555 دبي، إ.ع.م',
  phone: '+971 4 290 0000',
  email: 'info@uasa.ae',
};

export default function Footer() {
  const { lang, isRtl } = useLanguage();
  const { stats } = useFooterStats(FALLBACK_STATS);
  const { data: footer } = useLocalizedSiteContent(
    'footer',
    FALLBACK_FOOTER,
    ['address', 'phone', 'email'],
    ['educationLinks', 'inclusionLinks'],
  );

  // Resolve Arabic-aware link arrays from the footer data
  const educationLinks: string[] = lang === 'ar' && Array.isArray(footer.educationLinksAr) && (footer.educationLinksAr as string[]).length
    ? (footer.educationLinksAr as string[])
    : (footer.educationLinks as string[]);

  const inclusionLinks: string[] = lang === 'ar' && Array.isArray(footer.inclusionLinksAr) && (footer.inclusionLinksAr as string[]).length
    ? (footer.inclusionLinksAr as string[])
    : (footer.inclusionLinks as string[]);

  const addressDisplay = lang === 'ar' && (footer.addressAr as string | undefined)?.trim()
    ? (footer.addressAr as string)
    : (footer.address as string);

  return (
    <footer className="bg-[#c8e6c9] text-black border-t border-[#009900]/25">
      <div className="bg-[#006600] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white mt-0.5">
                {pickLocalized(lang, stat.label, (stat as { labelAr?: string }).labelAr)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Investor Education */}
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-4 pb-2 border-b border-black/15">
              {t(lang, 'footer.investorEducation', 'Investor Education')}
            </h4>
            <ul className="space-y-2">
              {educationLinks.map((link: string) => (
                <li key={link}>
                  <a href="#" className="text-black text-sm hover:opacity-70 transition-opacity flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-black/50 rounded-full" />{link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Financial Inclusion */}
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-4 pb-2 border-b border-black/15">
              {t(lang, 'footer.financialInclusion', 'Financial Inclusion')}
            </h4>
            <ul className="space-y-2">
              {inclusionLinks.map((link: string) => (
                <li key={link}>
                  <a href="#" className="text-black text-sm hover:opacity-70 transition-opacity flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-black/50 rounded-full" />{link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-4 pb-2 border-b border-black/15">
              {t(lang, 'footer.links', 'Links')}
            </h4>
            <ul className="space-y-2">
              {(footer.usefulLinks as { label: string; href: string }[]).map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-black text-sm hover:opacity-70 transition-opacity flex items-center gap-1.5 group">
                    <ExternalLink size={10} className="text-black/50 flex-shrink-0" />{link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Address */}
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-4 pb-2 border-b border-black/15">
              {t(lang, 'footer.address', 'Address')}
            </h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2.5 text-sm text-black">
                <MapPin size={14} className="text-black mt-0.5 flex-shrink-0" />
                <span>{addressDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-black">
                <Phone size={14} className="text-black flex-shrink-0" />
                <span>{footer.phone as string}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-black">
                <Mail size={14} className="text-black flex-shrink-0" />
                <span>{footer.email as string}</span>
              </li>
            </ul>

            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-3">
              {t(lang, 'footer.followUs', 'Follow Us')}
            </h4>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-8 h-8 rounded-full bg-black/10 text-black hover:bg-black hover:text-white flex items-center justify-center transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-black/15 bg-[#a5d6a7]/50 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-black">
          <p>
            {isRtl
              ? `حقوق النسخ © ${new Date().getFullYear()} اتحاد هيئات الأوراق المالية العربية. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Union of Arab Securities Authorities. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:opacity-70 transition-opacity">
              {t(lang, 'footer.privacy', 'Privacy Policy')}
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              {t(lang, 'footer.terms', 'Terms of Use')}
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              {t(lang, 'footer.sitemap', 'Sitemap')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
