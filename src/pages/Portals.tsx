import { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import { MEMBER_PORTALS, MemberPortal } from '../data/memberPortals';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800';

interface ApiPortal {
  id: number;
  title: string;
  short_title: string;
  image_url: string;
  link: string;
}

function toMemberPortal(p: ApiPortal): MemberPortal {
  return {
    id: p.id,
    panelTitle: p.title,
    displayTitle: p.short_title,
    imageUrl: p.image_url,
    imageAlt: p.short_title,
    link: p.link,
  };
}

function PortalAccordionItem({ portal, isOpen, onToggle }: { portal: MemberPortal; isOpen: boolean; onToggle: () => void }) {
  const [imgSrc, setImgSrc] = useState(portal.imageUrl);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start bg-gray-50 hover:bg-blue-50 transition-colors">
        <span className="font-semibold text-[#00285e] text-sm sm:text-base leading-snug pe-2">{portal.panelTitle}</span>
        <ChevronDown size={20} className={`text-[#00285e] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-5 py-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-48 shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <img src={imgSrc} alt={portal.imageAlt} className="w-full h-auto object-contain" onError={() => setImgSrc(FALLBACK_IMAGE)} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#00285e] mb-3">{portal.displayTitle}</h3>
              <a href={portal.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#00285e] hover:bg-[#001a45] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                Visit Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Portals() {
  const [portals, setPortals] = useState<MemberPortal[]>(MEMBER_PORTALS);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get('/portals')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPortals(data.map(toMemberPortal));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader title="Portals" subtitle="Member authority investor education portals" badge="Members' Activities" />
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="space-y-4">
          {portals.map((portal) => (
            <PortalAccordionItem
              key={portal.id}
              portal={portal}
              isOpen={openId === portal.id}
              onToggle={() => setOpenId(openId === portal.id ? null : portal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
