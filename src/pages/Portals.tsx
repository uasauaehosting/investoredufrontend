import { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, Globe } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';
import { normalizeMediaUrl } from '../lib/mediaUrl';
import { MEMBER_PORTALS, MemberPortal } from '../data/memberPortals';
import { useLanguage } from '../lib/LanguageContext';
import { pickLocalized } from '../lib/localizedText';
import { t } from '../lib/translations';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800';

interface ApiPortal {
  id: number;
  title: string;
  title_ar?: string | null;
  short_title: string;
  short_title_ar?: string | null;
  image_url: string;
  link: string;
}

function PortalAccordionItem({
  portal,
  isOpen,
  onToggle,
}: {
  portal: MemberPortal;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const { lang, isRtl } = useLanguage();
  const [imgSrc, setImgSrc] = useState(portal.imageUrl || FALLBACK_IMAGE);

  return (
    <div
      className={`rounded-2xl border bg-white overflow-hidden transition-shadow duration-200 ${
        isOpen
          ? 'border-[#009900]/30 shadow-md ring-1 ring-[#009900]/10'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-start transition-colors ${
          isOpen ? 'bg-green-50/80' : 'bg-white hover:bg-green-50/50'
        }`}
      >
        <span className="font-semibold text-[#009900] text-sm sm:text-base leading-snug pe-2" dir={isRtl ? 'rtl' : 'ltr'}>
          {portal.panelTitle}
        </span>
        <ChevronDown
          size={20}
          className={`text-[#009900] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-5 sm:px-6 py-6 border-t border-gray-100 bg-white">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-52 shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] flex items-center justify-center p-3">
              <img
                src={imgSrc}
                alt={portal.imageAlt}
                className="max-w-full max-h-full object-contain"
                onError={() => setImgSrc(FALLBACK_IMAGE)}
              />
            </div>
            <div className="flex-1 min-w-0" dir={isRtl ? 'rtl' : 'ltr'}>
              <h3 className="text-lg sm:text-xl font-bold text-[#009900] mb-2">{portal.displayTitle}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {t(lang, 'portals.visitDesc', 'Visit the official investor education portal for resources, guides, and awareness materials.')}
              </p>
              <a
                href={portal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#009900] hover:bg-[#006600] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                {t(lang, 'portals.visitPortal', 'Visit Portal')}
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
    </div>
  );
}

export default function Portals() {
  const { lang, isRtl } = useLanguage();
  const [portals, setPortals] = useState<MemberPortal[]>(
    MEMBER_PORTALS.map((p) => ({
      ...p,
      imageUrl: normalizeMediaUrl(p.imageUrl),
      // Apply Arabic titles from static fallback immediately
      panelTitle:   pickLocalized(lang, p.panelTitle, p.panelTitleAr),
      displayTitle: pickLocalized(lang, p.displayTitle, p.displayTitleAr),
    })),
  );
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/portals')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPortals(
            data.map((p: ApiPortal): MemberPortal => ({
              id: p.id,
              panelTitle:   pickLocalized(lang, p.title, p.title_ar),
              displayTitle: pickLocalized(lang, p.short_title, p.short_title_ar),
              imageUrl:     normalizeMediaUrl(p.image_url),
              imageAlt:     pickLocalized(lang, p.short_title, p.short_title_ar),
              link: p.link,
            })),
          );
        } else {
          // API empty — re-apply language to static fallback
          setPortals(
            MEMBER_PORTALS.map((p) => ({
              ...p,
              imageUrl:     normalizeMediaUrl(p.imageUrl),
              panelTitle:   pickLocalized(lang, p.panelTitle, p.panelTitleAr),
              displayTitle: pickLocalized(lang, p.displayTitle, p.displayTitleAr),
            })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  const portalCountLabel = portals.length === 1
    ? `1 ${t(lang, 'portals.available', 'portal available')}`
    : `${portals.length} ${t(lang, 'portals.availablePlural', 'portals available')}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title={t(lang, 'portals.title', 'Portals')}
        items={[
          { label: t(lang, 'bc.home', 'Home'), href: '/' },
          { label: t(lang, 'nav.investorEducation', 'Investor Education') },
          { label: t(lang, 'nav.membersActivities', "Members' Activities"), href: '/education/members-activities' },
          { label: t(lang, 'portals.title', 'Portals') },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-green-50 items-center justify-center">
                <Globe size={22} className="text-[#009900]" />
              </div>
              <div dir={isRtl ? 'rtl' : 'ltr'}>
                <h2 className="text-lg font-bold text-[#009900] mb-2">
                  {t(lang, 'portals.sectionTitle', 'Member Authority Portals')}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {t(lang, 'portals.intro', 'Explore investor education portals from UASA member authorities across the Arab region. Select a member below to view their portal and access local educational resources.')}
                </p>
              </div>
            </div>
            {!loading && (
              <p className="text-sm text-gray-500 shrink-0">{portalCountLabel}</p>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <PortalSkeleton key={i} />
              ))}
            </div>
          ) : portals.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              {t(lang, 'portals.empty', 'No portals available yet.')}
            </p>
          ) : (
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
          )}
        </section>
      </div>
    </div>
  );
}
