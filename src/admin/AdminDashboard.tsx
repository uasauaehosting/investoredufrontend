import { useState } from 'react';
import {
  LayoutDashboard, Image, Newspaper, Users, Globe2,
  LogOut, ChevronRight, Menu, X, ExternalLink, BookOpen,
  FileText, Globe, Info, Settings, ClipboardList, BarChart3, Inbox
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
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

type Section =
  | 'overview' | 'slides' | 'news' | 'members' | 'member-portals' | 'education' | 'principles' | 'frameworks'
  | 'investment-products' | 'about' | 'pages' | 'glossary' | 'publications' | 'programs'
  | 'alerts-bulletins' | 'member-strategies-projects' | 'global-policy-areas'
  | 'benchmarking' | 'feedback-inbox';

const navItems: { id: Section; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'overview',      label: 'Overview',              icon: LayoutDashboard, desc: 'Dashboard summary' },
  { id: 'slides',        label: 'Home — Hero Slides',    icon: Image,           desc: 'Homepage carousel (/)' },
  { id: 'news',          label: 'Home — News',           icon: Newspaper,       desc: 'News articles (/news/:id)' },
  { id: 'members',       label: 'Home — Members',        icon: Users,           desc: 'Authority logos on homepage' },
  { id: 'pages',         label: 'Page Content',          icon: Settings,        desc: 'Welcome, footer, framework, index pages...' },
  { id: 'about',         label: 'About',                 icon: Info,            desc: 'About page (/about)' },
  { id: 'education',     label: 'Education Sections',    icon: BookOpen,        desc: 'Section landing pages (/education/:section)' },
  { id: 'principles',    label: 'Principles',            icon: BookOpen,        desc: 'Principles pages (/education/reading-materials/principles)' },
  { id: 'frameworks',    label: 'Framework',             icon: BookOpen,        desc: 'Framework pages (/education/reading-materials/framework)' },
  { id: 'investment-products', label: 'Investment Products', icon: BookOpen, desc: 'Product literature (/education/reading-materials/products)' },
  { id: 'publications',  label: 'Publications',          icon: FileText,        desc: 'Member publications (/education/members-activities/publications)' },
  { id: 'programs',      label: 'Programs',              icon: ClipboardList,   desc: 'Education programs (/education/members-activities/programs)' },
  { id: 'member-portals', label: 'Member Portals',       icon: Globe2,          desc: 'Authority portals (/education/members-activities/portals)' },
  { id: 'alerts-bulletins', label: 'Alerts & Bulletins', icon: FileText,      desc: 'Alerts page (/education/alerts)' },
  { id: 'member-strategies-projects', label: 'Strategies & Projects', icon: ClipboardList, desc: 'Financial inclusion (/inclusion/projects)' },
  { id: 'global-policy-areas', label: 'Global Policy Areas', icon: Globe,     desc: 'Policy resources (/inclusion/policies)' },
  { id: 'benchmarking',  label: "Members' Benchmarking", icon: BarChart3,     desc: 'Benchmarking table (/inclusion/index/benchmarking)' },
  { id: 'glossary',      label: 'Glossary',              icon: Globe,           desc: 'Glossary terms (/glossary)' },
  { id: 'feedback-inbox', label: 'Feedback Inbox',       icon: Inbox,           desc: 'User submissions (/feedback)' },
];

export default function AdminDashboard() {
  const { session, signOut } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (id: Section) => { setSection(id); setSidebarOpen(false); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 start-0 z-30 w-64 bg-[#009900] text-white flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">UASA Admin</p>
              <p className="text-green-200 text-xs mt-0.5">Content Management</p>
            </div>
            <button className="md:hidden text-white/60 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
                section === id
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-green-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={17} className="flex-shrink-0" />
              <div className="flex-1 text-start">
                <p className="leading-none">{label}</p>
                <p className="text-xs opacity-60 mt-0.5">{desc}</p>
              </div>
              {section === id && <ChevronRight size={13} className="flex-shrink-0" />}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-2">
          <a href="/" className="flex items-center gap-2 text-green-200 hover:text-white text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10">
            <ExternalLink size={13} /> View Public Site
          </a>
          <button onClick={signOut} className="w-full flex items-center gap-2 text-green-200 hover:text-red-300 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10">
            <LogOut size={13} /> Sign Out ({session?.username})
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {navItems.find((n) => n.id === section)?.label ?? 'Dashboard'}
              </p>
              <p className="text-gray-400 text-xs">
                {navItems.find((n) => n.id === section)?.desc}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>{session?.email}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {section === 'overview' && <Overview onNavigate={navigate} />}
          {section === 'slides' && <SlidesEditor />}
          {section === 'news' && <NewsEditor />}
          {section === 'members' && <MembersEditor />}
          {section === 'member-portals' && <PortalCategoriesEditor />}
          {section === 'education' && <EducationContentEditor />}
          {section === 'principles' && <PrinciplesEditor />}
          {section === 'frameworks' && <FrameworksEditor />}
          {section === 'investment-products' && <InvestmentProductsEditor />}
          {section === 'about' && <AboutEditor />}
          {section === 'pages' && <SiteContentEditor />}
          {section === 'glossary' && <GlossaryEditor />}
          {section === 'publications' && <PublicationsEditor />}
          {section === 'programs' && <ProgramsEditor />}
          {section === 'alerts-bulletins' && <AlertsBulletinsEditor />}
          {section === 'member-strategies-projects' && <MemberStrategiesProjectsEditor />}
          {section === 'global-policy-areas' && <GlobalPolicyAreasEditor />}
          {section === 'benchmarking' && <BenchmarkingEditor />}
          {section === 'feedback-inbox' && <FeedbackInboxEditor />}
        </main>
      </div>
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const cards = navItems.filter((n) => n.id !== 'overview');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-500 text-sm mt-1">All website content is stored in MySQL and editable from here.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className="group text-start bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-[#009900] text-white rounded-xl mb-3">
              <Icon size={18} />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{label}</p>
            <p className="text-gray-400 text-xs mt-1">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

