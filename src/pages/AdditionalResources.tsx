import { ExternalLink } from 'lucide-react';
import { useSiteContent } from '../lib/useSiteContent';

interface ResourceLink {
  title: string;
  url: string;
  description?: string;
}

const FALLBACK = {
  intro:
    'Explore supplementary reports, guidelines, and reference materials related to the UASA Financial Inclusion Index and regional benchmarking efforts.',
  resources: [] as ResourceLink[],
};

export default function AdditionalResources() {
  const { data } = useSiteContent('additional_resources', FALLBACK);
  const resources = Array.isArray(data.resources) ? data.resources : [];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            Financial Inclusion Index
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Additional Resources</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16 space-y-8">
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-4xl">{data.intro}</p>

          {resources.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No additional resources have been published yet.</p>
          ) : (
            <div className="grid gap-4">
              {resources.map((resource, index) => (
                <a
                  key={`${resource.url}-${index}`}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-[#009900]/30 hover:bg-green-50/40 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-[#009900] group-hover:text-amber-600 transition-colors">{resource.title}</h2>
                    {resource.description && (
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{resource.description}</p>
                    )}
                  </div>
                  <ExternalLink size={18} className="text-[#009900] shrink-0 mt-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
