import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep, normalizeMediaUrl } from '../../lib/mediaUrl';
import { ArabicSectionDivider, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

export interface Member {
  id: number;
  name: string;
  nameAr?: string | null;
  country: string;
  countryAr?: string | null;
  logo: string | null;
  website: string | null;
}

const empty: Omit<Member, 'id'> = { name: '', nameAr: '', country: '', countryAr: '', logo: '', website: '#' };

export default function MembersEditor() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try { setMembers(normalizeMediaFieldsDeep(await api.get('/home/members') ?? [])); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items: members, setItems: setMembers, resource: 'members', onError: load });

  const openNew  = () => { setError(null); setEditing({ ...empty }); };
  const openEdit = (m: Member) => { setError(null); setEditing(normalizeMediaFieldsDeep({ ...m })); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) { setError('Authority name is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        ...editing,
        nameAr: editing.nameAr?.trim() || null,
        countryAr: editing.countryAr?.trim() || null,
      });
      editing.id ? await api.put(`/home/members/${editing.id}`, payload)
                 : await api.post('/home/members', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this member?')) return;
    await api.delete(`/home/members/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading members…</div>;

  return (
    <div>
      <SectionHeader
        title="Member Authority Logos"
        description="These logos appear on the homepage members strip. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5">
            <Plus size={15} /> Add Member
          </button>
        }
      />

      {members.length === 0 ? (
        <EmptyState
          icon={<Building2 size={40} strokeWidth={1.5} />}
          title="No members yet"
          description="Add Arab securities authority members to display their logos on the homepage."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Member</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {members.map((m, index) => (
            <div
              key={m.id}
              onDragOver={sortable.handleDragOver}
              onDrop={(e) => sortable.handleDrop(e, m.id)}
              className={sortable.rowClassName(m.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-green-300 transition-colors')}
            >
              <SortableGrip id={m.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {m.logo
                  ? <img src={normalizeMediaUrl(m.logo)} alt="" className="max-w-full max-h-full object-contain" />
                  : <Building2 size={16} className="text-gray-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                <p className="text-xs text-gray-400 truncate">{m.country}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(m)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(m.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer
        open={!!editing}
        onClose={cancel}
        title={editing?.id ? 'Edit Member' : 'New Member'}
        subtitle="Arab securities authority"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}
      >
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Authority Name *</label>
                  <input type="text" value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Country *</label>
                  <input type="text" value={editing.country ?? ''} onChange={(e) => setEditing({ ...editing, country: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
                </div>
              </div>
              <ImageUpload label="Authority Logo" value={editing.logo ?? ''} onChange={(url) => setEditing({ ...editing, logo: url })} />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Portal URL</label>
                <input type="text" value={editing.website ?? ''} onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="اسم الجهة (عربي)" value={editing.nameAr ?? ''} onChange={(v) => setEditing({ ...editing, nameAr: v })} englishValue={editing.name ?? ''} />
              <ArabicTextField label="الدولة (عربي)" value={editing.countryAr ?? ''} onChange={(v) => setEditing({ ...editing, countryAr: v })} englishValue={editing.country ?? ''} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
