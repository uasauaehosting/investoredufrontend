import { Plus, Trash2 } from 'lucide-react';
import { InvestmentProductBlock } from '../../lib/investmentProducts';
import { ArabicTextField, StringListEditor } from './siteContent/FormFields';

const cardClass = 'bg-white border border-gray-200 rounded-xl p-4 space-y-3';
const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]';
const arabicInputClass = `${inputClass} text-right`;
const labelClass = 'block text-xs font-medium text-gray-500 mb-1';

const emptyBlock = (): InvestmentProductBlock => ({
  heading: '',
  paragraphs: [''],
});

export default function InvestmentProductBlocksEditor({
  blocks,
  onChange,
  rtl = false,
}: {
  blocks: InvestmentProductBlock[];
  onChange: (blocks: InvestmentProductBlock[]) => void;
  rtl?: boolean;
}) {
  const fieldClass = rtl ? arabicInputClass : inputClass;
  const safeBlocks = blocks.length > 0 ? blocks : [emptyBlock()];

  const updateBlock = (index: number, next: InvestmentProductBlock) => {
    const updated = [...safeBlocks];
    updated[index] = next;
    onChange(updated);
  };

  const removeBlock = (index: number) => {
    const updated = safeBlocks.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? updated : [emptyBlock()]);
  };

  const addBlock = () => onChange([...safeBlocks, emptyBlock()]);

  return (
    <div className="space-y-3" dir={rtl ? 'rtl' : undefined}>
      <div className="flex items-center justify-between gap-2">
        <label className={labelClass}>{rtl ? 'محتوى صفحة التفاصيل (عربي)' : 'Detail Page Content'}</label>
        <button type="button" onClick={addBlock} className="text-xs text-[#009900] hover:underline flex items-center gap-1">
          <Plus size={12} /> Add section
        </button>
      </div>

      {safeBlocks.map((block, index) => (
        <div key={index} className={cardClass}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Section {index + 1}</span>
            {safeBlocks.length > 1 && (
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="p-1 text-gray-400 hover:text-red-500 rounded"
                title="Remove section"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {rtl ? (
            <ArabicTextField
              label="العنوان (اختياري)"
              value={block.heading ?? ''}
              onChange={(heading) => updateBlock(index, { ...block, heading })}
              placeholder="عنوان القسم"
            />
          ) : (
            <div>
              <label className={labelClass}>Heading (optional)</label>
              <input
                type="text"
                value={block.heading ?? ''}
                onChange={(e) => updateBlock(index, { ...block, heading: e.target.value })}
                className={inputClass}
                placeholder="Section title"
              />
            </div>
          )}

          <div dir={rtl ? 'rtl' : undefined}>
            <StringListEditor
              label={rtl ? 'الفقرات' : 'Paragraphs'}
              items={block.paragraphs ?? ['']}
              onChange={(paragraphs) => updateBlock(index, { ...block, paragraphs })}
              addLabel={rtl ? 'إضافة فقرة' : 'Add paragraph'}
              placeholder={rtl ? 'نص الفقرة...' : 'Paragraph text...'}
            />
          </div>

          <div dir={rtl ? 'rtl' : undefined}>
            <StringListEditor
              label={rtl ? 'نقاط (اختياري)' : 'Bullet points (optional)'}
              items={block.bullets ?? []}
              onChange={(bullets) =>
                updateBlock(index, {
                  ...block,
                  bullets: bullets.length > 0 ? bullets : undefined,
                })
              }
              addLabel={rtl ? 'إضافة نقطة' : 'Add bullet'}
              placeholder={rtl ? 'نص النقطة...' : 'Bullet text...'}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Sub-items (optional)</label>
              <button
                type="button"
                onClick={() =>
                  updateBlock(index, {
                    ...block,
                    subItems: [...(block.subItems ?? []), { title: '', text: '' }],
                  })
                }
                className="text-[10px] text-[#009900] hover:underline flex items-center gap-1"
              >
                <Plus size={11} /> Add sub-item
              </button>
            </div>
            {(block.subItems ?? []).map((item, subIndex) => (
              <div key={subIndex} className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Sub-item {subIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateBlock(index, {
                        ...block,
                        subItems: block.subItems?.filter((_, i) => i !== subIndex),
                      })
                    }
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const subItems = [...(block.subItems ?? [])];
                    subItems[subIndex] = { ...item, title: e.target.value };
                    updateBlock(index, { ...block, subItems });
                  }}
                  className={fieldClass}
                  placeholder={rtl ? 'العنوان' : 'Title'}
                />
                <textarea
                  rows={2}
                  value={item.text}
                  onChange={(e) => {
                    const subItems = [...(block.subItems ?? [])];
                    subItems[subIndex] = { ...item, text: e.target.value };
                    updateBlock(index, { ...block, subItems });
                  }}
                  className={`${fieldClass} resize-y`}
                  placeholder={rtl ? 'الوصف' : 'Description'}
                />
              </div>
            ))}
          </div>

          <div>
            <label className={labelClass}>{rtl ? 'المصدر (اختياري)' : 'Source note (optional)'}</label>
            <input
              type="text"
              value={block.source ?? ''}
              onChange={(e) => updateBlock(index, { ...block, source: e.target.value || undefined })}
              className={fieldClass}
              placeholder={rtl ? 'المصدر: www.example.com' : 'Source: www.example.com'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{rtl ? 'تسمية الرابط (اختياري)' : 'External link label (optional)'}</label>
              <input
                type="text"
                value={block.externalLink?.label ?? ''}
                onChange={(e) =>
                  updateBlock(index, {
                    ...block,
                    externalLink: {
                      label: e.target.value,
                      url: block.externalLink?.url ?? '',
                    },
                  })
                }
                className={fieldClass}
                placeholder={rtl ? 'اقرأ المزيد' : 'Read more'}
              />
            </div>
            <div>
              <label className={labelClass}>{rtl ? 'رابط خارجي' : 'External link URL'}</label>
              <input
                type="url"
                value={block.externalLink?.url ?? ''}
                onChange={(e) =>
                  updateBlock(index, {
                    ...block,
                    externalLink: {
                      label: block.externalLink?.label ?? '',
                      url: e.target.value,
                    },
                  })
                }
                className={fieldClass}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
