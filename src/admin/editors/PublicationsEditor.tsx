import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';

interface Publication {
  id: number;
  title: string;
  description: string | null;
  authority_name: string;
  category: string;
  file_url: string | null;
  date_published: string | null;
}

const CATEGORIES = ['Brochure', 'Code', 'General', 'Guide', 'Others', 'Report', 'Study'];

const empty = (): Omit<Publication, 'id'> => ({
  title: '', description: '', authority_name: '', category: 'General', file_url: '', date_published: null,
});

export default function PublicationsEditor() {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Publication> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/publications?is_active=false');
      setItems(data ?? []);
    } catch {
      try {
        const data = await api.get('/publications');
        setItems(data ?? []);
      } catch (err) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.title?.trim()) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/publications/${editing.id}`, editing);
      } else {
        await api.post('/publications', editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this publication?')) return;
    await api.delete(`/publications/${id}`);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Publications</h2>
          <p className="text-xs text-gray-400">Manage member publications</p>
        </div>
        <button onClick={() => setEditing(empty())} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Publication
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 mb-5 grid sm:grid-cols-2 gap-3">
          <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2" placeholder="Title" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Authority" value={editing.authority_name ?? ''} onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })} />
          <select className="border rounded-lg px-3 py-2 text-sm" value={editing.category ?? 'General'} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="border rounded-lg px-3 py-2 text-sm sm:col-span-2" placeholder="File URL" value={editing.file_url ?? ''} onChange={(e) => setEditing({ ...editing, file_url: e.target.value })} />
          <textarea className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 min-h-[60px]" placeholder="Description" value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5"><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-400">{item.authority_name} · {item.category}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 text-gray-400 hover:text-[#009900]"><Pencil size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
