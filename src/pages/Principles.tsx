import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Target } from 'lucide-react';
import { useSiteContent } from '../lib/useSiteContent';
import { api } from '../lib/api';
import { Principle, principleDetailPath } from '../lib/principles';

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

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?auto=format&fit=crop&q=80&w=800';

function PrincipleCard({ item }: { item: Principle }) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || FALLBACK_IMAGE);

  return (
    <Link
      to={principleDetailPath(item.id)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#009900] mb-3 group-hover:text-green-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{item.description}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#009900] mt-5 group-hover:text-amber-600 transition-colors">
          Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function Principles() {
  const { data } = useSiteContent('principles', FALLBACK);
  const [principles, setPrinciples] = useState<Principle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/investor-education/principles')
      .then((data) => setPrinciples(data ?? []))
      .catch(() => setPrinciples([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/education/reading-materials" className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Reading Materials
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Reading Materials</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Principles</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#009900] mb-8">Principles of Investor Education</h2>
          <div className="max-w-4xl space-y-6">
            {data.introParagraphs.map((text, index) => (
              <p key={index} className="text-gray-600 text-base sm:text-lg leading-relaxed">{text}</p>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-green-50 rounded-xl text-green-600"><Target size={24} /></div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#009900]">Objectives</h2>
            </div>
            <ul className="space-y-4">
              {data.objectives.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
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
              <h2 className="text-xl sm:text-2xl font-bold text-[#009900]">Benefits for Investors</h2>
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

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#009900] mb-8">Principles Library</h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : principles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {principles.map((item) => (
                <PrincipleCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No principles have been published yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
