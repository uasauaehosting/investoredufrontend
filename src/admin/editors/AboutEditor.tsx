import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, AlignLeft, GripVertical } from 'lucide-react';
import { api } from '../../lib/api';
import {
  ArabicSectionDivider,
  ArabicFieldsGroup,
  EnglishFieldsGroup,
  ImageField,
  MediaPreview,
} from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import RichHtmlEditor from '../components/RichHtmlEditor';

// ── Types ─────────────────────────────────────────────────────────────────────

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
  title: '',
  titleAr: '',
  content: '',
  contentAr: '',
  imageUrl: '',
  order: 0,
  isActive: true,
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Strip HTML tags for a plain-text preview snippet */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AboutEditor() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AboutSection> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const sortable = useSortableReorder({
    items: sections,
    setItems: setSections,
    resource: 'about-sections',
    onError: load,
  });

  const openNew = () => {
    setError(null);
    setEditing({ ...emptySection(), order: sections.length + 1 });
  };

  const openEdit = (s: AboutSection) => {
    setError(null);
    setEditing({ ...s });
  };

  const cancel = () => {
    setEditing(null);
    setError(null);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.content?.trim()) {
      setError('Content (English) is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...editing,
        title: editing.title?.trim() || 'Section',
        titleAr: editing.titleAr?.trim() || null,
        contentAr: editing.contentAr?.trim() || null,
        imageUrl: editing.imageUrl?.trim() || null,
      };
      if (editing.id) {
        await api.put(`/about/sections/${editing.id}`, payload);
      } else {
        await api.post('/about/sections', {
          ...payload,
          order: editing.order ?? sections.length + 1,
          isActive: true,
        });
      }
      setEditing(null);
      load();
    } catch (err: any) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this paragraph block?')) return;
    await api.delete(`/about/sections/${id}`);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse p-4">Loading...</div>;

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">About Page</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage the paragraph blocks shown on the About page. The first block's image is used as the sidebar image.
          </p>
          <SortableReorderHint reordering={sortable.reordering} />
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5 flex-shrink-0">
          <Plus size={15} /> Add Paragraph
        </button>
      </div>

      {/* ── Edit / Create form ─────────────────────────────────────────────── */}
      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 space-y-5">
          <h3 className="font-semibold text-[#009900] text-sm">
            {editing.id ? 'Edit Paragraph Block' : 'New Paragraph Block'}
          </h3>

          {/* English fields */}
          <EnglishFieldsGroup>
            <div className="space-y-4">
              {/* Internal label (not shown on frontend) */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Internal label <span className="text-gray-400 font-normal">(for admin reference only)</span>
                </label>
                <input
                  type="text"
                  value={editing.title ?? ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="e.g. Introduction, Mission, Vision…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]"
                />
              </div>

              {/* Content */}
              <RichHtmlEditor
                label="Content (English) *"
                value={editing.content ?? ''}
                onChange={(v) => setEditing({ ...editing, content: v })}
                placeholder="Write paragraph content here…"
                minHeight={200}
              />

              {/* Image — only shown on the first block visually, but any block can have one */}
              <ImageField
                label="Sidebar Image (optional — used for the About page left panel)"
                value={editing.imageUrl ?? ''}
                onChange={(v) => setEditing({ ...editing, imageUrl: v })}
              />
            </div>
          </EnglishFieldsGroup>

          {/* Arabic fields */}
          <ArabicSectionDivider />
          <ArabicFieldsGroup>
            <div className="space-y-4">
              <RichHtmlEditor
                label="المحتوى (عربي)"
                value={editing.contentAr ?? ''}
                onChange={(v) => setEditing({ ...editing, contentAr: v })}
                placeholder="المحتوى بالعربية…"
                dir="rtl"
                minHeight={200}
              />
            </div>
          </ArabicFieldsGroup>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={cancel} className="btn-ghost flex items-center gap-1.5">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Paragraph list ──────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {sections.length === 0 && !editing && (
          <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
            <AlignLeft size={28} className="mx-auto mb-3 opacity-30" />
            No paragraph blocks yet. Click <strong>Add Paragraph</strong> to get started.
          </div>
        )}

        {sections.map((s, index) => {
          const preview = stripHtml(s.content);
          return (
            <div
              key={s.id}
              onDragOver={sortable.handleDragOver}
              onDrop={(e) => sortable.handleDrop(e, s.id)}
              className={sortable.rowClassName(
                s.id,
                'group flex items-start gap-3 bg-white border border-gray-200 hover:border-green-300 rounded-xl px-4 py-3 transition-colors',
              )}
            >
              {/* Drag handle */}
              <SortableGrip
                id={s.id}
                index={index}
                onDragStart={sortable.handleDragStart}
                onDragEnd={sortable.clearDragging}
              />

              {/* Block number badge */}
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-[11px] font-bold text-[#009900] mt-0.5">
                {index + 1}
              </div>

              {/* Image thumbnail */}
              {s.imageUrl && (
                <MediaPreview
                  url={s.imageUrl}
                  alt={s.title}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                />
              )}
              {!s.imageUrl && (
                <div className="w-16 h-12 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={14} className="text-gray-300" />
                </div>
              )}

              {/* Text preview */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {s.title || <span className="text-gray-400 italic">Untitled</span>}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">{preview || '—'}</p>
                {s.contentAr && (
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-medium">
                    AR ✓
                  </span>
                )}
              </div>

              {/* Actions — visible on hover */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => openEdit(s)}
                  className="icon-btn"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(s.id)}
                  className="icon-btn text-red-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Helper note ─────────────────────────────────────────────────────── */}
      {sections.length > 0 && (
        <p className="text-[11px] text-gray-400 text-center">
          Drag <GripVertical size={10} className="inline" /> to reorder blocks. The blocks appear in this order on the About page.
          {sections.some(s => s.imageUrl) && ' · The first block with an image is displayed in the left sidebar.'}
        </p>
      )}
    </div>
  );
}
