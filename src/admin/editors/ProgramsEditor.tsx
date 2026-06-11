import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import {
  PROGRAM_FILTER_GROUPS,
  PROGRAM_MEMBERS,
} from '../../lib/programFilters';
import { ArabicSectionDivider, ArabicTextField, StringListEditor } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';

interface Program {
  id: number;
  member_name: string;
  member_name_ar?: string | null;
  general_info: string[];
  general_info_ar?: string[];
  education_materials: string[];
  education_materials_ar?: string[];
  specific_materials: string[];
  specific_materials_ar?: string[];
  assisting_groups: string[];
  assisting_groups_ar?: string[];
  evaluation: string[];
  evaluation_ar?: string[];
  successful_programs: string[];
  successful_programs_ar?: string[];
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

const AR_FIELD_KEYS = [
  'general_info_ar',
  'education_materials_ar',
  'specific_materials_ar',
  'assisting_groups_ar',
  'evaluation_ar',
  'successful_programs_ar',
] as const;

type FieldKey = (typeof FIELD_KEYS)[number];
type ArFieldKey = (typeof AR_FIELD_KEYS)[number];

const GROUP_FIELD_MAP: Record<string, FieldKey> = {
  generalInfo: 'general_info',
  educationMaterials: 'education_materials',
  specificMaterials: 'specific_materials',
  assistingGroups: 'assisting_groups',
  evaluation: 'evaluation',
  successfulPrograms: 'successful_programs',
};

const GROUP_AR_FIELD_MAP: Record<string, ArFieldKey> = {
  generalInfo: 'general_info_ar',
  educationMaterials: 'education_materials_ar',
  specificMaterials: 'specific_materials_ar',
  assistingGroups: 'assisting_groups_ar',
  evaluation: 'evaluation_ar',
  successfulPrograms: 'successful_programs_ar',
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
    member_name_ar: raw.member_name_ar != null ? String(raw.member_name_ar) : '',
    general_info: parseArray(raw.general_info),
    general_info_ar: parseArray(raw.general_info_ar),
    education_materials: parseArray(raw.education_materials),
    education_materials_ar: parseArray(raw.education_materials_ar),
    specific_materials: parseArray(raw.specific_materials),
    specific_materials_ar: parseArray(raw.specific_materials_ar),
    assisting_groups: parseArray(raw.assisting_groups),
    assisting_groups_ar: parseArray(raw.assisting_groups_ar),
    evaluation: parseArray(raw.evaluation),
    evaluation_ar: parseArray(raw.evaluation_ar),
    successful_programs: parseArray(raw.successful_programs),
    successful_programs_ar: parseArray(raw.successful_programs_ar),
    is_active: raw.is_active !== false && raw.is_active !== 0,
  };
}

const empty = (): ProgramForm => ({
  member_name: '',
  member_name_ar: '',
  general_info: [],
  general_info_ar: [],
  education_materials: [],
  education_materials_ar: [],
  specific_materials: [],
  specific_materials_ar: [],
  assisting_groups: [],
  assisting_groups_ar: [],
  evaluation: [],
  evaluation_ar: [],
  successful_programs: [],
  successful_programs_ar: [],
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

  const sortable = useSortableReorder({
    items,
    setItems,
    resource: 'programs',
    onError: load,
  });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = {
        member_name: editing.member_name?.trim() || '',
        member_name_ar: editing.member_name_ar?.trim() || null,
        general_info: editing.general_info,
        general_info_ar: editing.general_info_ar?.filter((v) => v.trim()) ?? [],
        education_materials: editing.education_materials,
        education_materials_ar: editing.education_materials_ar?.filter((v) => v.trim()) ?? [],
        specific_materials: editing.specific_materials,
        specific_materials_ar: editing.specific_materials_ar?.filter((v) => v.trim()) ?? [],
        assisting_groups: editing.assisting_groups,
        assisting_groups_ar: editing.assisting_groups_ar?.filter((v) => v.trim()) ?? [],
        evaluation: editing.evaluation,
        evaluation_ar: editing.evaluation_ar?.filter((v) => v.trim()) ?? [],
        successful_programs: editing.successful_programs,
        successful_programs_ar: editing.successful_programs_ar?.filter((v) => v.trim()) ?? [],
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

  const setArField = (key: ArFieldKey, values: string[]) => {
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
          <SortableReorderHint reordering={sortable.reordering} />
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

          <ArabicSectionDivider />
          <ArabicTextField
            label="اسم العضو (عربي)"
            value={editing.member_name_ar ?? ''}
            onChange={(v) => setEditing({ ...editing, member_name_ar: v })}
          />

          {PROGRAM_FILTER_GROUPS.map((group) => {
            const arFieldKey = GROUP_AR_FIELD_MAP[group.name];
            return (
              <div key={`${group.name}-ar`} dir="rtl">
                <StringListEditor
                  label={`${group.title} (عربي)`}
                  items={editing[arFieldKey]?.length ? editing[arFieldKey] : ['']}
                  onChange={(items) => setArField(arFieldKey, items)}
                  placeholder="أدخل النص بالعربية..."
                  addLabel="إضافة عنصر"
                />
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
        {items.map((item, index) => {
          const totalTags = FIELD_KEYS.reduce((sum, key) => sum + item[key].length, 0);
          return (
            <div
              key={item.id}
              onDragOver={sortable.handleDragOver}
              onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(
                item.id,
                'bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3',
              )}
            >
              <SortableGrip
                id={item.id}
                index={index}
                onDragStart={sortable.handleDragStart}
                onDragEnd={sortable.clearDragging}
              />
              <div className="min-w-0 flex-1">
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
