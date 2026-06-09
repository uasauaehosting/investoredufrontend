import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, Globe, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface NavChild {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface NavItem {
  label: string;
  href?: string;
  pathPrefix?: string;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Investor Education',
    pathPrefix: '/education',
    children: [
      {
        label: 'Reading Materials',
        href: '/education/reading-materials',
        children: [
          { label: 'Principles', href: '/education/reading-materials/principles' },
          { label: 'Framework', href: '/education/reading-materials/framework' },
          { label: 'Investment Products', href: '/education/reading-materials/products' },
        ],
      },
      {
        label: "Members' Activities",
        href: '/education/members-activities',
        children: [
          { label: 'Publications', href: '/education/members-activities/publications' },
          { label: 'Programs', href: '/education/members-activities/programs' },
          { label: 'Portals', href: '/education/members-activities/portals' },
        ],
      },
      {
        label: 'Alerts & Bulletins',
        href: '/education/alerts',
      },
    ],
  },
  {
    label: 'Financial Inclusion',
    pathPrefix: '/inclusion',
    children: [
      { label: "Members Strategies", href: '/inclusion/projects' },
      { label: 'Global Policy Areas', href: '/inclusion/policies' },
      {
        label: 'Financial Inclusion Index',
        href: '/inclusion/index',
        children: [
          { label: 'The Index', href: '/inclusion/index/the-index' },
          { label: "Members' Benchmarking", href: '/inclusion/index/benchmarking' },
          { label: 'Additional Resources', href: '/inclusion/index/resources' },
        ],
      },
    ],
  },
  { label: 'Glossary', href: '/glossary' },
  { label: 'Feedback', href: '/feedback' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const { lang, toggleLang } = useLanguage();
  const location = useLocation();

  const toggleMobileExpand = (key: string) => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getActivePath = (item: NavItem) => item.pathPrefix ?? item.href ?? '/';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Top utility bar */}
      <div className="bg-[#009900] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <span className="hidden sm:block font-light tracking-wide text-green-200">
            Union of Arab Securities Authorities — Investor Education Portal
          </span>
          <div className="flex items-center gap-4 ms-auto">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors font-medium"
            >
              <Globe size={12} />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <div className="flex items-center gap-2.5">
              <a href="#" aria-label="Facebook" className="text-green-200 hover:text-amber-400 transition-colors">
                <Facebook size={13} />
              </a>
              <a href="#" aria-label="Twitter" className="text-green-200 hover:text-amber-400 transition-colors">
                <Twitter size={13} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-green-200 hover:text-amber-400 transition-colors">
                <Linkedin size={13} />
              </a>
              <a href="#" aria-label="YouTube" className="text-green-200 hover:text-amber-400 transition-colors">
                <Youtube size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Logo & search bar */}
      <div className="bg-white py-3 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/img/logo.png"
              alt="UASA Investor Education Portal"
              className="h-14 sm:h-16 object-contain"
            />
            <div className="hidden lg:block h-12 w-px bg-gray-200" />
            <div className="hidden lg:block">
              <p className="text-[#009900] font-bold text-sm leading-tight">UASA</p>
              <p className="text-gray-500 text-xs leading-tight">Investor Education Portal</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-full px-4 py-2 text-sm pe-9 focus:outline-none focus:ring-2 focus:ring-[#009900]/30 focus:border-[#009900] w-48 lg:w-64"
              />
              <Search size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav className="bg-[#009900] text-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden md:flex items-center">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.children ? (
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3.5 py-3.5 text-sm font-medium hover:bg-[#006600] transition-colors whitespace-nowrap border-b-2 ${
                      isActive(getActivePath(item)) ? 'border-amber-400 bg-[#006600]' : 'border-transparent'
                    } ${
                      openDropdown === item.label ? 'bg-[#006600] border-amber-400' : ''
                    }`}
                  >
                    {item.label}
                    <ChevronDown size={11} className="mt-0.5 flex-shrink-0" />
                  </button>
                ) : (
                  <Link
                    to={item.href!}
                    className={`flex items-center gap-1 px-3.5 py-3.5 text-sm font-medium hover:bg-[#006600] transition-colors whitespace-nowrap border-b-2 ${
                      isActive(getActivePath(item)) ? 'border-amber-400 bg-[#006600]' : 'border-transparent'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                {/* Mega-menu dropdown */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full start-0 z-50 bg-white text-gray-700 shadow-2xl rounded-b-lg border-t-2 border-amber-500 min-w-max">
                    {/* Items with sub-children → side-by-side columns */}
                    {item.children.some((c) => c.children) ? (
                      <div className="flex divide-x divide-gray-100 rtl:divide-x-reverse">
                        {item.children.map((child) => (
                          <div key={child.label} className="min-w-44 py-3">
                            <Link
                              to={child.href}
                              className="block px-5 py-2 text-xs font-bold text-[#009900] uppercase tracking-wider hover:text-amber-600 transition-colors"
                            >
                              {child.label}
                            </Link>
                            {child.children && (
                              <ul className="mt-1">
                                {child.children.map((sub) => (
                                  <li key={sub.label}>
                                    <Link
                                      to={sub.href}
                                      className="flex items-center gap-2 px-5 py-2 text-sm text-gray-600 hover:bg-green-50 hover:text-[#009900] transition-colors"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Simple list for items without sub-children */
                      <ul className="py-2 min-w-52">
                        {item.children.map((child, i) => (
                          <li key={child.label}>
                            <Link
                              to={child.href}
                              className={`block px-5 py-2.5 text-sm hover:bg-green-50 hover:text-[#009900] transition-colors ${
                                i < item.children!.length - 1 ? 'border-b border-gray-100' : ''
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex justify-between items-center py-3">
            <span className="text-sm font-semibold tracking-wide">Navigation</span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 rounded hover:bg-[#006600] transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#006600] border-t border-green-700/40">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-green-800/30">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileExpand(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm hover:text-amber-400 transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${mobileExpanded[item.label] ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileExpanded[item.label] && (
                      <div className="bg-[#009900]/60 pb-1">
                        {item.children.map((child) => (
                          <div key={child.label}>
                            {child.children ? (
                              <>
                                <button
                                  onClick={() => toggleMobileExpand(`${item.label}:${child.label}`)}
                                  className="w-full flex items-center justify-between ps-8 pe-4 py-2.5 text-sm text-green-200 hover:text-amber-400 transition-colors"
                                >
                                  <span>{child.label}</span>
                                  <ChevronDown
                                    size={12}
                                    className={`transition-transform ${
                                      mobileExpanded[`${item.label}:${child.label}`] ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                                {mobileExpanded[`${item.label}:${child.label}`] && (
                                  <div className="bg-black/20 pb-1">
                                    {child.children.map((sub) => (
                                      <a
                                        key={sub.label}
                                        href={sub.href}
                                        className="flex items-center gap-2 ps-12 pe-4 py-2 text-xs text-green-300 hover:text-amber-400 transition-colors"
                                        onClick={() => setMobileOpen(false)}
                                      >
                                        <span className="w-1 h-1 rounded-full bg-amber-400/60 flex-shrink-0" />
                                        {sub.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <a
                                href={child.href}
                                className="block ps-8 pe-4 py-2.5 text-sm text-green-200 hover:text-amber-400 transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="block px-4 py-3 text-sm hover:text-amber-400 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
