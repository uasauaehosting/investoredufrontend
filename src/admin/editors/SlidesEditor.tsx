import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { MediaPreview } from './siteContent/FormFields';

export interface Slide {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_href: string | null;
  display_order: number;
  is_active: boolean;
}

const empty: Omit<Slide, 'id'> = {
  title: '',
  subtitle: '',
  image_url: '',
  cta_text: 'Learn More',
  cta_href: '#',
  display_order: 0,
  is_active: true,
};

export default function SlidesEditor() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Slide> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/home/slides');
      setSlides(normalizeMediaFieldsDeep(data ?? []));
    } catch (err) {
      console.error('Failed to load slides:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty, display_order: slides.length + 1 });
  const openEdit = (s: Slide) => setEditing(normalizeMediaFieldsDeep({ ...s }));
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      if (editing.id) {
        await api.put(`/home/slides/${editing.id}`, normalizeMediaFieldsDeep(editing));
      } else {
        await api.post('/home/slides', normalizeMediaFieldsDeep(editing));
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
    if (!confirm('Delete this slide?')) return;
    try {
      await api.delete(`/home/slides/${id}`);
      load();
    } catch (err) {
      console.error('Failed to delete slide:', err);
    }
  };

  const toggleActive = async (slide: Slide) => {
    try {
      await api.put(`/home/slides/${slide.id}`, { is_active: !slide.is_active });
      load();
    } catch (err) {
      console.error('Failed to toggle active state:', err);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 text-sm animate-pulse">Loading slides...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Hero Slides</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage homepage carousel slides</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Slide
        </button>
      </div>

      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#009900] text-sm">{editing.id ? 'Edit Slide' : 'New Slide'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <ImageUpload 
                value={editing.image_url ?? ''} 
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                label="Slide Background Image"
              />
            </div>
            <Field label="Title *" value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} />
            <Field label="Subtitle" value={editing.subtitle ?? ''} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <Field label="CTA Text" value={editing.cta_text ?? ''} onChange={(v) => setEditing({ ...editing, cta_text: v })} />
            <Field label="CTA Link" value={editing.cta_href ?? ''} onChange={(v) => setEditing({ ...editing, cta_href: v })} />
            <Field label="Display Order" type="number" value={String(editing.display_order ?? 0)} onChange={(v) => setEditing({ ...editing, display_order: Number(v) })} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_active" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="rounded" />
            <label htmlFor="is_active" className="text-sm text-gray-600">Active</label>
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
        {slides.map((s) => (
          <div key={s.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 group hover:border-green-300 transition-colors">
            <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
            {s.image_url && <MediaPreview url={s.image_url} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{s.title}</p>
              <p className="text-xs text-gray-400 truncate">{s.subtitle}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {s.is_active ? 'Active' : 'Hidden'}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button onClick={() => toggleActive(s)} className="icon-btn" title={s.is_active ? 'Deactivate' : 'Activate'}>
                {s.is_active ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} className="text-gray-400" />}
              </button>
              <button onClick={() => openEdit(s)} className="icon-btn"><Pencil size={14} /></button>
              <button onClick={() => remove(s.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {slides.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No slides yet.</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
    </div>
  );
}
