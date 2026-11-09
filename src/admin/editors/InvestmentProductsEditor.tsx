import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import RichHtmlEditor from '../components/RichHtmlEditor';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview, EnglishFieldsGroup, ArabicFieldsGroup } from './siteContent/FormFields';
import { InvestmentProduct } from '../../lib/investmentProducts';
import { normalizeInvestmentProductContent } from '../../lib/investmentProductContent';
import { useSortableReorder } from '../hooks/useSortableReorder';
import { SortableGrip, SortableReorderHint } from '../components/SortableControls';
import EditorDrawer from '../components/EditorDrawer';
import DrawerFooter from '../components/DrawerFooter';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';

const today = () => new Date().toISOString().slice(0, 10);
const empty = (): Omit<InvestmentProduct, 'id'> => ({
  title: '', titleAr: '', description: '', descriptionAr: '',
  author: '', date: today(), fileUrl: '', imageUrl: '', content: '', contentAr: '', isActive: true,
});

export default function InvestmentProductsEditor() {
  const [items, setItems] = useState<InvestmentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<InvestmentProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setItems(
        normalizeMediaFieldsDeep(await api.get('/investor-education/investment-products/admin') ?? []).map(
          (item: InvestmentProduct) => ({ ...item, date: item.date ? String(item.date).slice(0, 10) : today() }),
        ),
      );
    } catch (e) { console.error(e); setItems([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sortable = useSortableReorder({ items, setItems, resource: 'investment-products', onError: load });

  const openNew  = () => { setError(null); setEditing({ ...empty() }); };
  const openEdit = (item: InvestmentProduct) => {
    setError(null);
    setEditing(normalizeMediaFieldsDeep({
      ...item,
      date: item.date ? String(item.date).slice(0, 10) : today(),
      content: normalizeInvestmentProductContent(item.content),
      contentAr: item.contentAr ? normalizeInvestmentProductContent(item.contentAr) : '',
    }));
  };
  const cancel = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { setError('Title is required.'); return; }
    setSaving(true); setError(null);
    try {
      const payload = normalizeMediaFieldsDeep({
        title: editing.title?.trim() || '',
        titleAr: editing.titleAr?.trim() || null,
        description: editing.description?.trim() || '',
        descriptionAr: editing.descriptionAr?.trim() || null,
        author: editing.author?.trim() || '',
        date: editing.date || today(),
        fileUrl: editing.fileUrl?.trim() || '',
        imageUrl: editing.imageUrl?.trim() || '',
        content: editing.content?.trim() || '',
        contentAr: editing.contentAr?.trim() || null,
        isActive: editing.isActive !== false,
      });
      editing.id
        ? await api.put(`/investor-education/investment-products/${editing.id}`, payload)
        : await api.post('/investor-education/investment-products', payload);
      setEditing(null); load();
    } catch { setError('Failed to save.'); } finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/investor-education/investment-products/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) return <div className="animate-pulse text-gray-400 text-sm p-6">Loading products…</div>;

  return (
    <div>
      <SectionHeader
        title="Investment Products"
        description="Product literature under /education/reading-materials/products. Drag to reorder."
        hint={<SortableReorderHint reordering={sortable.reordering} />}
        action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={15} /> Add Product</button>}
      />

      {items.length === 0 ? (
        <EmptyState icon={<BookOpen size={40} strokeWidth={1.5} />} title="No products yet"
          description="Add investment product literature to the reading materials section."
          action={<button onClick={openNew} className="btn-primary flex items-center gap-1.5"><Plus size={14} /> Add Product</button>} />
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id}
              onDragOver={sortable.handleDragOver} onDrop={(e) => sortable.handleDrop(e, item.id)}
              className={sortable.rowClassName(item.id, 'flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-green-300 transition-colors')}>
              <SortableGrip id={item.id} index={index} onDragStart={sortable.handleDragStart} onDragEnd={sortable.clearDragging} />
              {item.imageUrl
                ? <MediaPreview url={item.imageUrl} className="w-14 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
                : <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><BookOpen size={14} className="text-gray-300" /></div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 truncate">{item.description}</p>
              </div>
              {!item.isActive && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 flex-shrink-0">Hidden</span>}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="icon-btn" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => remove(item.id)} className="icon-btn text-red-400 hover:text-red-600" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditorDrawer open={!!editing} onClose={cancel}
        title={editing?.id ? 'Edit Product' : 'New Product'} subtitle="Investment products literature"
        footer={<DrawerFooter onSave={save} onCancel={cancel} saving={saving} error={error} />}>
        {editing && (
          <div className="space-y-4">
            <EnglishFieldsGroup>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                <input type="text" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Short Description</label>
                <textarea rows={3} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none" />
              </div>
              <ImageUpload label="Image" value={editing.imageUrl ?? ''} onChange={(url) => setEditing({ ...editing, imageUrl: url })} />
              <RichHtmlEditor label="Full Content (detail page)" value={editing.content ?? ''}
                onChange={(v) => setEditing({ ...editing, content: v })} placeholder="Product details…" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <input type="date" value={editing.date ?? today()} onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="rounded border-gray-300" />
                    Active
                  </label>
                </div>
              </div>
            </EnglishFieldsGroup>
            <ArabicSectionDivider />
            <ArabicFieldsGroup>
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} englishValue={editing.title ?? ''} />
              <ArabicTextAreaField label="الوصف (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={3} englishValue={editing.description ?? ''} />
              <RichHtmlEditor label="المحتوى الكامل (عربي)" value={editing.contentAr ?? ''}
                onChange={(v) => setEditing({ ...editing, contentAr: v })} dir="rtl" placeholder="المحتوى بالعربية…" minHeight={200} />
            </ArabicFieldsGroup>
          </div>
        )}
      </EditorDrawer>
    </div>
  );
}
