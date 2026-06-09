import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField } from './siteContent/FormFields';

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
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<GlossaryTerm> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await api.get('/glossary');
      setTerms(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = terms.filter((t) =>
    !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 50);

  const save = async () => {
    if (!editing?.term?.trim() || !editing?.definition?.trim()) return;
    setSaving(true);
    try {
      const payload = {
        term: editing.term,
        definition: editing.definition,
        arabicTerm: editing.arabicTerm?.trim() || null,
        arabicDefinition: editing.arabicDefinition?.trim() || null,
        frenchTerm: editing.frenchTerm?.trim() || null,
        category: 'Basic Concepts',
        language: 'English',
        isActive: true,
      };
      if (editing.id) {
        await api.put(`/glossary/${editing.id}`, payload);
      } else {
        await api.post('/glossary', payload);
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
    if (!confirm('Delete this term?')) return;
    await api.delete(`/glossary/${id}`);
    load();
  };

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading glossary...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Glossary ({terms.length} terms)</h2>
          <p className="text-xs text-gray-400">Manage glossary terms</p>
        </div>
        <button onClick={() => setEditing({ term: '', definition: '', arabicTerm: '', arabicDefinition: '', frenchTerm: '' })} className="btn-primary flex items-center gap-1.5">
          <Plus size={15} /> Add Term
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input className="w-full ps-9 pe-3 py-2 border rounded-lg text-sm" placeholder="Search terms..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {editing && (
        <div className="bg-white rounded-2xl border border-green-200 p-5 mb-5 space-y-3">
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="English term" value={editing.term ?? ''} onChange={(e) => setEditing({ ...editing, term: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="French term" value={editing.frenchTerm ?? ''} onChange={(e) => setEditing({ ...editing, frenchTerm: e.target.value })} />
          <textarea className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]" placeholder="Definition" value={editing.definition ?? ''} onChange={(e) => setEditing({ ...editing, definition: e.target.value })} />
          <ArabicSectionDivider />
          <ArabicTextField label="المصطلح (عربي)" value={editing.arabicTerm ?? ''} onChange={(v) => setEditing({ ...editing, arabicTerm: v })} />
          <ArabicTextAreaField label="التعريف (عربي)" value={editing.arabicDefinition ?? ''} onChange={(v) => setEditing({ ...editing, arabicDefinition: v })} rows={4} />
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5"><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800">{t.term}</p>
              <p className="text-xs text-gray-500 line-clamp-1">{t.definition}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setEditing(t)} className="p-1.5 text-gray-400 hover:text-[#009900]"><Pencil size={14} /></button>
              <button onClick={() => remove(t.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {search && filtered.length === 50 && <p className="text-xs text-gray-400 text-center">Showing first 50 results</p>}
      </div>
    </div>
  );
}
