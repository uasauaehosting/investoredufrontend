import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { api } from '../../lib/api';
import FileUpload from '../../lib/FileUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface Publication {
  id: number;
  title: string; title_ar?: string | null;
  description: string | null; description_ar?: string | null;
  authority_name: string;
  category: string;
  file_url: string | null;
  date_published: string | null;
}

const CATEGORIES = ['Brochure', 'Code', 'General', 'Guide', 'Others', 'Report', 'Study'];

const CATEGORY_COLORS: Record<string, string> = {
  Brochure: 'bg-pink-100 text-pink-700',
  Code:     'bg-indigo-100 text-indigo-700',
  General:  'bg-gray-100 text-gray-600',
  Guide:    'bg-blue-100 text-blue-700',
  Others:   'bg-gray-100 text-gray-600',
  Report:   'bg-amber-100 text-amber-700',
  Study:    'bg-purple-100 text-purple-700',
};

const empty = (): Omit<Publication, 'id'> => ({
  title: '', title_ar: '', description: '', description_ar: '',
  authority_name: '', category: 'General', file_url: '', date_published: null,
});

export default function PublicationsEditor() {
  const [items, setItems]   = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Publication> | null>(null);
  const [saving, setSaving]  = useState(false);
  const [error, setError]    = useState<string | null>(null);

  const load = async () => {
    try { setItems(normalizeMediaFieldsDeep(await api.get('/publications?is_active=all') ?? [])); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'publications', onError: load });

  const openNew  = () => { setError(null); setEditing(empty()); };
  const openEdit = (p: Publication) => { setError(null); setEditing(normalizeMediaFieldsDeep({ ...p })); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        ...editing,
        title_ar: editing.title_ar?.trim() || null,
        description_ar: editing.description_ar?.trim() || null,
      });
      editing.id ? await api.put(`/publications/${editing.id}`, payload)
                 : await api.post('/publications', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this publication?')) return;
    await api.delete(`/publications/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading publications…</div>;

  return (
    <div>
      <SectionHeader
        title="Publications"
        description="Member publications at /education/members-activities/publications. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Publication</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<FileText size={40} strokeWidth={1.5} />} title="No publications yet"
          description="Add member publications, guides, reports and brochures."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Publication</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id}
              onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                <FileText size={15} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 truncate">{item.authority_name}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}`}>
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

      <EditorDrawer open={!!editing} onClose={cancel}
        title={editing?.id ? 'Edit Publication' : 'New Publication'} subtitle="Member publications"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}>
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
                  <label className="block text-xs font-medium text-gray-500 mb-1">Authority</label>
                  <input type="text" value={editing.authority_name ?? ''} onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={editing.category ?? 'General'} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <FileUpload label="Publication File (PDF/Doc)" value={editing.file_url ?? ''}
                onChange={(url) => setEditing({ ...editing, file_url: url })}
                hint="Upload a PDF or document for this publication" />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="العنوان (عربي)" value={editing.title_ar ?? ''} onChange={(v) => setEditing({ ...editing, title_ar: v })} englishValue={editing.title ?? ''} />
              <ArabicTextAreaField label="الوصف (عربي)" value={editing.description_ar ?? ''} onChange={(v) => setEditing({ ...editing, description_ar: v })} rows={3} englishValue={editing.description ?? ''} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
