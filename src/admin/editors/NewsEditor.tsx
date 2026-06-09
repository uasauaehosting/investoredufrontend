import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';

const CATEGORIES = ['News', 'Publication', 'Event'];

export interface NewsItem {
  id: number;
  title: string;
  image: string | null;
  category: string;
  date: string | null;
  excerpt: string | null;
  link?: string;
}

const empty: Omit<NewsItem, 'id'> = {
  title: '',
  image: '',
  category: 'News',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  link: '',
};

export default function NewsEditor() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/home/news');
      setItems(data ?? []);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (n: NewsItem) => setEditing({ ...n });
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      if (editing.id) {
        await api.put(`/home/news/${editing.id}`, editing);
      } else {
        await api.post('/home/news', editing);
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
    if (!confirm('Delete this news item?')) return;
    try {
      await api.delete(`/home/news/${id}`);
      load();
    } catch (err) {
      console.error('Failed to delete news:', err);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 text-sm animate-pulse">Loading news...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">News Items</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage homepage news cards</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add News
        </button>
      </div>

      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#009900] text-sm">{editing.id ? 'Edit News Item' : 'New News Item'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
              <input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select value={editing.category ?? 'News'} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Published Date</label>
              <input type="date" value={editing.date ?? ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload 
                value={editing.image ?? ''} 
                onChange={(url) => setEditing({ ...editing, image: url })}
                label="News Header Image"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
              <input type="text" value={editing.link ?? ''} onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Summary / Excerpt</label>
              <textarea rows={3} value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
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

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 group hover:border-green-300 transition-colors">
            <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
            {item.image && (
              <img src={item.image} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.date} &middot; {item.category}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 flex-shrink-0">{item.category}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => openEdit(item)} className="icon-btn"><Pencil size={14} /></button>
              <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No news items yet.</p>}
      </div>
    </div>
  );
}
