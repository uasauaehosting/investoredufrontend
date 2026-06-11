import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { NewsCard, NewsItem } from '../components/NewsSection';
import { api } from '../lib/api';

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/home/news')
      .then((data) => {
        setNews(data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load news:', err);
        setError('Failed to load news.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title="All News"
        items={[
          { label: 'Home', to: '/' },
          { label: 'News' },
        ]}
        backLink={{ to: '/', label: 'Back to Home' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
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

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No news items yet.</div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
