import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  fullDetail?: string;
  image: string | null;
}

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/home/news/${id}`)
      .then(setItem)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (!item) return <div className="py-20 text-center">News not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-[#00285e] hover:text-amber-600 mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span>Back to News</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {item.image && (
          <img src={item.image} alt={item.title} className="w-full h-80 object-cover" />
        )}
        <div className="p-8 sm:p-12">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              <Tag size={12} />
              {item.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#00285e] mb-8 leading-tight">
            {item.title}
          </h1>

          <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
            {item.fullDetail ? (
              <div dangerouslySetInnerHTML={{ __html: item.fullDetail }} />
            ) : (
              <p>{item.excerpt}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
