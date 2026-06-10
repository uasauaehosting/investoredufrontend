import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import RichHtmlEditor from '../components/RichHtmlEditor';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview } from './siteContent/FormFields';
import { InvestmentProduct } from '../../lib/investmentProducts';
import { normalizeInvestmentProductContent } from '../../lib/investmentProductContent';

const today = () => new Date().toISOString().slice(0, 10);

const empty = (): Omit<InvestmentProduct, 'id'> => ({
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  author: '',
  date: today(),
  fileUrl: '',
  imageUrl: '',
  content: '',
  contentAr: '',
  isActive: true,
});

export default function InvestmentProductsEditor() {
  const [items, setItems] = useState<InvestmentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<InvestmentProduct> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/investor-education/investment-products/admin');
      setItems(
        normalizeMediaFieldsDeep(data ?? []).map((item: InvestmentProduct) => ({
          ...item,
          date: item.date ? String(item.date).slice(0, 10) : today(),
        })),
      );
    } catch (err) {
      console.error('Failed to load investment products:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...empty() });
  const openEdit = (item: InvestmentProduct) =>
    setEditing(
      normalizeMediaFieldsDeep({
        ...item,
        date: item.date ? String(item.date).slice(0, 10) : today(),
        content: normalizeInvestmentProductContent(item.content),
        contentAr: item.contentAr ? normalizeInvestmentProductContent(item.contentAr) : '',
      }),
    );
  const cancel = () => {
    setEditing(null);
    setError(null);
  };

  const save = async () => {
    if (!editing) return;

    setSaving(true);
    setError(null);
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

      if (editing.id) {
        await api.put(`/investor-education/investment-products/${editing.id}`, payload);
      } else {
        await api.post('/investor-education/investment-products', payload);
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
    if (!confirm('Delete this investment product? This cannot be undone.')) return;
    try {
      await api.delete(`/investor-education/investment-products/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
      setError('Failed to delete investment product.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Investment Products/ Literature</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Add and manage individual investment product pages with images and content
          </p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5 self-start">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {editing && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-[#009900] text-sm">
            {editing.id ? 'Edit Product' : 'New Product'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
              <input
                type="text"
                value={editing.title ?? ''}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]"
                placeholder="Product name"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Short Description (shown on list) *
              </label>
              <textarea
                rows={3}
                value={editing.description ?? ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                label="Image"
                value={editing.imageUrl ?? ''}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
              />
            </div>
            <div className="sm:col-span-2">
              <RichHtmlEditor
                label="Full Content (detail page — HTML allowed)"
                value={editing.content ?? ''}
                onChange={(content) => setEditing({ ...editing, content })}
                placeholder="Detailed product content here..."
                hint="Use Visual mode to paste formatted text, or switch to HTML to paste raw markup."
              />
            </div>
            <ArabicSectionDivider />
            <div className="sm:col-span-2">
              <ArabicTextField label="العنوان (عربي)" value={editing.titleAr ?? ''} onChange={(v) => setEditing({ ...editing, titleAr: v })} />
            </div>
            <div className="sm:col-span-2">
              <ArabicTextAreaField label="الوصف المختصر (عربي)" value={editing.descriptionAr ?? ''} onChange={(v) => setEditing({ ...editing, descriptionAr: v })} rows={3} />
            </div>
            <div className="sm:col-span-2">
              <RichHtmlEditor
                label="المحتوى الكامل (عربي)"
                value={editing.contentAr ?? ''}
                onChange={(contentAr) => setEditing({ ...editing, contentAr })}
                dir="rtl"
                placeholder="المحتوى التفصيلي للمنتج..."
                hint="يمكنك لصق النص المنسق أو التبديل إلى HTML للصق التنسيق مباشرة."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
              <input
                type="date"
                value={editing.date ?? today()}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.isActive !== false}
                  onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                Active (visible on site)
              </label>
            </div>
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-1.5">
              <Save size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancel} className="btn-ghost flex items-center gap-1.5">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse py-8">Loading products...</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 group hover:border-green-300 transition-colors"
            >
              {item.imageUrl && <MediaPreview url={item.imageUrl} />}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 truncate">{item.title}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{item.description}</p>
                {!item.isActive && (
                  <span className="text-[10px] text-amber-600 mt-1 inline-block">Hidden</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-[#009900] hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-gray-400 py-8 text-center">
              No investment products yet. Add your first one above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
