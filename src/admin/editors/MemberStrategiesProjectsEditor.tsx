import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { api } from '../../lib/api';
import { INCLUSION_CATEGORY_FILTERS, INCLUSION_MEMBER_FILTERS } from '../../lib/inclusionMembers';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface StrategyProject {
  id: number;
  title: string; titleAr?: string | null;
  description: string; descriptionAr?: string | null;
  authority_name: string;
  type: string;
  fileUrl: string | null;
  isActive: boolean;
}

const empty = (): Omit<StrategyProject, 'id'> => ({
  title: '', titleAr: '', description: 'View Description', descriptionAr: '',
  authority_name: '', type: 'Strategy', fileUrl: '', isActive: true,
});

function normalize(raw: Record<string, unknown>): StrategyProject {
  return {
    id: raw.id as number,
    title: String(raw.title ?? ''),
    titleAr: raw.titleAr != null ? String(raw.titleAr) : raw.title_ar != null ? String(raw.title_ar) : '',
    description: String(raw.description ?? 'View Description'),
    descriptionAr: raw.descriptionAr != null ? String(raw.descriptionAr) : raw.description_ar != null ? String(raw.description_ar) : '',
    authority_name: String(raw.authority_name ?? raw.memberName ?? ''),
    type: String(raw.type ?? 'Strategy'),
    fileUrl: (raw.fileUrl as string | null) ?? (raw.file_url as string | null) ?? '',
    isActive: raw.isActive !== false && raw.is_active !== false && raw.is_active !== 0,
  };
}

const TYPE_COLORS: Record<string, string> = {
  Strategy: 'bg-green-100 text-green-700',
  Project:  'bg-blue-100 text-blue-700',
};

export default function MemberStrategiesProjectsEditor() {
  const [items, setItems]     = useState<StrategyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<StrategyProject> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/investor-education/member-strategies-projects?is_active=all');
      setItems(Array.isArray(data) ? data.map((r) => normalize(r as Record<string, unknown>)) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'member-strategies-projects', onError: load });

  const openNew  = () => { setError(null); setEditing(empty()); };
  const openEdit = (item: StrategyProject) => { setError(null); setEditing({ ...item }); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        title: editing.title?.trim() || '',
        titleAr: editing.titleAr?.trim() || null,
        description: editing.description || 'View Description',
        descriptionAr: editing.descriptionAr?.trim() || null,
        authority_name: editing.authority_name?.trim() || '',
        type: editing.type ?? 'Strategy',
        fileUrl: editing.fileUrl || null,
        isActive: editing.isActive !== false,
      };
      editing.id
        ? await api.put(`/investor-education/member-strategies-projects/${editing.id}`, payload)
        : await api.post('/investor-education/member-strategies-projects', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    await api.delete(`/investor-education/member-strategies-projects/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading strategies & projects…</div>;

  return (
    <div>
      <SectionHeader
        title={`Strategies & Projects (${items.length})`}
        description="Financial inclusion strategies and projects at /inclusion/projects. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Entry</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} strokeWidth={1.5} />} title="No entries yet"
          description="Add member authority strategies and financial inclusion projects."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Entry</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id}
              onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <ClipboardList size={15} className="text-[#009900]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 truncate">{item.authority_name}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[item.type] ?? 'bg-gray-100 text-gray-600'}`}>{item.type}</span>
                {!item.isActive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Inactive</span>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer open={!!editing} onClose={cancel}
        title={editing?.id ? 'Edit Entry' : 'New Entry'} subtitle="Strategies & Projects"
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
                  <select value={editing.authority_name ?? ''} onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    <option value="">Select…</option>
                    {(INCLUSION_MEMBER_FILTERS as readonly string[]).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select value={editing.type ?? 'Strategy'} onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {(INCLUSION_CATEGORY_FILTERS as readonly string[]).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">File URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={editing.fileUrl ?? ''} onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="rounded border-gray-300" />
                Active (visible on site)
              </label>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} englishValue={editing.title ?? ''} />
              <ArabicTextAreaField label="الوصف (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={3} englishValue={editing.description ?? ''} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
