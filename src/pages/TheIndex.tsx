import { useSiteContent } from '../lib/useSiteContent';

const FALLBACK = {
  content: "A guideline on financial inclusion index to be developed based on AFI's financial inclusion index (the Financial Inclusion Data Working Group (FIDWG)) for the UASA members to track the progress of financial inclusion in their nations.",
};

export default function TheIndex() {
  const { data } = useSiteContent('the_index', FALLBACK);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#00285e] to-[#003580] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#00285e] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Financial Inclusion Index</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">The Index</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{data.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
