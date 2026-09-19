import { useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../../../lib/ImageUpload';
import FileUpload from '../../../lib/FileUpload';
import { normalizeMediaUrl } from '../../../lib/mediaUrl';
import { useLocalSortableList } from '../../hooks/useLocalSortableList';
import { SortableGrip } from '../../components/SortableControls';

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]';
const labelClass = 'block text-xs font-medium text-gray-500 mb-1';

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} resize-y`}
      />
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder = 'Enter text...',
  addLabel = 'Add item',
  isArabic = false,
}: {
  label: string;
  items: string[] | undefined;
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  /** When true, applies dir="rtl" and lang="ar" to each textarea */
  isArabic?: boolean;
}) {
  const safeItems = Array.isArray(items) ? items : [''];
  const update = (index: number, value: string) => {
    const next = [...safeItems];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => onChange(safeItems.filter((_, i) => i !== index));

  const add = () => onChange([...safeItems, '']);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    const next = [...safeItems];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
  }, [safeItems, onChange]);

  const sortable = useLocalSortableList({ onReorder: handleReorder });

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {safeItems.map((item, index) => (
          <div
            key={index}
            onDragOver={sortable.handleDragOver}
            onDrop={(e) => sortable.handleDrop(e, index)}
            className={sortable.rowClassName(index, 'flex items-start gap-2 border border-transparent rounded-lg')}
          >
            <SortableGrip
              id={index}
              index={index}
              onDragStart={sortable.handleDragStart}
              onDragEnd={sortable.clearDragging}
            />
            <textarea
              rows={2}
              value={item}
              onChange={(e) => update(index, e.target.value)}
              placeholder={placeholder}
              {...(isArabic ? { dir: 'rtl', lang: 'ar' } : {})}
              className={`${inputClass} flex-1 resize-y${isArabic ? ' text-right' : ''}`}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-xs font-medium text-[#009900] hover:text-[#006600] transition-colors"
        >
          <Plus size={14} /> {addLabel}
        </button>
      </div>
    </div>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return <ImageUpload label={label} value={value} onChange={onChange} />;
}

export function FileField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return <FileUpload label={label} value={value} onChange={onChange} hint={hint} />;
}

export function MediaPreview({
  url,
  alt = '',
  className = 'w-20 h-14 object-cover rounded-lg flex-shrink-0',
}: {
  url: string | null | undefined;
  alt?: string;
  className?: string;
}) {
  const src = normalizeMediaUrl(url);
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}

export function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="pb-2 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  );
}

const arabicInputClass = `${inputClass} text-right`;

/** Read-only English reference shown above the Arabic input so editors know what to translate. */
function EnglishReference({ value }: { value: string }) {
  if (!value?.trim()) return null;
  return (
    <div className="mb-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md" dir="ltr">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-0.5">English reference</p>
      <p className="text-xs text-gray-600 leading-snug break-words">{value}</p>
    </div>
  );
}

export function ArabicTextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  englishValue,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  /** The corresponding English field value shown as a read-only reference for translators. */
  englishValue?: string;
}) {
  return (
    <div>
      <EnglishReference value={englishValue ?? ''} />
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        dir="rtl"
        lang="ar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={arabicInputClass}
      />
      {hint && <p className="text-[10px] text-gray-400 mt-1 text-right">{hint}</p>}
    </div>
  );
}

export function ArabicTextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  englishValue,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  /** The corresponding English field value shown as a read-only reference for translators. */
  englishValue?: string;
}) {
  return (
    <div>
      <EnglishReference value={englishValue ?? ''} />
      <label className={labelClass}>{label}</label>
      <textarea
        rows={rows}
        dir="rtl"
        lang="ar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${arabicInputClass} resize-y`}
      />
      {hint && <p className="text-[10px] text-gray-400 mt-1 text-right">{hint}</p>}
    </div>
  );
}

export function ArabicSectionDivider() {
  return (
    <div className="sm:col-span-2 pt-2 border-t border-green-200">
      <p className="text-xs font-semibold text-[#009900]">العربية — Arabic Content</p>
      <p className="text-[10px] text-gray-400 mt-0.5">Shown when visitors switch to Arabic (RTL)</p>
    </div>
  );
}
