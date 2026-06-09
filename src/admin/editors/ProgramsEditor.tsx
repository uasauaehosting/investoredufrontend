import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import {
  PROGRAM_FILTER_GROUPS,
  PROGRAM_MEMBERS,
} from '../../lib/programFilters';

interface Program {
  id: number;
  member_name: string;
  general_info: string[];
  education_materials: string[];
  specific_materials: string[];
  assisting_groups: string[];
  evaluation: string[];
  successful_programs: string[];
  is_active: boolean;
}

type ProgramForm = Omit<Program, 'id'> & { id?: number };

const FIELD_KEYS = [
  'general_info',
  'education_materials',
  'specific_materials',
  'assisting_groups',
  'evaluation',
  'successful_programs',
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];

const GROUP_FIELD_MAP: Record<string, FieldKey> = {
  generalInfo: 'general_info',
  educationMaterials: 'education_materials',
  specificMaterials: 'specific_materials',
  assistingGroups: 'assisting_groups',
  evaluation: 'evaluation',
  successfulPrograms: 'successful_programs',
};

function parseArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeProgram(raw: Record<string, unknown>): Program {
  return {
    id: raw.id as number,
    member_name: String(raw.member_name ?? ''),
    general_info: parseArray(raw.general_info),
    education_materials: parseArray(raw.education_materials),
    specific_materials: parseArray(raw.specific_materials),
    assisting_groups: parseArray(raw.assisting_groups),
    evaluation: parseArray(raw.evaluation),
    successful_programs: parseArray(raw.successful_programs),
    is_active: raw.is_active !== false && raw.is_active !== 0,
  };
}

const empty = (): ProgramForm => ({
  member_name: '',
  general_info: [],
  education_materials: [],
  specific_materials: [],
  assisting_groups: [],
  evaluation: [],
  successful_programs: [],
  is_active: true,
});

function toggleLabel(values: string[], label: string): string[] {
  return values.includes(label) ? values.filter((v) => v !== label) : [...values, label];
}

export default function ProgramsEditor() {
  const [items, setItems] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProgramForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/programs');
      const raw = res?.data ?? res ?? [];
      setItems(Array.isArray(raw) ? raw.map(normalizeProgram) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing?.member_name?.trim()) return;
    setSaving(true);
    try {
      const payload = {
        member_name: editing.member_name,
        general_info: editing.general_info,
        education_materials: editing.education_materials,
        specific_materials: editing.specific_materials,
        assisting_groups: editing.assisting_groups,
        evaluation: editing.evaluation,
        successful_programs: editing.successful_programs,
        is_active: editing.is_active,
      };
      if (editing.id) {
        await api.put(`/programs/${editing.id}`, payload);
      } else {
        await api.post('/programs', payload);
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
    if (!confirm('Delete this program entry?')) return;
    await api.delete(`/programs/${id}`);
    load();
  };

  const setField = (key: FieldKey, values: string[]) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: values });
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading programs...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Programs ({items.length})</h2>
          <p className="text-xs text-gray-400">Manage member investor education program profiles</p>
        </div>
        <button onClick={() => setEditing(empty())} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Program
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 mb-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Member Authority</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={editing.member_name}
                onChange={(e) => setEditing({ ...editing, member_name: e.target.value })}
              >
                <option value="">Select member...</option>
                {PROGRAM_MEMBERS.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              />
              Active (visible on public Programs page)
            </label>
          </div>

          {PROGRAM_FILTER_GROUPS.map((group) => {
            const fieldKey = GROUP_FIELD_MAP[group.name];
            const selected = editing[fieldKey] ?? [];
            return (
              <div key={group.name}>
                <p className="text-sm font-bold text-[#009900] mb-2">{group.title}</p>
                <div className="grid sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                  {group.options.map((option) => (
                    <label key={option.value} className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 shrink-0"
                        checked={selected.includes(option.label)}
                        onChange={() => setField(fieldKey, toggleLabel(selected, option.label))}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-2 pt-1">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> Save
            </button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-4">
            No program entries yet. Add one or run the seed script to populate sample data.
          </p>
        )}
        {items.map((item) => {
          const totalTags = FIELD_KEYS.reduce((sum, key) => sum + item[key].length, 0);
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-800 line-clamp-1">{item.member_name}</p>
                <p className="text-xs text-gray-400">
                  {totalTags} categor{totalTags === 1 ? 'y' : 'ies'} selected
                  {!item.is_active && ' · Inactive'}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => setEditing(item)} className="p-1.5 text-gray-400 hover:text-[#009900]">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(item.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
