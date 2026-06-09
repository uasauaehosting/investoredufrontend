import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';

export interface Member {
  id: number;
  name: string;
  country: string;
  logo: string | null;
  website: string | null;
}

const empty: Omit<Member, 'id'> = {
  name: '',
  country: '',
  logo: '',
  website: '#',
};

export default function MembersEditor() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/home/members');
      setMembers(data ?? []);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (m: Member) => setEditing({ ...m });
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.name?.trim() || !editing.country?.trim()) { setError('Name and country are required.'); return; }
    setSaving(true); setError(null);
    try {
      if (editing.id) {
        await api.put(`/home/members/${editing.id}`, editing);
      } else {
        await api.post('/home/members', editing);
      }
      setEditing(null);
      load();
    } catch (err: any) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this member?')) return;
    try {
      await api.delete(`/home/members/${id}`);
      load();
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 text-sm animate-pulse">Loading members...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Members</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage Arab securities authority member portals</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Member
        </button>
      </div>

      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#009900] text-sm">{editing.id ? 'Edit Member' : 'New Member'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Authority Name *', key: 'name' },
              { label: 'Country *', key: 'country' },
              { label: 'Logo URL', key: 'logo' },
              { label: 'Portal URL', key: 'website' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <input
                  type="text"
                  value={String((editing as Record<string, unknown>)[key] ?? '')}
                  onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]"
                />
              </div>
            ))}
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancel} className="btn-ghost flex items-center gap-1.5"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 group hover:border-green-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
              {m.logo ? (
                <img src={m.logo} alt="" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-xl">🏛️</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
              <p className="text-xs text-gray-400 truncate">{m.country}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-[#009900] hover:bg-green-50 rounded-lg transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && <p className="text-sm text-gray-400 py-4 text-center col-span-2">No members yet.</p>}
      </div>
    </div>
  );
}
