import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../lib/useSiteContent';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';
import { normalizeMediaUrl } from '../lib/mediaUrl';

interface PortalCard {
  title: string;
  titleAr?: string;
  href: string;
  image_url: string;
}

const FALLBACK = {
  heroImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1600',
  heroTitle: 'UASA INVESTOR EDUCATION PORTAL',
  heroTitleAr: 'بوابة اتحاد هيئات الأوراق المالية العربية لتعليم وتوعية المستثمرين',
  cards: [
    {
      title:     'Investor Education',
      titleAr:   'تعليم المستثمر',
      href:      '/education/reading-materials/principles',
      image_url: 'https://images.pexels.com/photos/7948059/pexels-photo-7948059.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title:     'Financial Inclusion',
      titleAr:   'الشمول المالي',
      href:      '/inclusion/projects',
      image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      title:     'Glossary',
      titleAr:   'قاموس المصطلحات المالية',
      href:      '/glossary',
      image_url: 'https://images.pexels.com/photos/265152/pexels-photo-265152.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ],
};

function PortalCardItem({ card }: { card: PortalCard }) {
  const { lang, isRtl } = useLanguage();
  const [imgSrc, setImgSrc] = useState(card.image_url);
  const label = lang === 'ar' && card.titleAr ? card.titleAr : card.title;

  return (
    <Link
      to={card.href}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-400 bg-gray-900 flex flex-col"
    >
      {/* Card image */}
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <img
          src={imgSrc}
          alt={label}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-75"
          onError={() =>
            setImgSrc(
              'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800',
            )
          }
        />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>

      {/* Label bar */}
      <div className="relative flex items-center justify-between gap-2 px-5 py-4 bg-white group-hover:bg-[#009900] transition-colors duration-300">
        <span className="text-sm font-bold uppercase tracking-widest text-[#009900] group-hover:text-white transition-colors duration-300">
          {label}
        </span>
        <ArrowRight
          size={16}
          className={`text-[#009900] group-hover:text-white transition-all duration-300 group-hover:translate-x-1 flex-shrink-0 ${isRtl ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`}
        />
      </div>
    </Link>
  );
}

export default function PortalSection() {
  const { lang, isRtl } = useLanguage();
  const { data } = useSiteContent('home.portal_section', FALLBACK);

  // Resolve the hero image — normalise if it's a backend-uploaded path
  const heroImageSrc = (data.heroImage as string)
    ? normalizeMediaUrl(data.heroImage as string)
    : FALLBACK.heroImage;

  const heroTitle =
    lang === 'ar' && (data as typeof FALLBACK).heroTitleAr
      ? (data as typeof FALLBACK).heroTitleAr
      : (data as typeof FALLBACK).heroTitle ?? FALLBACK.heroTitle;

  return (
    <section>
      {/* ── Hero banner with dynamic background image ─────────────────── */}
      <div
        className="relative w-full aspect-[21/5] overflow-hidden"
        role="img"
        aria-label={t(lang, 'site.tagline', 'UASA Investor Education Portal')}
      >
        {/* Dynamic background */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${heroImageSrc})` }}
        />

        {/* Blue-tinted overlay matching the screenshot */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/80 via-[#005599]/60 to-[#003366]/80" /> */}

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(255,255,255,0.3) 30px, rgba(255,255,255,0.3) 31px),
                              repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.3) 30px, rgba(255,255,255,0.3) 31px)`,
          }}
        />

        {/* Centred title */}
        <div className="relative h-full flex items-center justify-center px-6">
          <h2
            dir={isRtl ? 'rtl' : 'ltr'}
            className="text-white text-center font-extrabold tracking-widest uppercase drop-shadow-lg"
            style={{ fontSize: 'clamp(1.1rem, 3.2vw, 2rem)', letterSpacing: '0.12em' }}
          >
            {heroTitle}
          </h2>
        </div>
      </div>

      {/* ── Portal cards ───────────────────────────────────────────────── */}
      <div className="bg-[#f4f4f4] py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(data.cards as PortalCard[]).map((card) => (
              <PortalCardItem key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
