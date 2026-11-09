import { useState } from 'react';
import {
  LayoutDashboard, Image, Newspaper, Users, Globe2,
  LogOut, ChevronRight, ChevronDown, Menu, X, ExternalLink,
  BookOpen, FileText, Globe, Info, Settings, ClipboardList,
  BarChart3, Inbox, AlertCircle, Home, GraduationCap,
  TrendingUp, Sliders,
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { AdminLangProvider, useAdminLang, type AdminLangMode } from './context/AdminLangContext';
import SlidesEditor from './editors/SlidesEditor';
import NewsEditor from './editors/NewsEditor';
import MembersEditor from './editors/MembersEditor';
import PortalCategoriesEditor from './editors/PortalCategoriesEditor';
import EducationContentEditor from './editors/EducationContentEditor';
import AboutEditor from './editors/AboutEditor';
import SiteContentEditor from './editors/SiteContentEditor';
import GlossaryEditor from './editors/GlossaryEditor';
import PublicationsEditor from './editors/PublicationsEditor';
import ProgramsEditor from './editors/ProgramsEditor';
import PrinciplesEditor from './editors/PrinciplesEditor';
import FrameworksEditor from './editors/FrameworksEditor';
import InvestmentProductsEditor from './editors/InvestmentProductsEditor';
import AlertsBulletinsEditor from './editors/AlertsBulletinsEditor';
import MemberStrategiesProjectsEditor from './editors/MemberStrategiesProjectsEditor';
import GlobalPolicyAreasEditor from './editors/GlobalPolicyAreasEditor';
import BenchmarkingEditor from './editors/BenchmarkingEditor';
import FeedbackInboxEditor from './editors/FeedbackInboxEditor';

// ── Section type ────────────────────────────────────────────────────────────

export type Section =
  | 'overview' | 'slides' | 'news' | 'members' | 'member-portals' | 'education'
  | 'principles' | 'frameworks' | 'investment-products' | 'about' | 'pages'
  | 'glossary' | 'publications' | 'programs' | 'alerts-bulletins'
  | 'member-strategies-projects' | 'global-policy-areas'
  | 'benchmarking' | 'feedback-inbox';

// ── Nav groups ──────────────────────────────────────────────────────────────

interface NavItem {
  id: Section;
  label: string;
  icon: React.ElementType;
  desc: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'homepage',
    label: 'Homepage',
    icon: Home,
    items: [
      { id: 'slides',   label: 'Hero Slides',       icon: Image,       desc: 'Carousel banners (/)' },
      { id: 'news',     label: 'News & Events',      icon: Newspaper,   desc: 'Articles & publications' },
      { id: 'members',  label: 'Member Logos',       icon: Users,       desc: 'Authority logos strip' },
    ],
  },
  {
    id: 'education',
    label: 'Investor Education',
    icon: GraduationCap,
    items: [
      { id: 'about',               label: 'About Page',          icon: Info,          desc: '/about' },
      { id: 'education',           label: 'Education Sections',  icon: BookOpen,      desc: 'Section landing cards' },
      { id: 'principles',          label: 'Principles',          icon: BookOpen,      desc: 'Reading materials' },
      { id: 'frameworks',          label: 'Framework',           icon: BookOpen,      desc: 'IOSCO frameworks' },
      { id: 'investment-products', label: 'Investment Products', icon: BookOpen,      desc: 'Product literature' },
      { id: 'publications',        label: 'Publications',        icon: FileText,      desc: 'Member publications' },
      { id: 'programs',            label: 'Programs',            icon: ClipboardList, desc: 'Education programs' },
      { id: 'member-portals',      label: 'Member Portals',      icon: Globe2,        desc: 'Authority portals' },
      { id: 'alerts-bulletins',    label: 'Alerts & Bulletins',  icon: AlertCircle,   desc: 'Alerts page' },
    ],
  },
  {
    id: 'inclusion',
    label: 'Financial Inclusion',
    icon: TrendingUp,
    items: [
      { id: 'member-strategies-projects', label: 'Strategies & Projects', icon: ClipboardList, desc: '/inclusion/projects' },
      { id: 'global-policy-areas',        label: 'Global Policy Areas',   icon: Globe,         desc: 'OECD, AFI resources' },
      { id: 'benchmarking',               label: "Members' Benchmarking", icon: BarChart3,      desc: 'Benchmarking table' },
    ],
  },
  {
    id: 'settings',
    label: 'Site Settings',
    icon: Sliders,
    items: [
      { id: 'pages',         label: 'Page Content',  icon: Settings, desc: 'Texts, links, footer' },
      { id: 'glossary',      label: 'Glossary',      icon: Globe,    desc: 'Financial terms' },
      { id: 'feedback-inbox', label: 'Feedback Inbox', icon: Inbox,  desc: 'User submissions' },
    ],
  },
];

