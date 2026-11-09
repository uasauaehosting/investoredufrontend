import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { ArabicSectionDivider, ArabicTextField, MediaPreview, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

export interface Slide {
  id: number;
  title: string;
  titleAr?: string | null;
  subtitle: string | null;
  subtitleAr?: string | null;
  image_url: string | null;
  cta_text: string | null;
  cta_textAr?: string | null;
  cta_href: string | null;
  display_order: number;
  is_active: boolean;
}

const empty: Omit<Slide, 'id'> = {
  title: '', titleAr: '', subtitle: '', subtitleAr: '',
  image_url: '', cta_text: 'Learn More', cta_textAr: '',
  cta_href: '#', display_order: 0, is_active: true,
};

function Field({ label, value, onChange, type = 'text', hint }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function SlidesEditor() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Slide> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try { setSlides(normalizeMediaFieldsDeep(await api.get('/home/slides') ?? [])); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items: slides, setItems: setSlides, resource: 'slides', onError: load });

  const openNew  = () => { setError(null); setEditing({ ...empty, display_order: slides.length + 1 }); };
  const openEdit = (s: Slide) => { setError(null); setEditing(normalizeMediaFieldsDeep({ ...s })); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        ...editing,
        titleAr: editing.titleAr?.trim() || null,
        subtitleAr: editing.subtitleAr?.trim() || null,
        cta_textAr: editing.cta_textAr?.trim() || null,
      });
      editing.id ? await api.put(`/home/slides/${editing.id}`, payload)
                 : await api.post('/home/slides', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this slide?')) return;
    await api.delete(`/home/slides/${id}`); load();
  };

  const toggleActive = async (s: Slide) => {
    await api.put(`/home/slides/${s.id}`, { is_active: !s.is_active }); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading slides…</div>;

  return (
    <div>
      <SectionHeader
        title="Hero Slides"
        description="Manage the homepage carousel. Drag the grip handle to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} /> Add Slide
          </button>
        }
      />

      {slides.length === 0 ? (
        <EmptyState
          icon={<ImageIcon size={40} strokeWidth={1.5} />}
          title="No slides yet"
          description="Add your first hero slide to display on the homepage carousel."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Slide</button>}
        />
      ) : (
        <div className="space-y-2">
          {slides.map((s, index) => (
            <div
              key={s.id}
              onDragOver={sortable.handleDragOver}
              onDrop={(e) => sortable.handleDrop(e, s.id)}
              className={sortable.rowClassName(s.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}
            >
              <SortableGrip id={s.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              {s.image_url
                ? <MediaPreview url={s.image_url} className="w-16 h-11 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                : <div className="w-16 h-11 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><ImageIcon size={16} className="text-gray-300" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{s.title || <span className="italic text-gray-400">Untitled</span>}</p>
                <p className="text-xs text-gray-400 truncate">{s.subtitle}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {s.is_active ? 'Active' : 'Hidden'}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(s)} title={s.is_active ? 'Deactivate' : 'Activate'}
                  className="icon-btn">
                  {s.is_active ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} className="text-gray-400" />}
                </button>
                <button onClick={() => openEdit(s)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(s.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer
        open={!!editing}
        onClose={cancel}
        title={editing?.id ? 'Edit Slide' : 'New Slide'}
        subtitle="Homepage carousel"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}
      >
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <ImageUpload value={editing.image_url ?? ''} onChange={(url) => setEditing({ ...editing, image_url: url })} label="Slide Background Image" />
              <Field label="Title *" value={editing.title ?? ''} onChange={(v) => setEditing({ ...editing, title: v })} />
              <Field label="Subtitle" value={editing.subtitle ?? ''} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="CTA Button Text" value={editing.cta_text ?? ''} onChange={(v) => setEditing({ ...editing, cta_text: v })} />
                <Field label="CTA Link" value={editing.cta_href ?? ''} onChange={(v) => setEditing({ ...editing, cta_href: v })} />
              </div>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} englishValue={editing.title ?? ''} />
              <ArabicTextField label="العنوان الفرعي (عربي)" value={editing.subtitleAr ?? ''} onChange={(v) => setEditing({ ...editing, subtitleAr: v })} englishValue={editing.subtitle ?? ''} />
              <ArabicTextField label="نص الزر (عربي)" value={editing.cta_textAr ?? ''} onChange={(v) => setEditing({ ...editing, cta_textAr: v })} englishValue={editing.cta_text ?? ''} />
            </ArabicFieldsGroup>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input type="checkbox" id="is_active_slide" checked={editing.is_active ?? true}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="rounded border-gray-300" />
              <label htmlFor="is_active_slide" className="text-sm text-gray-600 cursor-pointer">Active (visible on site)</label>
            </div>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
