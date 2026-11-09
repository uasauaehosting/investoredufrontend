import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { t } from '../lib/translations';
import { useSiteContent } from '../lib/useSiteContent';
import { normalizeMediaUrl } from '../lib/mediaUrl';

const MEMBERS_HEADER_FALLBACK = {
  headerImage: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1600',
};

export interface Member {
  id: number;
  name: string;
  country: string;
  logo: string | null;
  website: string | null;
}

function MemberCard({ member }: { member: Member }) {
  const [imgVisible, setImgVisible] = useState(true);

  return (
    <a
      href={member.website ?? '#'}
      target={member.website ? '_blank' : undefined}
      rel={member.website ? 'noopener noreferrer' : undefined}
      className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-[#009900]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-white"
    >
      <div className="w-full h-28 flex items-center justify-center mb-3">
        {imgVisible && member.logo ? (
          <img
            src={member.logo}
            alt={`${member.name} — ${member.country}`}
            className="max-h-24 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgVisible(false)}
          />
        ) : (
          <span className="text-3xl">🏛️</span>
        )}
      </div>
      <span className="text-xs text-gray-500 font-medium text-center group-hover:text-[#009900] transition-colors leading-tight">
        {member.country}
      </span>
    </a>
  );
}

export default function MembersSection() {
  const { lang, isRtl } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: headerData } = useSiteContent('home.members_header', MEMBERS_HEADER_FALLBACK);

  const headerImage = normalizeMediaUrl((headerData.headerImage as string) || '') || MEMBERS_HEADER_FALLBACK.headerImage;

  useEffect(() => {
    api.get('/home/members')
      .then((data) => {
        setMembers(data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load members:', err);
        setError('Failed to load members.');
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white">
      {/* ── Full-width heading banner with dynamic background image ── */}
      <div className="relative w-full aspect-[21/5] overflow-hidden">
        {/* Dynamic background */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${headerImage})` }}
        />
        {/* Green gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#004d00]/85 via-[#006600]/70 to-[#004d00]/85" /> */}
        {/* Dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        {/* Title */}
        <div className="relative h-full flex items-center justify-center px-6">
          <h2
            dir={isRtl ? 'rtl' : 'ltr'}
            className="text-white text-center font-extrabold uppercase tracking-widest drop-shadow-lg"
            style={{ fontSize: 'clamp(0.95rem, 2.6vw, 1.6rem)', letterSpacing: '0.1em' }}
          >
            {t(lang, 'home.membersPortals', "UASA MEMBERS' INVESTOR EDUCATION PORTALS")}
          </h2>
        </div>
      </div>

      {/* ── Members grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
