import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle2, Target } from 'lucide-react';
import { useSiteContent } from '../lib/useSiteContent';

const FALLBACK = {
  introParagraphs: [
    'Investor education plays a vital role in helping individuals make informed financial decisions, understand investment opportunities, and manage financial risks effectively. Through comprehensive educational resources, investors can develop the knowledge and skills needed to participate confidently in financial markets.',
    'This section provides access to key principles, frameworks, and guidance documents that support investor awareness and financial literacy initiatives. The objective is to empower investors with the information necessary to evaluate investment products, understand market dynamics, and protect themselves from potential financial risks.',
  ],
  objectives: [
    'Promote financial literacy among investors.',
    'Improve understanding of investment products and services.',
    'Encourage informed decision-making.',
    'Enhance investor protection and awareness.',
    'Support responsible participation in financial markets.',
  ],
  benefits: [
    'Better understanding of financial products.',
    'Improved risk assessment capabilities.',
    'Enhanced confidence in investment decisions.',
    'Increased awareness of investor rights and responsibilities.',
    'Greater ability to identify fraudulent schemes and financial scams.',
  ],
};

export default function Principles() {
  const { data } = useSiteContent('principles', FALLBACK);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#00285e] to-[#003580] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/education/reading-materials" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Reading Materials
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#00285e] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Reading Materials</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Principles</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#00285e] mb-8">Principles of Investor Education</h2>
          <div className="max-w-4xl space-y-6">
            {data.introParagraphs.map((text, index) => (
              <p key={index} className="text-gray-600 text-base sm:text-lg leading-relaxed">{text}</p>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Target size={24} /></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#00285e]">Objectives</h2>
            </div>
            <ul className="space-y-4">
              {data.objectives.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><CheckCircle2 size={24} /></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#00285e]">Benefits for Investors</h2>
            </div>
            <ul className="space-y-4">
              {data.benefits.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
