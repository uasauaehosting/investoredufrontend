import { useState, useLayoutEffect, useCallback } from 'react';
import { Save, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';
import { normalizeMediaFieldsDeep } from '../../lib/mediaUrl';
import { PAGE_KEYS, mergeWithDefaults, type PageKey } from './siteContent/defaults';
import {
  HomeWelcomeForm,
  HomePortalForm,
  HomeMembersHeaderForm,
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

// Group the page keys into logical sections for the tab sidebar
const TAB_GROUPS = [
  {
    label: 'Homepage',
    keys: ['home.welcome', 'home.portal_section', 'home.members_header'],
  },
  {
    label: 'Pages',
    keys: ['about.hero', 'principles', 'framework', 'the_index', 'benchmarking', 'additional_resources'],
  },
  {
    label: 'Site-wide',
    keys: ['feedback', 'footer', 'glossary_meta'],
  },
] as const;

export default function SiteContentEditor() {
  const [activeKey, setActiveKey]   = useState<PageKey>(PAGE_KEYS[0].key);
  const [content, setContent]       = useState<Record<string, unknown>>(() => mergeWithDefaults(PAGE_KEYS[0].key, {}));
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  const selectKey = useCallback((key: PageKey) => {
    setActiveKey(key);
    setLoading(true);
    setError(null);
    setSuccess(false);
    setContent(mergeWithDefaults(key, {}));
  }, []);

  const handleChange = useCallback(
    (next: Record<string, unknown>) => setContent(mergeWithDefaults(activeKey, next)),
    [activeKey],
  );

  useLayoutEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.get(`/site-content/${activeKey}`);
        if (!cancelled) setContent(mergeWithDefaults(activeKey, normalizeMediaFieldsDeep((data ?? {}) as Record<string, unknown>)));
      } catch {
        if (!cancelled) setContent(mergeWithDefaults(activeKey, {}));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeKey]);

  const save = async () => {
    setError(null); setSuccess(false); setSaving(true);
    try {
      await api.put(`/site-content/${activeKey}`, {
        content: mergeWithDefaults(activeKey, normalizeMediaFieldsDeep(content)),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { setError('Failed to save content. Please try again.'); }
    finally { setSaving(false); }
  };

  const formData = mergeWithDefaults(activeKey, content);

  const renderForm = () => {
    switch (activeKey) {
      case 'home.welcome':        return <HomeWelcomeForm        data={formData as never} onChange={handleChange as never} />;
      case 'home.portal_section': return <HomePortalForm         data={formData as never} onChange={handleChange as never} />;
      case 'home.members_header': return <HomeMembersHeaderForm  data={formData as never} onChange={handleChange as never} />;
      case 'about.hero':          return <AboutHeroForm          data={formData as never} onChange={handleChange as never} />;
      case 'principles':          return <PrinciplesPageForm     data={formData as never} onChange={handleChange as never} />;
      case 'framework':           return <FrameworkPageForm      data={formData as never} onChange={handleChange as never} />;
      case 'the_index':           return <TheIndexForm           data={formData as never} onChange={handleChange as never} />;
      case 'benchmarking':        return <BenchmarkingPageForm   data={formData as never} onChange={handleChange as never} />;
      case 'additional_resources':return <AdditionalResourcesForm data={formData as never} onChange={handleChange as never} />;
      case 'feedback':            return <FeedbackForm           data={formData as never} onChange={handleChange as never} />;
      case 'footer':              return <FooterForm             data={formData as never} onChange={handleChange as never} />;
      case 'glossary_meta':       return <GlossaryMetaForm       data={formData as never} onChange={handleChange as never} />;
      default: return null;
    }
  };

  const activeLabel = PAGE_KEYS.find((k) => k.key === activeKey)?.label ?? activeKey;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Page Content</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Edit static text, images and links for each page section. Select a section on the left.
        </p>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Tab sidebar ── */}
        <aside className="w-52 flex-shrink-0 hidden sm:block">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {TAB_GROUPS.map((group, gi) => (
              <div key={group.label}>
                {gi > 0 && <div className="border-t border-gray-100" />}
                <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">{group.label}</p>
                {group.keys.map((k) => {
                  const entry = PAGE_KEYS.find((p) => p.key === k);
                  if (!entry) return null;
                  const active = activeKey === k;
                  return (
                    <button key={k} onClick={() => selectKey(k as PageKey)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs transition-colors text-start ${
                        active
                          ? 'bg-[#009900]/8 text-[#009900] font-semibold border-s-2 border-[#009900]'
                          : 'text-gray-600 hover:bg-gray-50 border-s-2 border-transparent'
                      }`}>
                      <span className="flex-1 truncate">{entry.label}</span>
                      {active && <ChevronRight size={12} className="flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* ── Mobile tab pills ── */}
        <div className="sm:hidden w-full mb-4">
          <div className="flex flex-wrap gap-1.5">
            {PAGE_KEYS.map(({ key, label }) => (
              <button key={key} onClick={() => selectKey(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeKey === key ? 'bg-[#009900] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Form panel ── */}
        <div className="flex-1 min-w-0">
          {/* Active section label */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800">{activeLabel}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Editing: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-500">{activeKey}</code></p>
            </div>
            <button onClick={save} disabled={saving || loading}
              className="btn-primary flex items-center gap-1.5 text-sm">
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>

          {/* Feedback bar */}
          {(error || success) && (
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium mb-4 ${
              success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {success ? 'Saved successfully!' : error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="animate-pulse text-gray-400 text-sm">Loading…</div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
              {renderForm()}

              {/* Bottom save bar */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex items-center gap-3">
                <button onClick={save} disabled={saving}
                  className="btn-primary flex items-center gap-1.5">
                  <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
                {success && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 size={13} /> Saved</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
