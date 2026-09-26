import { Link } from 'react-router-dom';
import { BookOpen, FileText, Layout, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import { EDUCATION_SECTIONS } from '../lib/educationSections';
import { useLanguage } from '../lib/LanguageContext';
import { pickLocalized } from '../lib/localizedText';
import { t } from '../lib/translations';

const sectionCards = [
  { key: 'reading-materials' as const, icon: BookOpen,  color: 'bg-[#009900]' },
  { key: 'members-activities' as const, icon: Layout,   color: 'bg-amber-500' },
  { key: 'alerts' as const,             icon: FileText, color: 'bg-emerald-600' },
];

export default function InvestorEducation() {
  const { lang, isRtl } = useLanguage();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-start" dir={isRtl ? 'rtl' : 'ltr'}>
              <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
                {t(lang, 'education.badge', 'Learning Hub')}
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                {t(lang, 'education.hero.title', 'Empowering Investors Through Education')}
              </h1>
              <p className="text-green-100 text-lg max-w-2xl leading-relaxed">
                {t(lang, 'education.hero.desc', 'Explore a wealth of resources designed to help you navigate Arab capital markets with confidence and clarity.')}
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
        {/* Section cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {sectionCards.map(({ key, icon: Icon, color }) => {
            const section = EDUCATION_SECTIONS[key];
            return (
              <div
                key={key}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#009900] mb-4" dir={isRtl ? 'rtl' : 'ltr'}>
                  {pickLocalized(lang, section.title, section.titleAr)}
                </h3>
                <Link
                  to={section.listPath}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#009900] group-hover:text-amber-600 transition-colors"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {t(lang, 'education.learnMore', 'Learn More')}
                  {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Callout panel */}
        <div className="mt-20 bg-white rounded-[3rem] p-8 sm:p-16 shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 end-0 w-64 h-64 bg-green-50 rounded-full -me-32 -mt-32 opacity-50" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-3 text-amber-600 font-bold text-sm mb-4">
                <Lightbulb size={20} />
                <span>{t(lang, 'education.didYouKnow', 'Did you know?')}</span>
              </div>
              <h2 className="text-3xl font-bold text-[#009900] mb-6 leading-tight">
                {t(lang, 'education.callout.title', 'Education is the Best Investment You Can Make.')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t(lang, 'education.callout.desc', 'The UASA portal centralizes educational efforts from 16+ Arab securities authorities, providing you with a unified reference for investment principles and risk management.')}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  t(lang, 'education.bullet1', 'Multilingual resources in Arabic & English'),
                  t(lang, 'education.bullet2', 'Expert-curated financial frameworks'),
                ].map((text, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <p className="text-sm font-medium text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000"
                alt={t(lang, 'education.badge', 'Investor Education')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
