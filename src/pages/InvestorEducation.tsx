import { Link } from 'react-router-dom';
import { BookOpen, FileText, Layout, ArrowRight, Lightbulb } from 'lucide-react';
import { EDUCATION_SECTIONS } from '../lib/educationSections';

const sectionCards = [
  {
    key: 'reading-materials' as const,
    icon: BookOpen,
    color: 'bg-[#009900]',
  },
  {
    key: 'members-activities' as const,
    icon: Layout,
    color: 'bg-amber-500',
  },
  {
    key: 'alerts' as const,
    icon: FileText,
    color: 'bg-emerald-600',
  },
];

export default function InvestorEducation() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-start">
              <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
                Learning Hub
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                Empowering Investors Through Education
              </h1>
              <p className="text-green-100 text-lg max-w-2xl leading-relaxed">
                Explore a wealth of resources designed to help you navigate Arab capital markets with confidence and clarity.
              </p>
            </div>
            <div className="hidden lg:block w-96 h-96 relative">
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse" />
              <div className="absolute inset-8 bg-white/10 rounded-full animate-pulse delay-75" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen size={120} className="text-amber-400 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {sectionCards.map(({ key, icon: Icon, color }) => {
            const section = EDUCATION_SECTIONS[key];
            return (
              <div
                key={key}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#009900] mb-4">{section.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">{section.description}</p>
                <Link
                  to={section.listPath}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#009900] group-hover:text-amber-600 transition-colors"
                >
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-white rounded-[3rem] p-8 sm:p-16 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 end-0 w-64 h-64 bg-green-50 rounded-full -me-32 -mt-32 opacity-50" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 text-amber-600 font-bold text-sm mb-4">
                <Lightbulb size={20} />
                <span>Did you know?</span>
              </div>
              <h2 className="text-3xl font-bold text-[#009900] mb-6 leading-tight">
                Education is the Best Investment You Can Make.
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                The UASA portal centralizes educational efforts from 16+ Arab securities authorities, providing you with a unified reference for investment principles and risk management.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <p className="text-sm font-medium text-gray-700">Multilingual resources in Arabic & English</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <p className="text-sm font-medium text-gray-700">Expert-curated financial frameworks</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
                alt="Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
