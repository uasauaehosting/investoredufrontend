import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { Principle, PRINCIPLES_LIST_PATH } from '../lib/principles';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200';

export default function PrincipleDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Principle | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/investor-education/principles/${id}`)
      .then((data: Principle) => {
        setItem(data);
        if (data.imageUrl) setImgSrc(data.imageUrl);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-gray-400">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">Principle not found.</p>
        <Link to={PRINCIPLES_LIST_PATH} className="text-[#009900] hover:text-amber-600 font-medium">
          Back to Principles
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to={PRINCIPLES_LIST_PATH}
            className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Principles
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-4 tracking-widest uppercase">
            Principles
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{item.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-0 items-start">
            <div className="bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center justify-center p-6 sm:p-8 lg:p-10 lg:sticky lg:top-6 lg:self-start rounded-t-3xl lg:rounded-s-3xl lg:rounded-tr-none">
              <img
                src={imgSrc}
                alt={item.title}
                className="w-full max-h-72 sm:max-h-96 lg:max-h-[32rem] object-contain rounded-2xl"
                onError={() => setImgSrc(FALLBACK_IMAGE)}
              />
            </div>
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                {item.description}
              </p>
              {item.content ? (
                <div
                  className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              ) : (
                <p className="text-gray-500">{item.description}</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
