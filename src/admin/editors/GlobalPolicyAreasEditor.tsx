import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';
import { api } from '../../lib/api';
import { POLICY_CATEGORIES, POLICY_INSTITUTIONS } from '../../lib/globalPolicyFilters';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface PolicyArea {
  id: number;
  title: string; title_ar?: string | null;
  description: string; description_ar?: string | null;
  institution: string;
  category: string;
  fileUrl: string | null;
  isActive: boolean;
}

const empty = (): Omit<PolicyArea, 'id'> => ({
  title: '', title_ar: '', description: 'View Description', description_ar: '',
  institution: '', category: '', fileUrl: '', isActive: true,
});

function normalize(raw: Record<string, unknown>): PolicyArea {
  return {
    id: raw.id as number,
    title: String(raw.title ?? ''),
    title_ar: raw.title_ar != null ? String(raw.title_ar) : '',
    description: String(raw.description ?? 'View Description'),
    description_ar: raw.description_ar != null ? String(raw.description_ar) : '',
    institution: String(raw.institution ?? ''),
    category: String(raw.category ?? ''),
    fileUrl: (raw.fileUrl as string | null) ?? (raw.file_url as string | null) ?? '',
    isActive: raw.isActive !== false && raw.is_active !== false && raw.is_active !== 0,
  };
}

export default function GlobalPolicyAreasEditor() {
  const [items, setItems]     = useState<PolicyArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PolicyArea> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/global-policy-areas?is_active=all');
      setItems(Array.isArray(data) ? data.map((r) => normalize(r as Record<string, unknown>)) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'global-policy-areas', onError: load });

  const openNew  = () => { setError(null); setEditing(empty()); };
  const openEdit = (item: PolicyArea) => { setError(null); setEditing({ ...item }); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        title: editing.title?.trim() || '',
        title_ar: editing.title_ar?.trim() || null,
        description: editing.description || 'View Description',
        description_ar: editing.description_ar?.trim() || null,
        institution: editing.institution?.trim() || '',
        category: editing.category?.trim() || '',
        fileUrl: editing.fileUrl || null,
        isActive: editing.isActive !== false,
      };
      editing.id ? await api.put(`/global-policy-areas/${editing.id}`, payload)
                 : await api.post('/global-policy-areas', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    await api.delete(`/global-policy-areas/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading global policy areas…</div>;

  return (
    <div>
      <SectionHeader
        title={`Global Policy Areas (${items.length})`}
        description="OECD, AFI and other global financial inclusion policy resources. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Entry</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<Globe size={40} strokeWidth={1.5} />} title="No policy area entries yet"
          description="Add OECD, AFI and other global financial inclusion policy resources."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Entry</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id}
              onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Globe size={15} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">{item.institution} · {item.category}</p>
              </div>
              {!item.isActive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 flex-shrink-0">Inactive</span>}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer open={!!editing} onClose={cancel}
        title={editing?.id ? 'Edit Entry' : 'New Entry'} subtitle="Global Policy Areas"
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
                  <label className="block text-xs font-medium text-gray-500 mb-1">Institution</label>
                  <select value={editing.institution ?? ''} onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    <option value="">Select…</option>
                    {POLICY_INSTITUTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    <option value="">Select…</option>
                    {POLICY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL / File link</label>
                <input type="text" value={editing.fileUrl ?? ''} onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="rounded border-gray-300" />
                Active (visible on public page)
              </label>
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
