import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import { POLICY_CATEGORIES, POLICY_INSTITUTIONS } from '../../lib/globalPolicyFilters';

interface PolicyArea {
  id: number;
  title: string;
  description: string;
  institution: string;
  category: string;
  fileUrl: string | null;
  isActive: boolean;
}

const empty = (): Omit<PolicyArea, 'id'> => ({
  title: '',
  description: 'View Description',
  institution: '',
  category: '',
  fileUrl: '',
  isActive: true,
});

function normalize(raw: Record<string, unknown>): PolicyArea {
  return {
    id: raw.id as number,
    title: String(raw.title ?? ''),
    description: String(raw.description ?? 'View Description'),
    institution: String(raw.institution ?? ''),
    category: String(raw.category ?? ''),
    fileUrl: (raw.fileUrl as string | null) ?? (raw.file_url as string | null) ?? '',
    isActive: raw.isActive !== false && raw.is_active !== false && raw.is_active !== 0,
  };
}

export default function GlobalPolicyAreasEditor() {
  const [items, setItems] = useState<PolicyArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<PolicyArea> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/global-policy-areas?is_active=all');
      const rows = Array.isArray(data) ? data : [];
      setItems(rows.map((row) => normalize(row as Record<string, unknown>)));
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
    if (!editing?.title?.trim() || !editing?.institution?.trim() || !editing?.category?.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: editing.title,
        description: editing.description || 'View Description',
        institution: editing.institution,
        category: editing.category,
        fileUrl: editing.fileUrl || null,
        isActive: editing.isActive !== false,
      };
      if (editing.id) {
        await api.put(`/global-policy-areas/${editing.id}`, payload);
      } else {
        await api.post('/global-policy-areas', payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this global policy area entry?')) return;
    await api.delete(`/global-policy-areas/${id}`);
    load();
  };

  if (loading) {
    return <div className="text-gray-400 text-sm animate-pulse">Loading global policy areas...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Global Policy Areas ({items.length})
          </h2>
          <p className="text-xs text-gray-400">
            Manage OECD, AFI, and other global financial inclusion policy resources
          </p>
        </div>
        <button onClick={() => setEditing(empty())} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Entry
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 mb-5 grid sm:grid-cols-2 gap-3">
          <input
            className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
            placeholder="Title"
            value={editing.title ?? ''}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={editing.institution ?? ''}
            onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
          >
            <option value="">Select institution...</option>
            {POLICY_INSTITUTIONS.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={editing.category ?? ''}
            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
          >
            <option value="">Select category...</option>
            {POLICY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
            placeholder="URL / File link"
            value={editing.fileUrl ?? ''}
            onChange={(e) => setEditing({ ...editing, fileUrl: e.target.value })}
          />
          <textarea
            className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 min-h-[60px]"
            placeholder="Description"
            value={editing.description ?? ''}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
            <input
              type="checkbox"
              checked={editing.isActive !== false}
              onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
            />
            Active (visible on public page)
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-4">
            No entries yet. Add one or run the seed script to populate legacy data.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-400">
                {item.institution} · {item.category}
                {!item.isActive && ' · Inactive'}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setEditing(item)}
                className="p-1.5 text-gray-400 hover:text-[#009900]"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => remove(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
