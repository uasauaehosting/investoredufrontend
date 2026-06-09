import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import FileUpload from '../../lib/FileUpload';
import { normalizeMediaUrl } from '../../lib/mediaUrl';
import {
  BENCHMARKING_AUTHORITIES,
  type BenchmarkingRecord,
  fromApiBenchmarkingRecord,
  toApiBenchmarkingPayload,
} from '../../lib/benchmarking';

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
  year: YEARS[0],
  title: '',
  description: '',
  fileUrl: '',
});

export default function BenchmarkingEditor() {
  const [items, setItems] = useState<(BenchmarkingRecord & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(BenchmarkingRecord & { id?: number }) | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await api.get('/benchmarking');
      if (Array.isArray(data)) {
        setItems(
          data.map((row: ApiBenchmarkingRecord) => ({
            id: row.id,
            ...fromApiBenchmarkingRecord(row),
          })),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title?.trim() || !editing.authority?.trim() || !editing.year?.trim()) {
      setError('Authority, year, and title are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = toApiBenchmarkingPayload(editing);
      if (editing.id) {
        await api.put(`/benchmarking/${editing.id}`, payload);
      } else {
        await api.post('/benchmarking', payload);
      }
      setEditing(null);
      load();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to save record.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this benchmarking record?')) return;
    await api.delete(`/benchmarking/${id}`);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Members&apos; Benchmarking</h2>
          <p className="text-xs text-gray-400">Manage records for /inclusion/index/benchmarking</p>
        </div>
        <button onClick={() => setEditing(empty())} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Record
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 mb-5 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Authority *</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={editing.authority}
              onChange={(e) => setEditing({ ...editing, authority: e.target.value })}
            >
              {BENCHMARKING_AUTHORITIES.filter((a) => a !== 'All Authorities').map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Year *</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={editing.year}
              onChange={(e) => setEditing({ ...editing, year: e.target.value })}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <input
            className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
            placeholder="Title *"
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
          <textarea
            className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 min-h-[60px]"
            placeholder="Details (shown when no file is attached)"
            value={editing.description ?? ''}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
          />
          <div className="sm:col-span-2">
            <FileUpload
              label="Document"
              value={editing.fileUrl ?? ''}
              onChange={(url) => setEditing({ ...editing, fileUrl: url })}
              hint="Optional PDF or document link"
            />
          </div>
          {error && <p className="text-red-500 text-xs sm:col-span-2">{error}</p>}
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setError(null); }} className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-400">{item.authority} · {item.year}</p>
              {item.fileUrl && (
                <a href={normalizeMediaUrl(item.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#009900] hover:underline">
                  View file
                </a>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(item)} className="p-1.5 text-gray-400 hover:text-[#009900]"><Pencil size={14} /></button>
              <button onClick={() => remove(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No benchmarking records yet.</p>}
      </div>
    </div>
  );
}
