import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import {
  INCLUSION_CATEGORY_FILTERS,
  INCLUSION_MEMBER_FILTERS,
} from '../../lib/inclusionMembers';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField } from './siteContent/FormFields';

interface StrategyProject {
  id: number;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  authority_name: string;
  type: string;
  fileUrl: string | null;
  isActive: boolean;
}

const empty = (): Omit<StrategyProject, 'id'> => ({
  title: '',
  titleAr: '',
  description: 'View Description',
  descriptionAr: '',
  authority_name: '',
  type: 'Strategy',
  fileUrl: '',
  isActive: true,
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

export default function MemberStrategiesProjectsEditor() {
  const [items, setItems] = useState<StrategyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<StrategyProject> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/investor-education/member-strategies-projects?is_active=all');
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
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        title: editing.title?.trim() || '',
        titleAr: editing.titleAr?.trim() || null,
        description: editing.description || 'View Description',
        descriptionAr: editing.descriptionAr?.trim() || null,
        authority_name: editing.authority_name?.trim() || '',
        type: editing.type || 'Strategy',
        fileUrl: editing.fileUrl || null,
        isActive: editing.isActive !== false,
      };
      if (editing.id) {
        await api.put(`/investor-education/member-strategies-projects/${editing.id}`, payload);
      } else {
        await api.post('/investor-education/member-strategies-projects', payload);
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
    if (!confirm('Delete this strategy/project entry?')) return;
    await api.delete(`/investor-education/member-strategies-projects/${id}`);
    load();
  };

  if (loading) {
    return <div className="text-gray-400 text-sm animate-pulse">Loading strategies & projects...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Members Strategies &amp; Projects ({items.length})
          </h2>
          <p className="text-xs text-gray-400">
            Manage financial inclusion strategies and reports by member authority
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
            className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
            value={editing.authority_name ?? ''}
            onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
          >
            <option value="">Select member authority...</option>
            {INCLUSION_MEMBER_FILTERS.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={editing.type ?? 'Strategy'}
            onChange={(e) => setEditing({ ...editing, type: e.target.value })}
          >
            {INCLUSION_CATEGORY_FILTERS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="border rounded-lg px-3 py-2 text-sm"
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
          <ArabicSectionDivider />
          <div className="sm:col-span-2">
            <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} />
          </div>
          <div className="sm:col-span-2">
            <ArabicTextAreaField label="الوصف (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={3} />
          </div>
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
                {item.authority_name} · {item.type}
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
