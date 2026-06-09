import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
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
    <div className="relative w-full overflow-hidden" style={{ height: 'clamp(280px, 50vw, 520px)' }}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <img
            src={slide.image_url ?? ''}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-[#009900]/85 via-[#009900]/40 to-transparent" />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
              <div
                className={`max-w-lg transition-all duration-700 delay-200 ${
                  i === current ? 'opacity-100 translate-x-0' : 'opacity-0 ltr:-translate-x-8 rtl:translate-x-8'
                }`}
              >
                <div className="w-12 h-1 bg-amber-400 mb-4 rounded-full" />
                <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 drop-shadow-md">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-green-100 text-sm sm:text-base mb-6 leading-relaxed drop-shadow">
                    {slide.subtitle}
                  </p>
                )}
                <a
                  href={slide.cta_href ?? '#'}
                  className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm px-6 py-2.5 rounded transition-colors shadow-lg"
                >
                  {slide.cta_text ?? 'Learn More'}
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute start-3 sm:start-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="rtl:rotate-180" />
          </button>
          <button
            onClick={next}
            className="absolute end-3 sm:end-5 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="rtl:rotate-180" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
