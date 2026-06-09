import { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { EDUCATION_SECTIONS, EducationItem, getSectionMeta, isValidSection } from '../lib/educationSections';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800';

function ItemCard({ item, basePath }: { item: EducationItem; basePath: string }) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || FALLBACK_IMAGE);

  return (
    <Link
      to={`${basePath}/${item.id}`}
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

export default function EducationSectionList() {
  const { section } = useParams<{ section: string }>();
  const meta = section ? getSectionMeta(section) : null;
  const valid = section && isValidSection(section) && meta;
  const [items, setItems] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!valid || !section) return;
    setLoading(true);
    setError(null);
    api
      .get(`/investor-education/content?section=${section}`)
      .then((data) => setItems(data ?? []))
      .catch(() => setError('Failed to load content.'))
      .finally(() => setLoading(false));
  }, [section, valid]);

  if (!valid || !meta) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{meta.title}</h1>
          <p className="text-green-100 max-w-2xl leading-relaxed">{meta.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500 py-12">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-gray-400 py-16">No content available yet.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} basePath={meta.listPath} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
