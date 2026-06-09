import { useState, useLayoutEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../lib/api';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { PAGE_KEYS, mergeWithDefaults, type PageKey } from './siteContent/defaults';
import {
  HomeWelcomeForm,
  HomePortalForm,
  AboutHeroForm,
  PrinciplesPageForm,
  FrameworkPageForm,
  TheIndexForm,
  BenchmarkingPageForm,
  AdditionalResourcesForm,
  FeedbackForm,
  FooterForm,
  GlossaryMetaForm,
} from './siteContent/PageForms';

export default function SiteContentEditor() {
  const [activeKey, setActiveKey] = useState<PageKey>(PAGE_KEYS[0].key);
  const [content, setContent] = useState<Record<string, unknown>>(() => mergeWithDefaults(PAGE_KEYS[0].key, {}));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectKey = useCallback((key: PageKey) => {
    setActiveKey(key);
    setLoading(true);
    setError(null);
    setSuccess(false);
    setContent(mergeWithDefaults(key, {}));
  }, []);

  const handleChange = useCallback(
    (next: Record<string, unknown>) => {
      setContent(mergeWithDefaults(activeKey, next));
    },
    [activeKey],
  );

  useLayoutEffect(() => {
    let cancelled = false;
    const key = activeKey;

    (async () => {
      try {
        const data = await api.get(`/site-content/${key}`);
        if (!cancelled) {
          setContent(
            mergeWithDefaults(key, normalizeMediaFieldsDeep((data ?? {}) as Record<string, unknown>))
          );
        }
      } catch {
        if (!cancelled) {
          setContent(mergeWithDefaults(key, {}));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeKey]);

  const save = async () => {
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await api.put(`/site-content/${activeKey}`, {
        content: mergeWithDefaults(activeKey, normalizeMediaFieldsDeep(content)),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  const formData = mergeWithDefaults(activeKey, content);

  const renderForm = () => {
    switch (activeKey) {
      case 'home.welcome':
        return <HomeWelcomeForm data={formData as never} onChange={handleChange} />;
      case 'home.portal_section':
        return <HomePortalForm data={formData as never} onChange={handleChange} />;
      case 'about.hero':
        return <AboutHeroForm data={formData as never} onChange={handleChange} />;
      case 'principles':
        return <PrinciplesPageForm data={formData as never} onChange={handleChange} />;
      case 'framework':
        return <FrameworkPageForm data={formData as never} onChange={handleChange} />;
      case 'the_index':
        return <TheIndexForm data={formData as never} onChange={handleChange} />;
      case 'benchmarking':
        return <BenchmarkingPageForm data={formData as never} onChange={handleChange} />;
      case 'additional_resources':
        return <AdditionalResourcesForm data={formData as never} onChange={handleChange} />;
      case 'feedback':
        return <FeedbackForm data={formData as never} onChange={handleChange} />;
      case 'footer':
        return <FooterForm data={formData as never} onChange={handleChange} />;
      case 'glossary_meta':
        return <GlossaryMetaForm data={formData as never} onChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800">Page Content</h2>
        <p className="text-xs text-gray-400">Edit text, images, and links for each page section</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {PAGE_KEYS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => selectKey(key)}
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
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          {renderForm()}
          {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
          {success && <p className="text-green-600 text-xs mt-4">Saved successfully!</p>}
          <button onClick={save} disabled={saving} className="btn-primary mt-6 flex items-center gap-1.5">
            <Save size={14} /> {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      )}
    </div>
  );
}
