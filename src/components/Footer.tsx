import { Facebook, Twitter, Linkedin, Youtube, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { useSiteContent, useFooterStats } from '../lib/useSiteContent';

const FALLBACK_STATS = [
  { value: '10+', label: 'Member States' },
  { value: '1000+', label: 'Educational Resources' },
  { value: '50+', label: 'Publications' },
  { value: '20+', label: 'Years of Service' },
];

const FALLBACK_FOOTER = {
  educationLinks: ['Investment Basics', 'Types of Investments', 'Investment Risks', 'Market Indices', 'Protecting Against Fraud', 'Savings and Investment'],
  inclusionLinks: ['Financial Literacy', 'Digital Finance', 'Microfinance', 'Women Empowerment', 'Youth Financial Education'],
  usefulLinks: [
    { label: 'UASA Official Website', href: '#' },
    { label: 'IOSCO', href: '#' },
    { label: 'World Federation of Exchanges', href: '#' },
    { label: 'Arab Monetary Fund', href: '#' },
    { label: 'Securities Commission Resources', href: '#' },
  ],
  address: 'Union of Arab Securities Authorities, Abu Dhabi, UAE',
  phone: '+971 2 000 0000',
  email: 'info@uasa.ae',
};

export default function Footer() {
  const { stats } = useFooterStats(FALLBACK_STATS);
  const { data: footer } = useSiteContent('footer', FALLBACK_FOOTER);

  return (
    <footer className="bg-[#00285e] text-white">
      <div className="bg-[#001a45] py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-amber-400">{stat.value}</div>
              <div className="text-xs text-blue-200 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-xs mb-4 pb-2 border-b border-white/10">Investor Education</h4>
            <ul className="space-y-2">
              {footer.educationLinks.map((link: string) => (
                <li key={link}>
                  <a href="#" className="text-blue-200 text-sm hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-amber-400/60 rounded-full" />{link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-xs mb-4 pb-2 border-b border-white/10">Financial Inclusion</h4>
            <ul className="space-y-2">
              {footer.inclusionLinks.map((link: string) => (
                <li key={link}>
                  <a href="#" className="text-blue-200 text-sm hover:text-amber-400 transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-amber-400/60 rounded-full" />{link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-xs mb-4 pb-2 border-b border-white/10">Links</h4>
            <ul className="space-y-2">
              {footer.usefulLinks.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <a href={link.href} className="text-blue-200 text-sm hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                    <ExternalLink size={10} className="text-amber-400/60 flex-shrink-0" />{link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-xs mb-4 pb-2 border-b border-white/10">Address</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2.5 text-sm text-blue-200">
                <MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>{footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-blue-200">
                <Phone size={14} className="text-amber-400 flex-shrink-0" />
                <span>{footer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-blue-200">
                <Mail size={14} className="text-amber-400 flex-shrink-0" />
                <span>{footer.email}</span>
              </li>
            </ul>

            <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-xs mb-3">Follow Us</h4>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 flex items-center justify-center transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-blue-300">
          <p>&copy; {new Date().getFullYear()} Union of Arab Securities Authorities. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
