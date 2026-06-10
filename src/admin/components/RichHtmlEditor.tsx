import { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const labelClass = 'block text-xs font-medium text-gray-500';

const toolbar = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['link'],
  ['clean'],
];

type RichHtmlEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  dir?: 'ltr' | 'rtl';
  minHeight?: number;
};

export default function RichHtmlEditor({
  label,
  value,
  onChange,
  placeholder,
  hint,
  dir = 'ltr',
  minHeight = 220,
}: RichHtmlEditorProps) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');

  const modules = useMemo(
    () => ({
      toolbar,
      clipboard: { matchVisual: false },
    }),
    [],
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'indent',
    'align',
    'link',
  ];

  return (
    <div dir={dir}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <label className={labelClass}>{label}</label>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setMode('visual')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'visual'
                ? 'bg-[#009900] text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setMode('html')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              mode === 'html'
                ? 'bg-[#009900] text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            HTML
          </button>
        </div>
      </div>

      {mode === 'visual' ? (
        <div className="rich-html-editor" style={{ ['--rich-editor-min-height' as string]: `${minHeight}px` }}>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
          />
        </div>
      ) : (
        <textarea
          rows={Math.max(8, Math.round(minHeight / 24))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '<p>Paste or edit HTML here...</p>'}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900] resize-y"
          dir={dir}
        />
      )}

      {hint && (
        <p className={`text-[10px] text-gray-400 mt-1 ${dir === 'rtl' ? 'text-right' : ''}`}>{hint}</p>
      )}
    </div>
  );
}
