import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Layers } from 'lucide-react';
import { useSiteContent } from '../lib/useSiteContent';

const FALLBACK = {
  introParagraphs: [
    'The need for investor education and financial literacy has never been greater. As the financial marketplace continues to evolve and innovate, investment products are becoming increasingly complex and financial services increasingly diverse.',
    "The International Organization of Securities Commissions (IOSCO) is responding to these challenges through the Committee on Retail Investors (C8).",
  ],
  practices: [
    'Focus investor education and financial literacy programs on improving retail investor knowledge of basic core competencies for investing.',
    'Develop investor education and financial literacy programs that meet investor needs and support regulatory initiatives.',
    'Develop investor education and financial literacy programs to meet the needs of specific audiences.',
    'Consider insights gathered from research when developing investor education and financial literacy programs.',
    'Develop investor education and financial literacy programs with clear and measurable outcomes.',
    'Collaborate or partner with other relevant organisations in developing and delivering investor education programs.',
    'Consider national strategies and collaboration with other organisations to complement financial education programs.',
    'Promote international cooperation, sharing of information and coordination on investor education and financial literacy.',
  ],
  imageUrl: 'http://uasa.ae/en/galorg/23562017015639iosco.jpg',
  pdfUrl: 'http://www.iosco.org/library/pubdocs/pdf/IOSCOPD462.pdf',
};

export default function Framework() {
  const { data } = useSiteContent('framework', FALLBACK);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/education/reading-materials" className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Reading Materials
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Reading Materials</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Framework</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 space-y-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#009900] mb-8">IOSCO Framework</h2>
          <div className="grid lg:grid-cols-2 gap-10 items-start mb-10">
            <div className="space-y-6">
              {data.introParagraphs.map((text, index) => (
                <p key={index} className="text-gray-600 text-base sm:text-lg leading-relaxed">{text}</p>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md bg-gray-50">
              <img src={data.imageUrl} alt="IOSCO Strategic Framework" className="w-full h-auto object-cover" />
            </div>
          </div>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-8">
            The following framework identifies practices currently used by C8 members to help guide IOSCO members in developing and enhancing their own investor education and financial literacy programs:
          </p>

          <div className="space-y-5">
            {data.practices.map((practice, index) => (
              <div key={index} className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#009900] text-white flex items-center justify-center font-bold text-sm">{index + 1}</div>
                <div>
                  <h3 className="font-bold text-[#009900] mb-2">Practice {index + 1}</h3>
                  <p className="text-gray-600 leading-relaxed">{practice}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-[#009900] shrink-0"><Layers size={24} /></div>
            <div>
              <p className="text-gray-600 leading-relaxed mb-4">
                <span className="font-semibold text-[#009900]">See more at:</span> IOSCO Strategic Framework for Investor Education and Financial Literacy.
              </p>
              <a href={data.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#009900] font-semibold hover:text-amber-600 transition-colors">
                Download the full IOSCO framework document <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
