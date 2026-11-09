import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Newspaper } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import FileUpload from '../../lib/FileUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import RichHtmlEditor from '../components/RichHtmlEditor';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

const CATEGORIES = ['News', 'Publication', 'Event'];

export interface NewsItem {
  id: number;
  title: string;
  titleAr?: string | null;
  image: string | null;
  category: string;
  date: string | null;
  excerpt: string | null;
  excerptAr?: string | null;
  fullDetail?: string | null;
  fullDetailAr?: string | null;
  pdfFile?: string | null;
  displayOrder?: number;
  link?: string;
}

const empty: Omit<NewsItem, 'id'> = {
  title: '', titleAr: '', image: '', category: 'News',
  date: new Date().toISOString().split('T')[0],
  excerpt: '', excerptAr: '', fullDetail: '', fullDetailAr: '', pdfFile: '', link: '',
};

const CATEGORY_COLORS: Record<string, string> = {
  News:        'bg-blue-100 text-blue-700',
  Publication: 'bg-purple-100 text-purple-700',
  Event:       'bg-amber-100 text-amber-700',
};

export default function NewsEditor() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try { setItems(normalizeMediaFieldsDeep(await api.get('/home/news') ?? [])); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'news', onError: load });

  const openNew  = () => { setError(null); setEditing({ ...empty }); };
  const openEdit = (n: NewsItem) => { setError(null); setEditing(normalizeMediaFieldsDeep({ ...n })); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        ...editing,
        titleAr: editing.titleAr?.trim() || null,
        excerptAr: editing.excerptAr?.trim() || null,
        fullDetailAr: editing.fullDetailAr?.trim() || null,
        pdfFile: editing.pdfFile?.trim() || null,
      });
      editing.id ? await api.put(`/home/news/${editing.id}`, payload)
                 : await api.post('/home/news', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this news item?')) return;
    await api.delete(`/home/news/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading news…</div>;

  return (
    <div>
      <SectionHeader
        title="News & Events"
        description="Manage news articles, publications and events. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} /> Add News
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={<Newspaper size={40} strokeWidth={1.5} />}
          title="No news items yet"
          description="Add articles, publications or events to display on the homepage."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add News</button>}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              onDragOver={sortable.handleDragOver}
              onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}
            >
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              {item.image
                ? <MediaPreview url={item.image} className="w-16 h-11 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                : <div className="w-16 h-11 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Newspaper size={16} className="text-gray-300" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {item.category}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer
        open={!!editing}
        onClose={cancel}
        title={editing?.id ? 'Edit News Item' : 'New News Item'}
        subtitle="Homepage news & events"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}
      >
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                <input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={editing.category ?? 'News'} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <input type="date" value={editing.date ?? ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
                </div>
              </div>
              <ImageUpload value={editing.image ?? ''} onChange={(url) => setEditing({ ...editing, image: url })} label="Cover Image" />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">External Link (optional)</label>
                <input type="text" value={editing.link ?? ''} onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Excerpt / Summary</label>
                <textarea rows={3} value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <RichHtmlEditor label="Full Article (detail page)" value={editing.fullDetail ?? ''}
                onChange={(v) => setEditing({ ...editing, fullDetail: v })}
                placeholder="Full article content…" hint="Shown on the news detail page." minHeight={240} />
              <FileUpload label="Attachment / PDF" value={editing.pdfFile ?? ''} onChange={(url) => setEditing({ ...editing, pdfFile: url })}
                accept=".pdf,.doc,.docx" hint="Optional — shows a Download button on the card." />
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} englishValue={editing.title ?? ''} />
              <ArabicTextAreaField label="الملخص (عربي)" value={editing.excerptAr ?? ''} onChange={(v) => setEditing({ ...editing, excerptAr: v })} rows={3} englishValue={editing.excerpt ?? ''} />
              <RichHtmlEditor label="المقال الكامل (عربي)" value={editing.fullDetailAr ?? ''}
                onChange={(v) => setEditing({ ...editing, fullDetailAr: v })}
                dir="rtl" placeholder="المحتوى الكامل بالعربية…" minHeight={240} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
