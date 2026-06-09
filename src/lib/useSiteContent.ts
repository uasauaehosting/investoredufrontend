import { useState, useEffect } from 'react';
import { api } from './api';

export function useSiteContent<T>(key: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/site-content/${key}`)
      .then((content) => setData({ ...fallback, ...content }))
      .catch(() => setData(fallback))
      .finally(() => setLoading(false));
  }, [key]);

  return { data, loading };
}

export function useFooterStats(
  fallback: { label: string; value: string }[],
): { stats: { label: string; value: string }[]; loading: boolean } {
  const [stats, setStats] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/site-content/footer/stats')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStats(data.map((s: { label: string; value: string }) => ({ label: s.label, value: s.value })));
        }
      })
      .catch(() => setStats(fallback))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
