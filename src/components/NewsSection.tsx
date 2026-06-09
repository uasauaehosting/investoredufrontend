import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { pickField } from '../lib/localizedText';

export interface NewsItem {
  id: number;
  title: string;
  titleAr?: string;
  image: string | null;
  category: string;
  date: string | null;
  excerpt: string | null;
  excerptAr?: string | null;
}

const categoryColors: Record<string, string> = {
  Publication: 'bg-green-100 text-green-700',
  News: 'bg-green-100 text-green-700',
  Event: 'bg-amber-100 text-amber-700',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function NewsCard({ item }: { item: NewsItem }) {
  const { lang } = useLanguage();
  const title = pickField(lang, item, 'title');
  const [imgSrc, setImgSrc] = useState(item.image ?? 'https://images.unsplash.com/photo-1504711432869-efd597cdd042?auto=format&fit=crop&q=80&w=800');

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-0.5">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => {
            setImgSrc('https://images.unsplash.com/photo-1504711432869-efd597cdd042?auto=format&fit=crop&q=80&w=800');
          }}
        />
        <div className="absolute top-3 start-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              categoryColors[item.category] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1.5">{formatDate(item.date)}</p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-[#009900] transition-colors line-clamp-3">
          {title}
        </h3>
        <Link
          to={`/news/${item.id}`}
          className="inline-flex items-center gap-1 text-xs text-[#009900] font-medium mt-3 hover:text-amber-600 transition-colors"
        >
          Read More <span aria-hidden className="inline-block rtl:rotate-180">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/home/news')
      .then((data) => {
        setNews(data.slice(0, 6) ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load news:', err);
        setError('Failed to load news.');
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-7 bg-amber-500 rounded-full" />
              <h2 className="text-2xl font-bold text-[#009900]">Latest News</h2>
            </div>
            <p className="text-gray-500 text-sm ms-4 ps-3">
              Stay updated with the latest investor education news from Arab markets
            </p>
          </div>
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#009900] hover:text-amber-600 transition-colors border border-[#009900]/30 hover:border-amber-500 rounded-full px-4 py-1.5"
          >
            View All News
          </a>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-6 sm:hidden text-center">
          <a
            href="#"
            className="inline-block text-sm font-medium text-[#009900] hover:text-amber-600 transition-colors border border-[#009900]/30 rounded-full px-6 py-2"
          >
            View All News
          </a>
        </div>
      </div>
    </section>
  );
}
