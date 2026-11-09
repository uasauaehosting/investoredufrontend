import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { api } from '../../lib/api';
import { PROGRAM_FILTER_GROUPS, PROGRAM_MEMBERS } from '../../lib/programFilters';
import { ArabicSectionDivider, ArabicTextField, StringListEditor, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface Program {
  id: number;
  member_name: string; member_name_ar?: string | null;
  general_info: string[];           general_info_ar?: string[];
  education_materials: string[];    education_materials_ar?: string[];
  specific_materials: string[];     specific_materials_ar?: string[];
  assisting_groups: string[];       assisting_groups_ar?: string[];
  evaluation: string[];             evaluation_ar?: string[];
  successful_programs: string[];    successful_programs_ar?: string[];
  is_active: boolean;
}

type ProgramForm = Omit<Program, 'id'> & { id?: number };

const FIELD_KEYS = [
  'general_info', 'education_materials', 'specific_materials',
  'assisting_groups', 'evaluation', 'successful_programs',
] as const;

const AR_FIELD_KEYS = [
  'general_info_ar', 'education_materials_ar', 'specific_materials_ar',
  'assisting_groups_ar', 'evaluation_ar', 'successful_programs_ar',
] as const;

type FieldKey   = (typeof FIELD_KEYS)[number];
type ArFieldKey = (typeof AR_FIELD_KEYS)[number];

const GROUP_FIELD_MAP: Record<string, FieldKey> = {
  generalInfo: 'general_info', educationMaterials: 'education_materials',
  specificMaterials: 'specific_materials', assistingGroups: 'assisting_groups',
  evaluation: 'evaluation', successfulPrograms: 'successful_programs',
};
const GROUP_AR_FIELD_MAP: Record<string, ArFieldKey> = {
  generalInfo: 'general_info_ar', educationMaterials: 'education_materials_ar',
  specificMaterials: 'specific_materials_ar', assistingGroups: 'assisting_groups_ar',
  evaluation: 'evaluation_ar', successfulPrograms: 'successful_programs_ar',
};

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

function normalize(raw: Record<string, unknown>): Program {
  return {
    id: raw.id as number,
    member_name: String(raw.member_name ?? ''),
    member_name_ar: raw.member_name_ar != null ? String(raw.member_name_ar) : '',
    general_info: parseArray(raw.general_info),           general_info_ar: parseArray(raw.general_info_ar),
    education_materials: parseArray(raw.education_materials), education_materials_ar: parseArray(raw.education_materials_ar),
    specific_materials: parseArray(raw.specific_materials),  specific_materials_ar: parseArray(raw.specific_materials_ar),
    assisting_groups: parseArray(raw.assisting_groups),     assisting_groups_ar: parseArray(raw.assisting_groups_ar),
    evaluation: parseArray(raw.evaluation),               evaluation_ar: parseArray(raw.evaluation_ar),
    successful_programs: parseArray(raw.successful_programs), successful_programs_ar: parseArray(raw.successful_programs_ar),
    is_active: raw.is_active !== false && raw.is_active !== 0,
  };
}

const empty = (): ProgramForm => ({
  member_name: '', member_name_ar: '',
  general_info: [], general_info_ar: [],
  education_materials: [], education_materials_ar: [],
  specific_materials: [], specific_materials_ar: [],
  assisting_groups: [], assisting_groups_ar: [],
  evaluation: [], evaluation_ar: [],
  successful_programs: [], successful_programs_ar: [],
  is_active: true,
});

function toggleLabel(values: string[], label: string): string[] {
  return values.includes(label) ? values.filter((v) => v !== label) : [...values, label];
}

export default function ProgramsEditor() {
  const [items, setItems]     = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProgramForm | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await api.get('/programs');
      const raw = res?.data ?? res ?? [];
      setItems(Array.isArray(raw) ? raw.map(normalize) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'programs', onError: load });

  const openNew  = () => { setError(null); setEditing(empty()); };
  const openEdit = (p: Program) => { setError(null); setEditing({ ...p }); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.member_name?.trim()) { setError('Member authority is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        member_name: editing.member_name.trim(),
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
      editing.id ? await api.put(`/programs/${editing.id}`, payload)
                 : await api.post('/programs', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this program entry?')) return;
    await api.delete(`/programs/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading programs…</div>;

  return (
    <div>
      <SectionHeader
        title={`Programs (${items.length})`}
        description="Member investor education program profiles. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Program</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<ClipboardList size={40} strokeWidth={1.5} />} title="No program entries yet"
          description="Add member authority education program profiles."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Program</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const totalTags = FIELD_KEYS.reduce((sum, key) => sum + item[key].length, 0);
            return (
              <div key={item.id}
                onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
                className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
                <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#009900]/10 flex items-center justify-center">
                  <ClipboardList size={15} className="text-[#009900]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.member_name}</p>
                  <p className="text-xs text-gray-400">{totalTags} categor{totalTags === 1 ? 'y' : 'ies'} selected</p>
                </div>
                {!item.is_active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 flex-shrink-0">Inactive</span>}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Wider drawer for Programs — lots of checkboxes */}
      <EditorDrawer open={!!editing} onClose={cancel} width="max-w-2xl"
        title={editing?.id ? 'Edit Program' : 'New Program'} subtitle="Education program profile"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}>
        {editing && (
          <div className="space-y-5">
            <EnglishFieldsGroup>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Member Authority *</label>
                <select value={editing.member_name} onChange={(e) => setEditing({ ...editing, member_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]">
                  <option value="">Select member…</option>
                  {PROGRAM_MEMBERS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="rounded border-gray-300" />
                Active (visible on public Programs page)
              </label>

              {PROGRAM_FILTER_GROUPS.map((group) => {
                const fieldKey = GROUP_FIELD_MAP[group.name];
                const selected = editing[fieldKey] ?? [];
                return (
                  <div key={group.name}>
                    <p className="text-xs font-bold text-[#009900] mb-2 uppercase tracking-wider">{group.title}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 border border-gray-100 rounded-xl p-3 bg-gray-50 max-h-44 overflow-y-auto">
                      {group.options.map((option) => (
                        <label key={option.value} className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                          <input type="checkbox" className="mt-0.5 shrink-0 rounded border-gray-300 accent-[#009900]"
                            checked={selected.includes(option.label)}
                            onChange={() => setEditing({ ...editing, [fieldKey]: toggleLabel(selected, option.label) })} />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </EnglishFieldsGroup>

            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="اسم العضو (عربي)" value={editing.member_name_ar ?? ''} onChange={(v) => setEditing({ ...editing, member_name_ar: v })} englishValue={editing.member_name} />
              {PROGRAM_FILTER_GROUPS.map((group) => {
                const arKey = GROUP_AR_FIELD_MAP[group.name];
                return (
                  <StringListEditor key={`${group.name}-ar`}
                    label={`${group.title} (عربي)`}
                    items={editing[arKey]?.length ? editing[arKey] : ['']}
                    onChange={(items) => setEditing({ ...editing, [arKey]: items })}
                    placeholder="أدخل النص بالعربية…" addLabel="إضافة عنصر" isArabic />
                );
              })}
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
