import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlignLeft, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { ArabicSectionDivider, ArabicFieldsGroup, EnglishFieldsGroup, ImageField, MediaPreview } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import RichHtmlEditor from '../components/RichHtmlEditor';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface AboutSection {
  id: number;
  title: string;
  titleAr?: string | null;
  content: string;
  contentAr?: string | null;
  imageUrl?: string | null;
  order: number;
  isActive: boolean;
}

const emptySection = (): Omit<AboutSection, 'id'> => ({
  title: '', titleAr: '', content: '', contentAr: '', imageUrl: '', order: 0, isActive: true,
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export default function AboutEditor() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AboutSection> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try { setSections(await api.get('/about/sections') ?? []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items: sections, setItems: setSections, resource: 'about-sections', onError: load });

  const openNew  = () => { setError(null); setEditing({ ...emptySection(), order: sections.length + 1 }); };
  const openEdit = (s: AboutSection) => { setError(null); setEditing({ ...s }); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.content?.trim()) { setError('English content is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        ...editing,
        title: editing.title?.trim() || 'Section',
        titleAr: editing.titleAr?.trim() || null,
        contentAr: editing.contentAr?.trim() || null,
        imageUrl: editing.imageUrl?.trim() || null,
      };
      editing.id
        ? await api.put(`/about/sections/${editing.id}`, payload)
        : await api.post('/about/sections', { ...payload, order: editing.order ?? sections.length + 1, isActive: true });
      setEditing(null); load();
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this paragraph block?')) return;
    await api.delete(`/about/sections/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading…</div>;

  return (
    <div>
      <SectionHeader
        title="About Page"
        description="Manage paragraph blocks on the About page. The first block's image is used as the sidebar image. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} /> Add Paragraph
          </button>
        }
      />

      {sections.length === 0 ? (
        <EmptyState
          icon={<AlignLeft size={40} strokeWidth={1.5} />}
          title="No paragraph blocks yet"
          description="Add content blocks to build the About page. Each block can have text and an optional image."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Paragraph</button>}
        />
      ) : (
        <div className="space-y-2">
          {sections.map((s, index) => {
            const preview = stripHtml(s.content);
            return (
              <div
                key={s.id}
                onDragOver={sortable.handleDragOver}
                onDrop={(e) => sortable.handleDrop(e, s.id)}
                className={sortable.rowClassName(s.id, 'flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}
              >
                <SortableGrip id={s.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-[11px] font-bold text-[#009900] mt-0.5">
                  {index + 1}
                </div>
                {s.imageUrl
                  ? <MediaPreview url={s.imageUrl} alt={s.title} className="w-16 h-11 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                  : <div className="w-16 h-11 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center flex-shrink-0"><ImageIcon size={14} className="text-gray-300" /></div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{s.title || <span className="italic text-gray-400">Untitled</span>}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{preview || '—'}</p>
                  {s.contentAr && (
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-medium">AR ✓</span>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(s)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => remove(s.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EditorDrawer
        open={!!editing}
        onClose={cancel}
        title={editing?.id ? 'Edit Paragraph Block' : 'New Paragraph Block'}
        subtitle="About page content"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}
      >
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Internal label <span className="text-gray-400 font-normal">(admin reference only)</span>
                </label>
                <input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Introduction, Mission, Vision…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <RichHtmlEditor label="Content (English) *" value={editing.content ?? ''}
                onChange={(v) => setEditing({ ...editing, content: v })}
                placeholder="Write paragraph content here…" minHeight={200} />
              <ImageField label="Sidebar Image (optional — first block's image used in left panel)"
                value={editing.imageUrl ?? ''} onChange={(v) => setEditing({ ...editing, imageUrl: v })} />
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <RichHtmlEditor label="المحتوى (عربي)" value={editing.contentAr ?? ''}
                onChange={(v) => setEditing({ ...editing, contentAr: v })}
                placeholder="المحتوى بالعربية…" dir="rtl" minHeight={200} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
