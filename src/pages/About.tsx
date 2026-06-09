import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useSiteContent } from '../lib/useSiteContent';

const FALLBACK_PARAGRAPHS = [
  'Established in 2007, the Union of Arab Securities Authorities (UASA henceforth) is not a profit entity with an independent legal status. The United Arab Emirates is the headquarters of the Union. The Members of the Union are Arab Securities Authorities and markets Regulators.',
  'The UASA aims to improve the legislative and regulatory framework of Arab securities markets with a view to achieving fairness, efficiency and transparency. It also seeks to unify efforts towards achieving effective levels of oversight over transactions in the Arab securities markets and to ensure coordination and cooperation among members to achieve maximum harmony and consistency with regard to relevant laws and regulations applicable in the Member States. The Union also aims to overcome difficulties facing investment in the Arab securities markets, and to expand the investment base, diversify its tools and promote the culture of investing in these markets.',
  "Raising awareness and education of investors in Arab countries, especially those with limited resources, is one of the Union's priorities and a main pillar of its strategic plan 2016 – 2017, and has a particular importance as it enhances investment culture and market efficiency. By setting up this web portal that includes investors' awareness and education initiatives of the Union's members.",
  "Investor education and awareness helps not only to protect investors, but it also contributes to the development of capital markets by enhancing investors' confidence as it complements the work on regulations, supervision and enforcement. Some regulators have used investor education as an important means to increase participation in the capital markets. Normally, regulators play a key role in investor education and in raising investor awareness. However, both public and private sectors could also play a supporting role in this regard.",
];

const HERO_FALLBACK = {
  badge: 'About UASA',
  title: 'The Union Of Arab Securities Authorities: Investor Education & Awareness Portal',
};

export default function About() {
  const { data: hero } = useSiteContent('about.hero', HERO_FALLBACK);
  const [paragraphs, setParagraphs] = useState(FALLBACK_PARAGRAPHS);

  useEffect(() => {
    api
      .get('/about/sections')
      .then((sections) => {
        if (Array.isArray(sections) && sections.length > 0) {
          setParagraphs(sections.map((s: { content: string }) => s.content));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#00285e] to-[#003580] text-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#00285e] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
              {hero.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{hero.title}</h1>
            <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {paragraphs.map((text, index) => (
              <p key={index} className="text-gray-600 text-base sm:text-lg leading-relaxed">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
