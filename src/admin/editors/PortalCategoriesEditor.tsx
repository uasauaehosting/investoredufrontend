import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Globe2 } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

export interface PortalCategory {
  id: number;
  title: string; titleAr?: string | null;
  short_title: string; short_titleAr?: string | null;
  description: string | null; descriptionAr?: string | null;
  image_url: string | null;
  link: string;
  authority_name: string; authority_nameAr?: string | null;
  country: string; countryAr?: string | null;
}

const empty: Omit<PortalCategory, 'id'> = {
  title: '', titleAr: '', short_title: '', short_titleAr: '',
  description: '', descriptionAr: '', image_url: '', link: '#',
  authority_name: '', authority_nameAr: '', country: '', countryAr: '',
};

function F({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
    </div>
  );
}

export default function PortalCategoriesEditor() {
  const [cats, setCats] = useState<PortalCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PortalCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try { setCats(normalizeMediaFieldsDeep(await api.get('/portals') ?? [])); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items: cats, setItems: setCats, resource: 'portals', onError: load });

  const openNew  = () => { setError(null); setEditing({ ...empty }); };
  const openEdit = (c: PortalCategory) => { setError(null); setEditing(normalizeMediaFieldsDeep({ ...c })); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Panel Title is required.'); return; }
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
      editing.id ? await api.put(`/portals/${editing.id}`, payload)
                 : await api.post('/portals', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this portal?')) return;
    await api.delete(`/portals/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading portals…</div>;

  return (
    <div>
      <SectionHeader
        title="Member Portals"
        description="Authority portals shown on /education/members-activities/portals. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} /> Add Portal
          </button>
        }
      />

      {cats.length === 0 ? (
        <EmptyState
          icon={<Globe2 size={40} strokeWidth={1.5} />}
          title="No portals yet"
          description="Add member authority portals to display on the portals page."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Portal</button>}
        />
      ) : (
        <div className="space-y-2">
          {cats.map((c, index) => (
            <div
              key={c.id}
              onDragOver={sortable.handleDragOver}
              onDrop={(e) => sortable.handleDrop(e, c.id)}
              className={sortable.rowClassName(c.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}
            >
              <SortableGrip id={c.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              {c.image_url
                ? <MediaPreview url={c.image_url} className="w-14 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                : <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Globe2 size={14} className="text-gray-300" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                <p className="text-xs text-gray-400 truncate">{c.authority_name} — {c.country}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(c)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(c.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer
        open={!!editing}
        onClose={cancel}
        title={editing?.id ? 'Edit Portal' : 'New Portal'}
        subtitle="Member authority portal"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}
      >
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <F label="Panel Title *" value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Full authority name in accordion header" />
              <F label="Display Title *" value={editing.short_title ?? ''} onChange={(v) => setEditing({ ...editing, short_title: v })} placeholder="Short title shown when panel is expanded" />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="Authority Name" value={editing.authority_name ?? ''} onChange={(v) => setEditing({ ...editing, authority_name: v })} />
                <F label="Country" value={editing.country ?? ''} onChange={(v) => setEditing({ ...editing, country: v })} />
              </div>
              <ImageUpload label="Portal Image" value={editing.image_url ?? ''} onChange={(url) => setEditing({ ...editing, image_url: url })} />
              <F label="Portal Link URL" value={editing.link ?? ''} onChange={(v) => setEditing({ ...editing, link: v })} placeholder="https://…" />
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="عنوان اللوحة (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} englishValue={editing.title ?? ''} />
              <ArabicTextField label="العنوان المختصر (عربي)" value={editing.short_titleAr ?? ''} onChange={(v) => setEditing({ ...editing, short_titleAr: v })} englishValue={editing.short_title ?? ''} />
              <ArabicTextAreaField label="الوصف (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={3} englishValue={editing.description ?? ''} />
              <ArabicTextField label="اسم الجهة (عربي)" value={editing.authority_nameAr ?? ''} onChange={(v) => setEditing({ ...editing, authority_nameAr: v })} englishValue={editing.authority_name ?? ''} />
              <ArabicTextField label="الدولة (عربي)" value={editing.countryAr ?? ''} onChange={(v) => setEditing({ ...editing, countryAr: v })} englishValue={editing.country ?? ''} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
