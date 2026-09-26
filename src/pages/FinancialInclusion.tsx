import { Link } from 'react-router-dom';
import { Target, Globe2, BarChart3, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';

export default function FinancialInclusion() {
  const { lang, isRtl } = useLanguage();

  const cards = [
    {
      titleKey:   'inclusion.strategies',
      titleEn:    'Strategies & Projects',
      descKey:    'inclusion.strategiesDesc',
      descEn:     'Regional initiatives aimed at broadening financial access and digital transformation.',
      Icon:       Target,
      link:       '/inclusion/projects',
    },
    {
      titleKey:   'inclusion.globalPolicy',
      titleEn:    'Global Policy Areas',
      descKey:    'inclusion.globalPolicyDesc',
      descEn:     'Aligning Arab markets with G20 and OECD financial inclusion standards.',
      Icon:       Globe2,
      link:       '/inclusion/policies',
    },
    {
      titleKey:   'inclusion.benchmarking',
      titleEn:    'Benchmarking Index',
      descKey:    'inclusion.benchmarkingDesc',
      descEn:     'Monitoring progress through the UASA Financial Inclusion Index.',
      Icon:       BarChart3,
      link:       '/inclusion/index',
    },
  ];

  const bullets = [
    { key: 'inclusion.point1', en: 'Promoting financial literacy for youth and women' },
    { key: 'inclusion.point2', en: 'Supporting FinTech startups and digital payment systems' },
    { key: 'inclusion.point3', en: 'Establishing consumer protection frameworks' },
    { key: 'inclusion.point4', en: 'Regional benchmarking and data-driven policy making' },
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#009900]/10 rounded-full blur-3xl -me-64 -mt-64" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl" dir={isRtl ? 'rtl' : 'ltr'}>
            <h1 className="text-4xl sm:text-6xl font-bold mb-8 leading-tight">
              {t(lang, 'inclusion.subtitle', 'Driving Financial Inclusion in the Arab World')}
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              {t(lang, 'inclusion.desc', 'Advancing accessible, sustainable, and responsible financial services for all segments of society across UASA member states.')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        {/* Feature cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 group">
              <div className="w-14 h-14 bg-green-50 text-[#009900] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#009900] group-hover:text-white transition-all duration-300">
                <card.Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4" dir={isRtl ? 'rtl' : 'ltr'}>
                {t(lang, card.titleKey, card.titleEn)}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8" dir={isRtl ? 'rtl' : 'ltr'}>
                {t(lang, card.descKey, card.descEn)}
              </p>
              <Link
                to={card.link}
                className="flex items-center gap-2 text-sm font-bold text-[#009900] hover:text-amber-600 transition-colors"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {t(lang, 'inclusion.viewDetails', 'View Details')}
                {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
            </div>
          ))}
        </div>

        {/* Split section */}
        <div className="mt-24 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-amber-400 rounded-3xl rotate-3" />
            <img
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000"
              alt={t(lang, 'inclusion.bridgingTitle', 'Digital Finance')}
              className="relative rounded-3xl shadow-2xl w-full object-cover aspect-video"
            />
          </div>
          <div dir={isRtl ? 'rtl' : 'ltr'}>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
              {t(lang, 'inclusion.bridgingTitle', 'Bridging the Gap Through Innovation')}
            </h2>
            <div className="space-y-6">
              {bullets.map((bullet, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-slate-600 font-medium">{t(lang, bullet.key, bullet.en)}</p>
                </div>
              ))}
            </div>
            <button className="mt-10 bg-[#009900] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#006600] transition-all">
              {t(lang, 'inclusion.downloadReport', 'Download Regional Report')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
