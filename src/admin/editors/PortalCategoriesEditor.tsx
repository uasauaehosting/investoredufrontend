import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview } from './siteContent/FormFields';

export interface PortalCategory {
  id: number;
  title: string;
  titleAr?: string | null;
  short_title: string;
  short_titleAr?: string | null;
  description: string | null;
  descriptionAr?: string | null;
  image_url: string | null;
  link: string;
  authority_name: string;
  authority_nameAr?: string | null;
  country: string;
  countryAr?: string | null;
}

const empty: Omit<PortalCategory, 'id'> = {
  title: '',
  titleAr: '',
  short_title: '',
  short_titleAr: '',
  description: '',
  descriptionAr: '',
  image_url: '',
  link: '#',
  authority_name: '',
  authority_nameAr: '',
  country: '',
  countryAr: '',
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
      setCats(normalizeMediaFieldsDeep(data ?? []));
    } catch (err) {
      console.error('Failed to load portals:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (c: PortalCategory) => setEditing(normalizeMediaFieldsDeep({ ...c }));
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Panel title is required.'); return; }
    if (!editing.short_title?.trim()) { setError('Display title is required.'); return; }
    if (!editing.authority_name?.trim()) { setError('Authority name is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        ...editing,
        titleAr: editing.titleAr?.trim() || null,
        short_titleAr: editing.short_titleAr?.trim() || null,
        descriptionAr: editing.descriptionAr?.trim() || null,
        authority_nameAr: editing.authority_nameAr?.trim() || null,
        countryAr: editing.countryAr?.trim() || null,
      });
      if (editing.id) {
        await api.put(`/portals/${editing.id}`, payload);
      } else {
        await api.post('/portals', payload);
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
          <h2 className="text-lg font-bold text-gray-800">Member Portals</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage authority portals shown on /education/members-activities/portals</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Portal
        </button>
      </div>

      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#009900] text-sm">{editing.id ? 'Edit Portal' : 'New Portal'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Panel Title *</label>
              <input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Full authority name shown in the accordion header"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Display Title *</label>
              <input type="text" value={editing.short_title ?? ''} onChange={(e) => setEditing({ ...editing, short_title: e.target.value })}
                placeholder="Short title shown when the panel is expanded"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Authority Name</label>
              <input type="text" value={editing.authority_name ?? ''} onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
              <input type="text" value={editing.country ?? ''} onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                label="Image"
                value={editing.image_url ?? ''}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
              <input type="text" value={editing.link ?? ''} onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
            </div>
            <ArabicSectionDivider />
            <div className="sm:col-span-2">
              <ArabicTextField label="عنوان اللوحة (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} />
            </div>
            <div className="sm:col-span-2">
              <ArabicTextField label="العنوان المختصر (عربي)" value={editing.short_titleAr ?? ''} onChange={(v) => setEditing({ ...editing, short_titleAr: v })} />
            </div>
            <div className="sm:col-span-2">
              <ArabicTextAreaField label="الوصف (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={3} />
            </div>
            <ArabicTextField label="اسم الجهة (عربي)" value={editing.authority_nameAr ?? ''} onChange={(v) => setEditing({ ...editing, authority_nameAr: v })} />
            <ArabicTextField label="الدولة (عربي)" value={editing.countryAr ?? ''} onChange={(v) => setEditing({ ...editing, countryAr: v })} />
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
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 group hover:border-green-300 transition-colors">
            {c.image_url && <MediaPreview url={c.image_url} />}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-800 truncate">{c.title}</h4>
              <p className="text-xs text-gray-500 line-clamp-1">{c.short_title || c.authority_name}</p>
              <p className="text-xs text-gray-400 line-clamp-1">{c.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">{c.country}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-[#009900] hover:bg-green-50 rounded-lg transition-colors">
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {cats.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No member portals yet.</p>}
      </div>
    </div>
  );
}
