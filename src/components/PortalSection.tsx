import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../lib/useSiteContent';

interface PortalCard {
  title: string;
  href: string;
  image_url: string;
}

const FALLBACK = {
  heroImage: '/images/portal-hero.png',
  cards: [
    { title: 'Investor Education', href: '/education/reading-materials/principles', image_url: 'https://images.pexels.com/photos/7948059/pexels-photo-7948059.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { title: 'Financial Inclusion', href: '/inclusion/projects', image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800' },
    { title: 'Glossary', href: '/glossary', image_url: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=800' },
  ],
};

function PortalCardItem({ card }: { card: PortalCard }) {
  const [imgSrc, setImgSrc] = useState(card.image_url);

  return (
    <Link
      to={card.href}
      className="group flex flex-col bg-white border border-[#e0e0e0] hover:border-[#008000]/40 transition-colors"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          onError={() =>
            setImgSrc('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800')
          }
        />
      </div>
      <p className="py-4 px-3 text-center text-sm font-bold uppercase tracking-wide text-[#008000]">
        {card.title}
      </p>
    </Link>
  );
}

export default function PortalSection() {
  const { data } = useSiteContent('home.portal_section', FALLBACK);

  return (
    <section>
      <div
        className="relative w-full bg-no-repeat bg-cover bg-top"
        style={{
          backgroundImage: `url(${data.heroImage})`,
          height: 'clamp(120px, 18vw, 180px)',
        }}
        role="img"
        aria-label="UASA Investor Education Portal"
      />

      <div
        className="py-8 sm:py-10"
        style={{
          backgroundColor: '#f0f0f0',
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0, 0, 0, 0.025) 12px, rgba(0, 0, 0, 0.025) 13px)`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {data.cards.map((card) => (
              <PortalCardItem key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