// Flat map for breadcrumb lookups
const ALL_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

// ── Root export ─────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  return (
    <AdminLangProvider>
      <AdminDashboardInner />
    </AdminLangProvider>
  );
}

// ── Inner shell ─────────────────────────────────────────────────────────────

function AdminDashboardInner() {
  const { session, signOut } = useAuth();
  const { mode, setMode } = useAdminLang();
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // which groups are expanded; all open by default
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(NAV_GROUPS.map((g) => g.id))
  );

  const navigate = (id: Section) => {
    setSection(id);
    setSidebarOpen(false);
  };

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const currentItem = ALL_ITEMS.find((n) => n.id === section);
  const currentGroup = NAV_GROUPS.find((g) => g.items.some((i) => i.id === section));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 start-0 z-30 w-64 bg-[#004d00] text-white flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex-shrink-0
      `}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">UASA Admin</p>
                <p className="text-green-300 text-[10px] mt-0.5">Content Management</p>
              </div>
            </div>
            <button className="md:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Lang toggle inside sidebar */}
        <div className="px-4 py-2.5 border-b border-white/10">
          <p className="text-[10px] text-green-300 uppercase tracking-wider mb-1.5 font-semibold">Content Language</p>
          <AdminLangToggle mode={mode} setMode={setMode} />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {/* Overview */}
          <button
            onClick={() => navigate('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
              section === 'overview'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-green-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <LayoutDashboard size={15} className="flex-shrink-0" />
            <span>Overview</span>
            {section === 'overview' && <ChevronRight size={12} className="ms-auto" />}
          </button>

          {/* Groups */}
          {NAV_GROUPS.map((group) => {
            const isOpen = openGroups.has(group.id);
            const GroupIcon = group.icon;
            return (
              <div key={group.id} className="mt-1">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-300 hover:text-white transition-colors"
                >
                  <GroupIcon size={13} className="flex-shrink-0" />
                  <span className="flex-1 text-start">{group.label}</span>
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>

                {/* Items */}
                {isOpen && (
                  <div className="pb-1">
                    {group.items.map(({ id, label, icon: Icon, desc }) => (
                      <button
                        key={id}
                        onClick={() => navigate(id)}
                        className={`w-full flex items-center gap-2.5 ps-7 pe-4 py-2 text-sm transition-colors group ${
                          section === id
                            ? 'bg-white/15 text-white font-semibold border-s-2 border-green-300'
                            : 'text-green-200 hover:bg-white/8 hover:text-white border-s-2 border-transparent'
                        }`}
                      >
                        <Icon size={14} className="flex-shrink-0 opacity-70" />
                        <div className="flex-1 text-start min-w-0">
                          <p className="text-sm leading-none truncate">{label}</p>
                          <p className="text-[10px] opacity-50 mt-0.5 truncate">{desc}</p>
                        </div>
                        {section === id && <ChevronRight size={11} className="flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-300 hover:text-white text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
          >
            <ExternalLink size={12} /> View Public Site
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 text-green-300 hover:text-red-300 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={12} />
            <span className="truncate">Sign Out ({session?.username})</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span>Admin</span>
                {currentGroup && (
                  <>
                    <ChevronRight size={11} />
                    <span>{currentGroup.label}</span>
                  </>
                )}
                {currentItem && (
                  <>
                    <ChevronRight size={11} />
                    <span className="text-gray-700 font-semibold">{currentItem.label}</span>
                  </>
                )}
                {section === 'overview' && (
                  <>
                    <ChevronRight size={11} />
                    <span className="text-gray-700 font-semibold">Overview</span>
                  </>
                )}
              </div>
              {currentItem?.desc && (
                <p className="text-[10px] text-gray-400 mt-0.5">{currentItem.desc}</p>
              )}
            </div>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="hidden sm:inline truncate max-w-[160px]">{session?.email}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {section === 'overview'                    && <Overview onNavigate={navigate} />}
          {section === 'slides'                      && <SlidesEditor />}
          {section === 'news'                        && <NewsEditor />}
          {section === 'members'                     && <MembersEditor />}
          {section === 'member-portals'              && <PortalCategoriesEditor />}
          {section === 'education'                   && <EducationContentEditor />}
          {section === 'principles'                  && <PrinciplesEditor />}
          {section === 'frameworks'                  && <FrameworksEditor />}
          {section === 'investment-products'         && <InvestmentProductsEditor />}
          {section === 'about'                       && <AboutEditor />}
          {section === 'pages'                       && <SiteContentEditor />}
          {section === 'glossary'                    && <GlossaryEditor />}
          {section === 'publications'                && <PublicationsEditor />}
          {section === 'programs'                    && <ProgramsEditor />}
          {section === 'alerts-bulletins'            && <AlertsBulletinsEditor />}
          {section === 'member-strategies-projects'  && <MemberStrategiesProjectsEditor />}
          {section === 'global-policy-areas'         && <GlobalPolicyAreasEditor />}
          {section === 'benchmarking'                && <BenchmarkingEditor />}
          {section === 'feedback-inbox'              && <FeedbackInboxEditor />}
        </main>
      </div>
    </div>
  );
}

// ── Lang toggle ─────────────────────────────────────────────────────────────

function AdminLangToggle({
  mode,
  setMode,
}: {
  mode: AdminLangMode;
  setMode: (m: AdminLangMode) => void;
}) {
  const options: { value: AdminLangMode; label: string }[] = [
    { value: 'en',   label: 'EN' },
    { value: 'ar',   label: 'AR' },
    { value: 'both', label: 'Both' },
  ];
  return (
    <div className="flex rounded-lg border border-white/20 bg-white/10 overflow-hidden text-xs font-semibold w-full">
      {options.map(({ value, label }, i) => (
        <button
          key={value}
          onClick={() => setMode(value)}
          className={`flex-1 py-1.5 transition-colors ${
            mode === value
              ? 'bg-white/25 text-white'
              : 'text-green-300 hover:text-white hover:bg-white/10'
          } ${i > 0 ? 'border-s border-white/20' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Overview page ────────────────────────────────────────────────────────────

function Overview({ onNavigate }: { onNavigate: (s: Section) => void }) {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#004d00] to-[#009900] rounded-2xl p-6 text-white">
        <p className="text-xs font-semibold text-green-300 uppercase tracking-wider">Welcome back</p>
        <h1 className="text-2xl font-bold mt-1">UASA Admin Dashboard</h1>
        <p className="text-green-200 text-sm mt-2">
          All website content is managed from here. Select any section below to start editing.
        </p>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink size={12} /> View Public Site
        </a>
      </div>

      {/* Groups as quick-launch cards */}
      {NAV_GROUPS.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-3">
              <GroupIcon size={15} className="text-[#009900]" />
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{group.label}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className="group text-start bg-white rounded-xl border border-gray-200 p-4 hover:border-[#009900]/40 hover:shadow-sm transition-all duration-150 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#009900]/10 flex items-center justify-center group-hover:bg-[#009900] transition-colors">
                      <Icon size={15} className="text-[#009900] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
