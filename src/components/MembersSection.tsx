import { useState, useEffect } from 'react';
import { api } from '../lib/api';

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
      <div className="w-full h-14 flex items-center justify-center mb-3">
        {imgVisible && member.logo ? (
          <img
            src={member.logo}
            alt={`${member.name} — ${member.country}`}
            className="max-h-12 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
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
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-7 bg-amber-500 rounded-full" />
          <h2 className="text-2xl font-bold text-[#009900]">Member Authorities</h2>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
