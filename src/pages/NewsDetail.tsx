import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { pickField, pickLocalized } from '../lib/localizedText';

interface NewsItem {
  id: number;
  title: string;
  titleAr?: string;
  category: string;
  date: string;
  excerpt: string;
  excerptAr?: string;
  fullDetail?: string;
  fullDetailAr?: string;
  image: string | null;
}

export default function NewsDetail() {
  const { lang } = useLanguage();
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

  const title = pickField(lang, item, 'title');
  const body = pickLocalized(lang, item.fullDetail || item.excerpt, item.fullDetailAr || item.excerptAr);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-[#009900] hover:text-amber-600 mb-8 transition-colors">
        <ArrowLeft size={16} />
        <span>Back to News</span>
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {item.image && (
          <img src={item.image} alt={title} className="w-full h-80 object-cover" />
        )}
        <div className="p-8 sm:p-12">
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full">
              <Tag size={12} />
              {item.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} />
              {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#009900] mb-8 leading-tight">
            {title}
          </h1>

          <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
            {body ? (
              <div dangerouslySetInnerHTML={{ __html: body }} />
            ) : (
              <p>{item.excerpt}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
