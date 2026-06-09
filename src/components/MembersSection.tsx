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
      className="group flex flex-col items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-[#00285e]/40 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-white"
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
      <span className="text-xs text-gray-500 font-medium text-center group-hover:text-[#00285e] transition-colors leading-tight">
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
}
