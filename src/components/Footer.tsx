import { Facebook, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, Printer } from 'lucide-react';
import { useLocalizedSiteContent } from '../lib/useLocalizedSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';

const FALLBACK_FOOTER = {
  educationLinks: ['Reading Materials', "Members' Activities", 'Alerts & Bulletins'],
  educationLinksAr: ['مواد القراءة', 'أنشطة الأعضاء', 'التنبيهات والنشرات'],
  inclusionLinks: ["Members Strategies & Projects", 'Global Policy Areas', 'Financial Inclusion Index'],
  inclusionLinksAr: ['استراتيجيات وبرامج الأعضاء', 'السياسات الدولية', 'مؤشر الشمول المالي'],
  usefulLinks: [
    { label: 'About Us',   labelAr: 'من نحن',      href: '/about' },
    { label: 'Glossary',   labelAr: 'المسرد',       href: '/glossary' },
    { label: 'Feedback',   labelAr: 'التغذية الراجعة', href: '/feedback' },
  ],
  address: 'Al Rashidiya, Umm Ramoul, Dubai',
  addressAr: 'الراشدية، أم الرمول دبي',
  poBox: 'P.O. Box 117555, Dubai, UAE',
  poBoxAr: 'صندوق بريد: 117555 دبي، إ.ع.م',
  phone: '+971 4 290 0000',
  phoneDirect: '+971 4 290 0056',
  fax: '+971 4 290 0059',
  email: 'info@uasa.ae',
};

export default function Footer() {
  const { lang, isRtl, prefixPath } = useLanguage();
  const { data: footer } = useLocalizedSiteContent(
    'footer',
    FALLBACK_FOOTER,
    ['address', 'addressAr', 'poBox', 'poBoxAr', 'phone', 'phoneDirect', 'fax', 'email'],
    ['educationLinks', 'inclusionLinks'],
  );

  // Resolve Arabic-aware link arrays from the footer data.
  // useSiteContent merges CMS data over fallback with spread, which can overwrite
  // the *Ar arrays. Always fall back to FALLBACK_FOOTER when the CMS version is empty.
  const educationLinks: string[] =
    lang === 'ar'
      ? (
          (Array.isArray(footer.educationLinksAr) && (footer.educationLinksAr as string[]).length
            ? (footer.educationLinksAr as string[])
            : null) ??
          FALLBACK_FOOTER.educationLinksAr
        )
      : (footer.educationLinks as string[]);

  const inclusionLinks: string[] =
    lang === 'ar'
      ? (
          (Array.isArray(footer.inclusionLinksAr) && (footer.inclusionLinksAr as string[]).length
            ? (footer.inclusionLinksAr as string[])
            : null) ??
          FALLBACK_FOOTER.inclusionLinksAr
        )
      : (footer.inclusionLinks as string[]);

  const addressDisplay = lang === 'ar'
    ? ((footer.addressAr as string | undefined)?.trim() || FALLBACK_FOOTER.addressAr)
    : (footer.address as string);

  const poBoxDisplay = lang === 'ar'
    ? ((footer.poBoxAr as string | undefined)?.trim() || FALLBACK_FOOTER.poBoxAr)
    : (footer.poBox as string);

  return (
    <footer className="bg-[#c8e6c9] text-black border-t border-[#009900]/25">
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
              {(footer.usefulLinks as { label: string; labelAr?: string; href: string }[]).map((link, i) => {
                // When CMS overwrites usefulLinks it drops labelAr — restore from FALLBACK by index
                const fallbackLabelAr = FALLBACK_FOOTER.usefulLinks[i]?.labelAr;
                const label = lang === 'ar'
                  ? (link.labelAr || fallbackLabelAr || link.label)
                  : link.label;
                return (
                  <li key={link.label}>
                    <a
                      href={prefixPath(link.href)}
                      className="text-black text-sm hover:opacity-70 transition-opacity flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 bg-black/50 rounded-full" />{label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact / Address */}
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-4 pb-2 border-b border-black/15">
              {t(lang, 'footer.address', 'Contact Information')}
            </h4>
            <ul className="space-y-2.5 mb-6 text-sm text-black">

              {/* Address */}
              <li className={`flex items-start gap-2 w-full ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-black/70" />
                <span dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : ''}>
                  <span className="font-medium">{isRtl ? 'العنوان:' : 'Address:'}</span>{' '}
                  <span dir="auto">{addressDisplay}</span>
                </span>
              </li>

              {/* PO Box */}
              <li className={`flex items-start gap-2 w-full ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                <MapPin size={13} className="mt-0.5 flex-shrink-0 opacity-0" aria-hidden />
                <span dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : ''}>{poBoxDisplay}</span>
              </li>

              {/* Phone */}
              <li className={`flex items-start gap-2 w-full ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                <Phone size={13} className="mt-0.5 flex-shrink-0 text-black/70" />
                <span dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : ''}>
                  <span className="font-medium">{isRtl ? 'هاتف:' : 'Tel:'}</span>{' '}
                  <span dir="ltr" className="inline-block">{footer.phone as string}</span>
                </span>
              </li>

              {/* Direct */}
              <li className={`flex items-start gap-2 w-full ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                <Phone size={13} className="mt-0.5 flex-shrink-0 opacity-0" aria-hidden />
                <span dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : ''}>
                  <span className="font-medium">{isRtl ? 'مباشر:' : 'Direct:'}</span>{' '}
                  <span dir="ltr" className="inline-block">{footer.phoneDirect as string}</span>
                </span>
              </li>

              {/* Fax */}
              <li className={`flex items-start gap-2 w-full ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                <Printer size={13} className="mt-0.5 flex-shrink-0 text-black/70" />
                <span dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : ''}>
                  <span className="font-medium">{isRtl ? 'فاكس:' : 'Fax:'}</span>{' '}
                  <span dir="ltr" className="inline-block">{footer.fax as string}</span>
                </span>
              </li>

              {/* Email */}
              <li className={`flex items-start gap-2 w-full ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
                <Mail size={13} className="mt-0.5 flex-shrink-0 text-black/70" />
                <span dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'text-right' : ''}>
                  <span className="font-medium">{isRtl ? 'البريد الإلكتروني:' : 'Email:'}</span>{' '}
                  <span dir="ltr" className="inline-block">{footer.email as string}</span>
                </span>
              </li>

            </ul>

            <h4 className="font-semibold text-black uppercase tracking-wider text-xs mb-3">
              {t(lang, 'footer.followUs', 'Follow Us')}
            </h4>
            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse justify-end' : ''}`}>
              {[
                { Icon: Facebook, label: 'Facebook',  href: 'https://www.facebook.com/uasa.ae' },
                { Icon: Twitter,  label: 'Twitter',   href: 'https://twitter.com/uasa_ae' },
                { Icon: Linkedin, label: 'LinkedIn',  href: 'https://www.linkedin.com/company/uasa-ae' },
                { Icon: Youtube,  label: 'YouTube',   href: 'https://www.youtube.com/@uasa_ae' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-black/10 text-black hover:bg-black hover:text-white flex items-center justify-center transition-colors"
                >
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
            <a href={prefixPath('/privacy-policy')} className="hover:opacity-70 transition-opacity">
              {t(lang, 'footer.privacy', 'Privacy Policy')}
            </a>
            <a href={prefixPath('/terms-of-use')} className="hover:opacity-70 transition-opacity">
              {t(lang, 'footer.terms', 'Terms of Use')}
            </a>
            <a href={prefixPath('/sitemap')} className="hover:opacity-70 transition-opacity">
              {t(lang, 'footer.sitemap', 'Sitemap')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
