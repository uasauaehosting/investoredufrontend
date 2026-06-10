import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export interface Slide {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_href: string | null;
  display_order: number;
  is_active: boolean;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/home/slides')
      .then((data) => {
        if (data && data.length > 0) setSlides(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load slides:', err);
        setLoading(false);
      });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (animating || slides.length === 0) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating, slides.length]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo, slides.length]
  );

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (loading) {
    return (
      <div
        className="w-full bg-[#009900] animate-pulse flex items-center justify-center"
        style={{ height: 'clamp(280px, 50vw, 520px)' }}
      >
        <div className="w-12 h-12 border-4 border-white/20 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ height: 'clamp(280px, 50vw, 520px)' }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img
            src={slide.image_url ?? ''}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-gray-400/60 hover:bg-gray-500/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
