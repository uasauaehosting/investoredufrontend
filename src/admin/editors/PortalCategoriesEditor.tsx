import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';

export interface PortalCategory {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string;
  authority_name: string;
  country: string;
}

const empty: Omit<PortalCategory, 'id'> = {
  title: '',
  description: '',
  image_url: '',
  link: '#',
  authority_name: '',
  country: '',
};

export default function PortalCategoriesEditor() {
  const [cats, setCats] = useState<PortalCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PortalCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/portals');
      setCats(data ?? []);
    } catch (err) {
      console.error('Failed to load portals:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (c: PortalCategory) => setEditing({ ...c });
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      if (editing.id) {
        await api.put(`/portals/${editing.id}`, editing);
      } else {
        await api.post('/portals', editing);
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
    if (!confirm('Delete this portal?')) return;
    try {
      await api.delete(`/portals/${id}`);
      load();
    } catch (err) {
      console.error('Failed to delete portal:', err);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 text-sm animate-pulse">Loading categories...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Portal Categories</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage the three feature cards (Investor Education, Financial Inclusion, Glossary)</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Category
        </button>
      </div>

      {editing && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#00285e] text-sm">{editing.id ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
              <input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285e]/20 focus:border-[#00285e]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285e]/20 focus:border-[#00285e] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Authority Name</label>
              <input type="text" value={editing.authority_name ?? ''} onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285e]/20 focus:border-[#00285e]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
              <input type="text" value={editing.country ?? ''} onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285e]/20 focus:border-[#00285e]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
              <input type="text" value={editing.image_url ?? ''} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285e]/20 focus:border-[#00285e]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
              <input type="text" value={editing.link ?? ''} onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00285e]/20 focus:border-[#00285e]" />
            </div>
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

      <div className="space-y-3">
        {cats.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 group hover:border-blue-300 transition-colors">
            {c.image_url && (
              <img src={c.image_url} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-800 truncate">{c.title}</h4>
              <p className="text-xs text-gray-400 line-clamp-1">{c.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{c.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {cats.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No categories yet.</p>}
      </div>
    </div>
  );
}
