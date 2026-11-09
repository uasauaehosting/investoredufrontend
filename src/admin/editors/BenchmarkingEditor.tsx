import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { api } from '../../lib/api';
import FileUpload from '../../lib/FileUpload';
import { normalizeMediaUrl } from '../../lib/mediaUrl';
import {
  BENCHMARKING_AUTHORITIES,
  type BenchmarkingRecord,
  fromApiBenchmarkingRecord,
  toApiBenchmarkingPayload,
} from '../../lib/benchmarking';
import { ArabicSectionDivider, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface ApiBenchmarkingRecord {
  id: number;
  authorityName: string;
  year: string;
  indicator: string | null;
  value: string | null;
  data: Record<string, unknown> | null;
  isActive: boolean;
}

const YEARS = ['2018', '2017', '2016', '2015', '2014', '2013', '2012'];

const empty = (): BenchmarkingRecord & { id?: number } => ({
  authority: BENCHMARKING_AUTHORITIES[1],
  authorityNameAr: '',
  year: YEARS[0],
  title: '',
  indicatorAr: '',
  description: '',
  fileUrl: '',
});

export default function BenchmarkingEditor() {
  const [items, setItems]     = useState<(BenchmarkingRecord & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(BenchmarkingRecord & { id?: number }) | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/benchmarking');
      if (Array.isArray(data)) {
        setItems(data.map((row: ApiBenchmarkingRecord) => ({ id: row.id, ...fromApiBenchmarkingRecord(row) })));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'benchmarking', onError: load });

  const openNew  = () => { setError(null); setEditing(empty()); };
  const openEdit = (item: BenchmarkingRecord & { id: number }) => { setError(null); setEditing({ ...item }); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = toApiBenchmarkingPayload(editing);
      editing.id ? await api.put(`/benchmarking/${editing.id}`, payload)
                 : await api.post('/benchmarking', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save record.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this benchmarking record?')) return;
    await api.delete(`/benchmarking/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading…</div>;

  return (
    <div>
      <SectionHeader
        title="Members' Benchmarking"
        description="Benchmarking records for /inclusion/index/benchmarking. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Record</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<BarChart3 size={40} strokeWidth={1.5} />} title="No benchmarking records yet"
          description="Add authority benchmarking records by year. Each record can have an attached document."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Record</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id}
              onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#009900]/10 flex items-center justify-center">
                <BarChart3 size={15} className="text-[#009900]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400">{item.authority} · {item.year}</p>
              </div>
              {item.fileUrl && (
                <a href={normalizeMediaUrl(item.fileUrl)} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-[#009900] hover:underline flex-shrink-0 hidden sm:block">
                  View file
                </a>
              )}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer open={!!editing} onClose={cancel}
        title={editing?.id ? 'Edit Record' : 'New Record'} subtitle="Members' Benchmarking"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}>
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Authority *</label>
                  <select value={editing.authority} onChange={(e) => setEditing({ ...editing, authority: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {BENCHMARKING_AUTHORITIES.filter((a) => a !== 'All Authorities').map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Year *</label>
                  <select value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Details <span className="text-gray-400 font-normal">(shown when no file is attached)</span></label>
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <FileUpload label="Document (PDF / file)" value={editing.fileUrl ?? ''}
                onChange={(url) => setEditing({ ...editing, fileUrl: url })} hint="Optional — upload a PDF or document" />
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="اسم الجهة (عربي)" value={editing.authorityNameAr ?? ''}
                onChange={(v) => setEditing({ ...editing, authorityNameAr: v })} englishValue={editing.authority ?? ''} />
              <ArabicTextField label="العنوان (عربي)" value={editing.indicatorAr ?? ''}
                onChange={(v) => setEditing({ ...editing, indicatorAr: v })} englishValue={editing.title ?? ''} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
