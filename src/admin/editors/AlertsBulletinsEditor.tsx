import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import {
  ALERT_BULLETIN_AUTHORITIES,
  ALERT_BULLETIN_TYPES,
  ALERT_BULLETIN_YEARS,
  AlertBulletinType,
} from '../../lib/alertBulletinFilters';

interface AlertBulletin {
  id: number;
  title: string;
  type: AlertBulletinType;
  description: string;
  content: string;
  authority_name: string;
  year: string;
  date_published: string | null;
  link: string;
  is_active: boolean;
}

const empty = (): Omit<AlertBulletin, 'id'> => ({
  title: '',
  type: 'Alert',
  description: '',
  content: '',
  authority_name: ALERT_BULLETIN_AUTHORITIES[0],
  year: ALERT_BULLETIN_YEARS[0],
  date_published: new Date().toISOString().slice(0, 10),
  link: '',
  is_active: true,
});

function toDateInput(value: string | null, year: string): string {
  if (value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }
  return `${year}-01-01`;
}

export default function AlertsBulletinsEditor() {
  const [items, setItems] = useState<AlertBulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<AlertBulletin> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/alerts-bulletins?is_active=all');
      setItems(data ?? []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title?.trim()) {
      setError('Title is required.');
      return;
    }
    if (!editing.authority_name?.trim()) {
      setError('Authority is required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: editing.title.trim(),
        type: editing.type ?? 'Alert',
        description: editing.description?.trim() ?? '',
        content: editing.content?.trim() ?? '',
        authority_name: editing.authority_name,
        year: editing.year ?? ALERT_BULLETIN_YEARS[0],
        date_published: editing.date_published ?? `${editing.year}-01-01`,
        link: editing.link?.trim() ?? '',
        is_active: editing.is_active !== false,
      };

      if (editing.id) {
        await api.put(`/alerts-bulletins/${editing.id}`, payload);
      } else {
        await api.post('/alerts-bulletins', payload);
      }
      setEditing(null);
      load();
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this alert/bulletin?')) return;
    try {
      await api.delete(`/alerts-bulletins/${id}`);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm animate-pulse py-8">Loading alerts & bulletins...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Alerts & Bulletins</h2>
          <p className="text-xs text-gray-400">
            Manage alerts and bulletins shown on the public Alerts & Bulletins page
          </p>
        </div>
        <button onClick={() => setEditing(empty())} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Item
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 mb-5 space-y-3">
          <h3 className="font-semibold text-[#009900] text-sm">
            {editing.id ? 'Edit Item' : 'New Item'}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
              placeholder="Title *"
              value={editing.title ?? ''}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={editing.type ?? 'Alert'}
              onChange={(e) => setEditing({ ...editing, type: e.target.value as AlertBulletinType })}
            >
              {ALERT_BULLETIN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={editing.authority_name ?? ALERT_BULLETIN_AUTHORITIES[0]}
              onChange={(e) => setEditing({ ...editing, authority_name: e.target.value })}
            >
              {ALERT_BULLETIN_AUTHORITIES.map((authority) => (
                <option key={authority} value={authority}>
                  {authority}
                </option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={editing.year ?? ALERT_BULLETIN_YEARS[0]}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  year: e.target.value,
                  date_published: toDateInput(editing.date_published ?? null, e.target.value),
                })
              }
            >
              {ALERT_BULLETIN_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm"
              value={toDateInput(editing.date_published ?? null, editing.year ?? ALERT_BULLETIN_YEARS[0])}
              onChange={(e) => setEditing({ ...editing, date_published: e.target.value })}
            />
            <input
              className="border rounded-lg px-3 py-2 text-sm sm:col-span-2"
              placeholder="Link URL"
              value={editing.link ?? ''}
              onChange={(e) => setEditing({ ...editing, link: e.target.value })}
            />
            <textarea
              className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 min-h-[60px]"
              placeholder="Description"
              value={editing.description ?? ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
            <textarea
              className="border rounded-lg px-3 py-2 text-sm sm:col-span-2 min-h-[80px] font-mono"
              placeholder="Content (HTML allowed)"
              value={editing.content ?? ''}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
              <input
                type="checkbox"
                checked={editing.is_active !== false}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                className="rounded border-gray-300"
              />
              Active (visible on site)
            </label>
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(null);
                setError(null);
              }}
              className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.title}</p>
              <p className="text-xs text-gray-400">
                {item.type} · {item.authority_name} · {item.year}
                {!item.is_active && ' · Hidden'}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() =>
                  setEditing({
                    ...item,
                    date_published: toDateInput(item.date_published, item.year),
                  })
                }
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
        {items.length === 0 && (
          <p className="text-sm text-gray-400 py-8 text-center">No alerts or bulletins yet.</p>
        )}
      </div>
    </div>
  );
}
