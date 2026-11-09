import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react';
import { api } from '../../lib/api';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  arabicTerm?: string;
  arabicDefinition?: string;
  frenchTerm?: string;
  isActive: boolean;
}

export default function GlossaryEditor() {
  const [terms, setTerms]     = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [editing, setEditing] = useState<Partial<GlossaryTerm> | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = async () => {
    try { setTerms(await api.get('/glossary') ?? []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items: terms, setItems: setTerms, resource: 'glossary', onError: load, disabled: !!search });

  const filtered = search
    ? terms.filter((t) =>
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 50)
    : terms;

  const openNew  = () => { setError(null); setEditing({ term: '', definition: '', arabicTerm: '', arabicDefinition: '', frenchTerm: '' }); };
  const openEdit = (t: GlossaryTerm) => { setError(null); setEditing({ ...t }); };
  const cancel   = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.term?.trim()) { setError('English term is required.'); return; }
    if (!editing.definition?.trim()) { setError('Definition is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        term: editing.term.trim(),
        definition: editing.definition.trim(),
        arabicTerm: editing.arabicTerm?.trim() || null,
        arabicDefinition: editing.arabicDefinition?.trim() || null,
        frenchTerm: editing.frenchTerm?.trim() || null,
        category: 'Basic Concepts',
        language: 'English',
        isActive: true,
      };
      editing.id ? await api.put(`/glossary/${editing.id}`, payload)
                 : await api.post('/glossary', payload);
      setEditing(null); load();
    } catch (e: any) { setError(e?.message ?? 'Failed to save.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this term?')) return;
    await api.delete(`/glossary/${id}`); load();
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading glossary…</div>;

  return (
    <div>
      <SectionHeader
        title={`Glossary (${terms.length} terms)`}
        description="Financial glossary at /glossary. Drag to reorder (disabled while searching)."
        hint={<SortableReorderHint reordering={sortable.reordering} disabled={!!search} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Term</button>}
      />

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms or definitions…"
          className="w-full ps-9 pe-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        )}
      </div>

      {terms.length === 0 ? (
        <EmptyState icon={<BookOpen size={40} strokeWidth={1.5} />} title="No glossary terms yet"
          description="Add financial terms with English, Arabic and French translations."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Term</button>} />
      ) : (
        <>
          <div className="space-y-2">
            {filtered.map((t, index) => (
              <div key={t.id}
                onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, t.id)}
                className={sortable.rowClassName(t.id, 'flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
                <SortableGrip id={t.id} index={index} disabled={!!search} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-800">{t.term}</p>
                    {t.frenchTerm && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">FR: {t.frenchTerm}</span>}
                    {t.arabicTerm && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium" dir="rtl">{t.arabicTerm}</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{t.definition}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(t)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => remove(t.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          {search && filtered.length === 50 && (
            <p className="text-xs text-gray-400 text-center mt-3">Showing first 50 results — refine your search to narrow down.</p>
          )}
          {filtered.length === 0 && search && (
            <p className="text-sm text-gray-400 text-center py-8">No terms match "<strong>{search}</strong>".</p>
          )}
        </>
      )}

      <EditorDrawer open={!!editing} onClose={cancel}
        title={editing?.id ? 'Edit Term' : 'New Term'} subtitle="Glossary"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}>
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">English Term *</label>
                <input type="text" value={editing.term ?? ''} onChange={(e) => setEditing({ ...editing, term: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">French Term <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={editing.frenchTerm ?? ''} onChange={(e) => setEditing({ ...editing, frenchTerm: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Definition *</label>
                <textarea rows={4} value={editing.definition ?? ''} onChange={(e) => setEditing({ ...editing, definition: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="المصطلح (عربي)" value={editing.arabicTerm ?? ''} onChange={(v) => setEditing({ ...editing, arabicTerm: v })} />
              <ArabicTextAreaField label="التعريف (عربي)" value={editing.arabicDefinition ?? ''} onChange={(v) => setEditing({ ...editing, arabicDefinition: v })} rows={4} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
