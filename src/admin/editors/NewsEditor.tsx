import { useState, useEffect, type DragEvent } from 'react';
import { Plus, Pencil, Trash2, Save, X, GripVertical } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import FileUpload from '../../lib/FileUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import RichHtmlEditor from '../components/RichHtmlEditor';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview } from './siteContent/FormFields';

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
  title: '',
  titleAr: '',
  image: '',
  category: 'News',
  date: new Date().toISOString().split('T')[0],
  excerpt: '',
  excerptAr: '',
  fullDetail: '',
  fullDetailAr: '',
  pdfFile: '',
  link: '',
};

export default function NewsEditor() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/home/news');
      setItems(normalizeMediaFieldsDeep(data ?? []));
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (n: NewsItem) => setEditing(normalizeMediaFieldsDeep({ ...n }));
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        ...editing,
        titleAr: editing.titleAr?.trim() || null,
        excerptAr: editing.excerptAr?.trim() || null,
        fullDetailAr: editing.fullDetailAr?.trim() || null,
        pdfFile: editing.pdfFile?.trim() || null,
      });
      if (editing.id) {
        await api.put(`/home/news/${editing.id}`, payload);
      } else {
        await api.post('/home/news', payload);
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

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: number) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, targetId: number) => {
    e.preventDefault();
    const sourceId = draggingId ?? Number(e.dataTransfer.getData('text/plain'));
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;

    const fromIndex = items.findIndex((item) => item.id === sourceId);
    const toIndex = items.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setItems(reordered);
    setReordering(true);
    try {
      const updated = await api.put('/home/news/reorder', { ids: reordered.map((item) => item.id) });
      setItems(normalizeMediaFieldsDeep(updated ?? reordered));
    } catch (err) {
      console.error('Failed to reorder news:', err);
      load();
    } finally {
      setReordering(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-400 text-sm animate-pulse">Loading news...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">News Items</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage homepage news cards. Drag the grip handle to set display order.
            {reordering && <span className="text-[#009900] ms-2">Saving order...</span>}
          </p>
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
            <div className="sm:col-span-2">
              <RichHtmlEditor
                label="Full Description (detail page)"
                value={editing.fullDetail ?? ''}
                onChange={(fullDetail) => setEditing({ ...editing, fullDetail })}
                placeholder="Full news article content..."
                hint="Shown on the news detail page. Use Visual mode for formatted text or HTML for raw markup."
                minHeight={280}
              />
            </div>
            <div className="sm:col-span-2">
              <FileUpload
                label="Document / PDF"
                value={editing.pdfFile ?? ''}
                onChange={(url) => setEditing({ ...editing, pdfFile: url })}
                accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                hint="Optional. When uploaded, a Download button appears on the news card and detail page."
              />
            </div>
            <ArabicSectionDivider />
            <div className="sm:col-span-2">
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} />
            </div>
            <div className="sm:col-span-2">
              <ArabicTextAreaField label="الملخص (عربي)" value={editing.excerptAr ?? ''} onChange={(v) => setEditing({ ...editing, excerptAr: v })} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <RichHtmlEditor
                label="الوصف الكامل (عربي)"
                value={editing.fullDetailAr ?? ''}
                onChange={(fullDetailAr) => setEditing({ ...editing, fullDetailAr })}
                dir="rtl"
                placeholder="المحتوى الكامل للخبر..."
                hint="يُعرض في صفحة تفاصيل الخبر."
                minHeight={280}
              />
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
        {items.map((item, index) => (
          <div
            key={item.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`flex items-center gap-3 bg-white border rounded-xl px-4 py-3 group transition-colors ${
              draggingId === item.id
                ? 'opacity-50 border-green-400'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={() => setDraggingId(null)}
              className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </div>
            <span className="text-[10px] font-semibold text-gray-400 w-4 text-center flex-shrink-0">{index + 1}</span>
            {item.image && <MediaPreview url={item.image} className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />}
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
