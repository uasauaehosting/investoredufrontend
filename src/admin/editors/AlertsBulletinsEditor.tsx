import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';
import {
  ALERT_BULLETIN_AUTHORITIES,
  ALERT_BULLETIN_TYPES,
  ALERT_BULLETIN_YEARS,
  AlertBulletinType,
} from '../../lib/alertBulletinFilters';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface AlertBulletin {
  id: number;
  title: string; titleAr?: string | null;
  type: AlertBulletinType;
  description: string; descriptionAr?: string | null;
  content: string; contentAr?: string | null;
  authority_name: string;
  year: string;
  date_published: string | null;
  link: string;
  is_active: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  Alert:    'bg-red-100 text-red-700',
  Bulletin: 'bg-blue-100 text-blue-700',
};

const empty = (): Omit<AlertBulletin, 'id'> => ({
  title: '', titleAr: '', type: 'Alert',
  description: '', descriptionAr: '', content: '', contentAr: '',
  authority_name: ALERT_BULLETIN_AUTHORITIES[0],
  year: ALERT_BULLETIN_YEARS[0],
  date_published: new Date().toISOString().slice(0, 10),
  link: '', is_active: true,
});

function toDateInput(value: string | null, year: string): string {
  if (value) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return `${year}-01-01`;
}

export default function AlertsBulletinsEditor() {
  const [items, setItems]     = useState<AlertBulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AlertBulletin> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await api.get('/alerts-bulletins?is_active=all') ?? []); }
    catch (e) { console.error(e); setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'alerts-bulletins', onError: load });

  const openNew  = () => { setError(null); setEditing(empty()); };
  const openEdit = (item: AlertBulletin) => {
    setError(null);
    setEditing({ ...item, date_published: toDateInput(item.date_published, item.year) });
  };
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        title: editing.title?.trim() || '',
        titleAr: editing.titleAr?.trim() || null,
        type: editing.type ?? 'Alert',
        description: editing.description?.trim() ?? '',
        descriptionAr: editing.descriptionAr?.trim() || null,
        content: editing.content?.trim() ?? '',
        contentAr: editing.contentAr?.trim() || null,
        authority_name: editing.authority_name?.trim() || '',
        year: editing.year ?? ALERT_BULLETIN_YEARS[0],
        date_published: editing.date_published ?? `${editing.year}-01-01`,
        link: editing.link?.trim() ?? '',
        is_active: editing.is_active !== false,
      };
      editing.id ? await api.put(`/alerts-bulletins/${editing.id}`, payload)
                 : await api.post('/alerts-bulletins', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this alert/bulletin?')) return;
    await api.delete(`/alerts-bulletins/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading alerts & bulletins…</div>;

  return (
    <div>
      <SectionHeader
        title="Alerts & Bulletins"
        description="Manage alerts and bulletins at /education/alerts. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Item</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<AlertCircle size={40} strokeWidth={1.5} />} title="No alerts or bulletins yet"
          description="Add alerts and bulletins to display on the education alerts page."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Item</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id}
              onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                <AlertCircle size={15} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">{item.authority_name} · {item.year}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[item.type] ?? 'bg-gray-100 text-gray-600'}`}>{item.type}</span>
                {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Hidden</span>}
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
        title={editing?.id ? 'Edit Item' : 'New Alert / Bulletin'} subtitle="Alerts & Bulletins"
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
                  <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                  <select value={editing.type ?? 'Alert'} onChange={(e) => setEditing({ ...editing, type: e.target.value as AlertBulletinType })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {ALERT_BULLETIN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                  <select value={editing.year ?? ALERT_BULLETIN_YEARS[0]}
                    onChange={(e) => setEditing({ ...editing, year: e.target.value, date_published: toDateInput(editing.date_published ?? null, e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {ALERT_BULLETIN_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Authority</label>
                  <select value={editing.authority_name ?? ALERT_BULLETIN_AUTHORITIES[0]} onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {ALERT_BULLETIN_AUTHORITIES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date Published</label>
                  <input type="date" value={toDateInput(editing.date_published ?? null, editing.year ?? ALERT_BULLETIN_YEARS[0])}
                    onChange={(e) => setEditing({ ...editing, date_published: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
                <input type="text" value={editing.link ?? ''} onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea rows={2} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Content <span className="text-gray-400 font-normal">(HTML allowed)</span></label>
                <textarea rows={4} value={editing.content ?? ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={editing.is_active !== false} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="rounded border-gray-300" />
                Active (visible on site)
              </label>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} englishValue={editing.title ?? ''} />
              <ArabicTextAreaField label="الوصف (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={2} englishValue={editing.description ?? ''} />
              <ArabicTextAreaField label="المحتوى (عربي)" value={editing.contentAr ?? ''} onChange={(v) => setEditing({ ...editing, contentAr: v })} rows={4} hint="HTML allowed" englishValue={editing.content ?? ''} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
