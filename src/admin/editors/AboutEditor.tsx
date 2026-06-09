import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';

interface AboutSection {
  id: number;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
}

export default function AboutEditor() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AboutSection> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/about/sections');
      setSections(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.content?.trim()) return;
    setSaving(true);
    try {
      if (editing.id) {
        await api.put(`/about/sections/${editing.id}`, editing);
      } else {
        await api.post('/about/sections', { ...editing, order: editing.order ?? sections.length + 1, isActive: true });
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
    if (!confirm('Delete this section?')) return;
    await api.delete(`/about/sections/${id}`);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">About Page</h2>
          <p className="text-xs text-gray-400">Edit about page paragraphs</p>
        </div>
        <button onClick={() => setEditing({ title: 'Section', content: '', order: sections.length + 1 })} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Section
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 mb-5 space-y-4">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Title" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm min-h-[120px]" placeholder="Content paragraph" value={editing.content ?? ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5"><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800">{s.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.content}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(s)} className="p-2 text-gray-400 hover:text-blue-600"><Pencil size={15} /></button>
              <button onClick={() => remove(s.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
