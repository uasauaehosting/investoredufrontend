import { TrendingUp, Shield, Globe } from 'lucide-react';
import { useSiteContent } from '../lib/useSiteContent';

const ICON_MAP = { TrendingUp, Shield, Globe } as const;

const FALLBACK = {
  badge: 'Welcome',
  title: 'Welcome to the UASA Investor Education Portal',
  paragraphs: [
    'The Union of Arab Securities Authorities (UASA) Investor Education Portal is your gateway to financial knowledge and empowerment. Our mission is to build a financially literate society across the Arab world by providing accessible, accurate, and comprehensive investment education resources.',
    'Whether you are a first-time investor or an experienced market participant, our portal offers tools, guides, and resources to help you make informed financial decisions and navigate Arab capital markets with confidence.',
  ],
  ctaText: 'Explore the Portal',
  ctaHref: '#',
  highlights: [
    { icon: 'TrendingUp', title: 'Smart Investing', description: 'Learn evidence-based strategies to grow your wealth and achieve your financial goals.' },
    { icon: 'Shield', title: 'Investor Protection', description: 'Understand your rights and how to protect yourself from fraud and financial misconduct.' },
    { icon: 'Globe', title: 'Arab Capital Markets', description: 'Explore opportunities across Arab financial markets with informed confidence.' },
  ],
};

export default function WelcomeSection() {
  const { data } = useSiteContent('home.welcome', FALLBACK);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-amber-500 rounded" />
              <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">{data.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#009900] leading-tight mb-5">{data.title}</h1>
            {data.paragraphs.map((p, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">{p}</p>
            ))}
            <a
              href={data.ctaHref}
              className="inline-block bg-[#009900] hover:bg-[#006600] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              {data.ctaText}
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.highlights.map((item) => {
              const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP] ?? TrendingUp;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-50 transition-colors group border border-transparent hover:border-green-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#009900] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 transition-colors shadow-sm">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#009900] text-sm mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
