import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import ImageUpload from '../../lib/ImageUpload';
import FileUpload from '../../lib/FileUpload';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import {
  parseInvestmentProductContent,
  serializeInvestmentProductContent,
} from '../../lib/investmentProductContent';
import { InvestmentProductBlock } from '../../lib/investmentProducts';
import InvestmentProductBlocksEditor from './InvestmentProductBlocksEditor';
import { ArabicSectionDivider, ArabicTextAreaField, ArabicTextField, MediaPreview } from './siteContent/FormFields';

interface InvestmentProduct {
  id: number;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  author: string;
  date: string;
  fileUrl: string;
  imageUrl: string;
  content: string;
  contentAr?: string | null;
  slug: string;
  isActive: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

type EditingProduct = Partial<InvestmentProduct> & {
  blocks?: InvestmentProductBlock[];
  blocksAr?: InvestmentProductBlock[];
};

const empty = (): EditingProduct => ({
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
  slug: '',
  isActive: true,
  blocks: [],
  blocksAr: [],
});

export default function InvestmentProductsEditor() {
  const [items, setItems] = useState<InvestmentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingProduct | null>(null);
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
          slug: item.slug ?? '',
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
        blocks: parseInvestmentProductContent(item.content),
        blocksAr: parseInvestmentProductContent(item.contentAr ?? undefined),
        slug: item.slug ?? '',
      }),
    );
  const cancel = () => {
    setEditing(null);
    setError(null);
  };

  const save = async () => {
    if (!editing) return;

    const slug = (editing.slug?.trim() || slugify(editing.title || '') || `product-${Date.now()}`).trim();

    const normalizeBlocks = (source: InvestmentProductBlock[]) =>
      source.map((block) => ({
      ...block,
      heading: block.heading?.trim() || undefined,
      paragraphs: block.paragraphs?.map((p) => p.trim()).filter(Boolean),
      bullets: block.bullets?.map((b) => b.trim()).filter(Boolean),
      subItems: block.subItems
        ?.map((item) => ({ title: item.title.trim(), text: item.text.trim() }))
        .filter((item) => item.title || item.text),
      source: block.source?.trim() || undefined,
      externalLink:
        block.externalLink?.url?.trim()
          ? {
              label: block.externalLink.label?.trim() || 'Read more',
              url: block.externalLink.url.trim(),
            }
          : undefined,
    })).filter(
      (block) =>
        block.heading ||
        (block.paragraphs && block.paragraphs.length > 0) ||
        (block.bullets && block.bullets.length > 0) ||
        (block.subItems && block.subItems.length > 0) ||
        block.source ||
        block.externalLink,
    );

    const blocks = normalizeBlocks(editing.blocks ?? []);
    const blocksAr = normalizeBlocks(editing.blocksAr ?? []);
    const content = serializeInvestmentProductContent(blocks);
    const contentAr = blocksAr.length > 0 ? serializeInvestmentProductContent(blocksAr) : null;

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
        content,
        contentAr,
        slug,
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
            Manage product cards and detail pages shown under Reading Materials
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
                placeholder="Introduction to Financial Markets"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">URL Slug *</label>
              <input
                type="text"
                value={editing.slug ?? ''}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]"
                placeholder="introduction-to-financial-markets"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Used in /education/reading-materials/products/{'{id}'}
              </p>
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
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Short Description (shown on list card) *
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
                label="Card Image"
                value={editing.imageUrl ?? ''}
                onChange={(url) => setEditing({ ...editing, imageUrl: url })}
              />
            </div>
            <div className="sm:col-span-2">
              <FileUpload
                label="Downloadable File (optional)"
                value={editing.fileUrl ?? ''}
                onChange={(url) => setEditing({ ...editing, fileUrl: url })}
                hint="Optional PDF or document attached to this product"
              />
            </div>
            <div className="sm:col-span-2">
              <InvestmentProductBlocksEditor
                blocks={editing.blocks ?? []}
                onChange={(blocks) => setEditing({ ...editing, blocks })}
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
              <InvestmentProductBlocksEditor
                blocks={editing.blocksAr ?? []}
                onChange={(blocksAr) => setEditing({ ...editing, blocksAr })}
                rtl
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
                {item.slug && (
                  <p className="text-[10px] text-gray-400 mt-1 font-mono truncate">/{item.slug}</p>
                )}
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
