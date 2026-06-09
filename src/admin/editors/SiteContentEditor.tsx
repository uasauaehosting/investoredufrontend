import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../lib/api';

const PAGE_KEYS = [
  { key: 'home.welcome', label: 'Home — Welcome Section' },
  { key: 'home.portal_section', label: 'Home — Portal Cards' },
  { key: 'about.hero', label: 'About — Hero' },
  { key: 'principles', label: 'Principles Page' },
  { key: 'framework', label: 'Framework Page' },
  { key: 'the_index', label: 'The Index Page' },
  { key: 'feedback', label: 'Feedback Page' },
  { key: 'footer', label: 'Footer Links & Contact' },
  { key: 'glossary_meta', label: 'Glossary Page Meta' },
];

export default function SiteContentEditor() {
  const [activeKey, setActiveKey] = useState(PAGE_KEYS[0].key);
  const [jsonText, setJsonText] = useState('{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get(`/site-content/${key}`);
      setJsonText(JSON.stringify(data, null, 2));
    } catch {
      setJsonText('{}');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(activeKey); }, [activeKey]);

  const save = async () => {
    setError(null);
    setSuccess(false);
    let content: Record<string, unknown>;
    try {
      content = JSON.parse(jsonText);
    } catch {
      setError('Invalid JSON. Please fix syntax errors.');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/site-content/${activeKey}`, { content });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800">Page Content</h2>
        <p className="text-xs text-gray-400">Edit JSON content for each page section</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PAGE_KEYS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveKey(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeKey === key ? 'bg-[#009900] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <textarea
            className="w-full font-mono text-xs border rounded-lg p-3 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-green-100"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-green-600 text-xs mt-2">Saved successfully!</p>}
          <button onClick={save} disabled={saving} className="btn-primary mt-3 flex items-center gap-1.5">
            <Save size={14} /> {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      )}
    </div>
  );
}
