import { Plus, Trash2 } from 'lucide-react';
import {
  TextField,
  TextAreaField,
  StringListEditor,
  ImageField,
  FileField,
  SectionHeading,
  ArabicTextField,
  ArabicTextAreaField,
  ArabicSectionDivider,
  EnglishFieldsGroup,
  ArabicFieldsGroup,
} from './FormFields';

const cardClass = 'bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3';
const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009900]/20 focus:border-[#009900]';
const labelClass = 'block text-xs font-medium text-gray-500 mb-1';

const ICON_OPTIONS = [
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Shield', label: 'Shield' },
  { value: 'Globe', label: 'Globe' },
];

type FormProps<T> = {
  data: T;
  onChange: (data: T) => void;
};

function asArray<T>(value: T[] | undefined | null, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback;
}

// ─── Home Welcome ─────────────────────────────────────────────────────────────

export interface HomeWelcomeContent {
  badge: string;
  badgeAr?: string;
  title: string;
  titleAr?: string;
  paragraphs: string[];
  paragraphsAr?: string[];
  ctaText: string;
  ctaTextAr?: string;
  ctaHref: string;
  highlights: { icon: string; title: string; description: string }[];
  highlightsAr?: { icon: string; title: string; description: string }[];
}

export function HomeWelcomeForm({ data, onChange }: FormProps<HomeWelcomeContent>) {
  const highlights = asArray(data.highlights, [{ icon: 'TrendingUp', title: '', description: '' }]);

  const set = <K extends keyof HomeWelcomeContent>(key: K, value: HomeWelcomeContent[K]) =>
    onChange({ ...data, [key]: value });

  const updateHighlight = (index: number, field: keyof HomeWelcomeContent['highlights'][0], value: string) => {
    const next = [...highlights];
    next[index] = { ...next[index], [field]: value };
    set('highlights', next);
  };

  return (
    <div className="space-y-6">
      <SectionHeading title="Welcome Section" description="Main hero content on the home page" />
      <EnglishFieldsGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Badge Text" value={data.badge ?? ''} onChange={(v) => set('badge', v)} placeholder="Welcome" />
          <TextField label="Button Text" value={data.ctaText ?? ''} onChange={(v) => set('ctaText', v)} placeholder="Explore the Portal" />
        </div>
        <TextField label="Heading" value={data.title ?? ''} onChange={(v) => set('title', v)} />
        <TextField label="Button Link" value={data.ctaHref ?? ''} onChange={(v) => set('ctaHref', v)} hint="Use # for same-page anchor or a full URL" />
        <StringListEditor label="Intro Paragraphs" items={data.paragraphs} onChange={(v) => set('paragraphs', v)} addLabel="Add paragraph" />
      </EnglishFieldsGroup>

      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ArabicTextField label="نص الشارة (عربي)" value={data.badgeAr ?? ''} onChange={(v) => set('badgeAr', v)} englishValue={data.badge ?? ''} />
          <ArabicTextField label="نص الزر (عربي)" value={data.ctaTextAr ?? ''} onChange={(v) => set('ctaTextAr', v)} englishValue={data.ctaText ?? ''} />
        </div>
        <ArabicTextField label="العنوان (عربي)" value={data.titleAr ?? ''} onChange={(v) => set('titleAr', v)} englishValue={data.title ?? ''} />
        <StringListEditor label="فقرات المقدمة (عربي)" items={data.paragraphsAr} onChange={(v) => set('paragraphsAr', v)} addLabel="إضافة فقرة" placeholder="نص عربي..." isArabic />
      </ArabicFieldsGroup>

      <SectionHeading title="Highlight Cards" description="Three feature cards shown beside the welcome text" />
      <EnglishFieldsGroup>
        <div className="space-y-3">
          {highlights.map((item, index) => (
            <div key={index} className={cardClass}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Card {index + 1}</span>
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => set('highlights', highlights.filter((_, i) => i !== index))}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div>
                <label className={labelClass}>Icon</label>
                <select
                  value={item.icon}
                  onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                  className={inputClass}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <TextField label="Title" value={item.title} onChange={(v) => updateHighlight(index, 'title', v)} />
              <TextAreaField label="Description" value={item.description} onChange={(v) => updateHighlight(index, 'description', v)} rows={2} />
            </div>
          ))}
          {highlights.length < 6 && (
            <button
              type="button"
              onClick={() => set('highlights', [...highlights, { icon: 'TrendingUp', title: '', description: '' }])}
              className="flex items-center gap-1.5 text-xs font-medium text-[#009900]"
            >
              <Plus size={14} /> Add highlight card
            </button>
          )}
        </div>
      </EnglishFieldsGroup>

      <ArabicFieldsGroup>
        <SectionHeading title="Highlight Cards (Arabic)" description="Arabic titles and descriptions for each card" />
        <div className="space-y-3">
          {highlights.map((item, index) => {
            const arItems = asArray(data.highlightsAr, highlights.map(() => ({ icon: item.icon, title: '', description: '' })));
            const arItem = arItems[index] ?? { icon: item.icon, title: '', description: '' };
            const updateAr = (field: 'title' | 'description', value: string) => {
              const next = [...arItems];
              next[index] = { ...arItem, [field]: value };
              set('highlightsAr', next);
            };
            return (
              <div key={`ar-${index}`} className={cardClass}>
                <span className="text-xs font-semibold text-gray-500">البطاقة {index + 1}</span>
                <ArabicTextField label="العنوان" value={arItem.title} onChange={(v) => updateAr('title', v)} englishValue={item.title} />
                <ArabicTextAreaField label="الوصف" value={arItem.description} onChange={(v) => updateAr('description', v)} rows={2} englishValue={item.description} />
              </div>
            );
          })}
        </div>
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Home Portal Section ────────────────────────────────────────────────────

export interface HomePortalContent {
  heroImage: string;
  cards: { title: string; href: string; image_url: string }[];
}

export function HomePortalForm({ data, onChange }: FormProps<HomePortalContent>) {
  const cards = asArray(data.cards, [{ title: '', href: '', image_url: '' }]);

  const set = <K extends keyof HomePortalContent>(key: K, value: HomePortalContent[K]) =>
    onChange({ ...data, [key]: value });

  const updateCard = (index: number, field: keyof HomePortalContent['cards'][0], value: string) => {
    const next = [...cards];
    next[index] = { ...next[index], [field]: value };
    set('cards', next);
  };

  return (
    <div className="space-y-6">
      <SectionHeading title="Portal Section" description="Banner and navigation cards below the hero slider" />
      <ImageField label="Banner Image" value={data.heroImage ?? ''} onChange={(v) => set('heroImage', v)} />

      <SectionHeading title="Portal Cards" description="Clickable cards linking to main sections" />
      <div className="space-y-3">
        {cards.map((card, index) => (
          <div key={index} className={cardClass}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Card {index + 1}</span>
              {cards.length > 1 && (
                <button
                  type="button"
                  onClick={() => set('cards', cards.filter((_, i) => i !== index))}
                  className="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <TextField label="Title" value={card.title} onChange={(v) => updateCard(index, 'title', v)} />
            <TextField label="Link" value={card.href} onChange={(v) => updateCard(index, 'href', v)} placeholder="/education/reading-materials/principles" />
            <ImageField label="Card Image" value={card.image_url} onChange={(v) => updateCard(index, 'image_url', v)} />
          </div>
        ))}
        <button
          type="button"
          onClick={() => set('cards', [...cards, { title: '', href: '', image_url: '' }])}
          className="flex items-center gap-1.5 text-xs font-medium text-[#009900]"
        >
          <Plus size={14} /> Add portal card
        </button>
      </div>
    </div>
  );
}

// ─── About Hero ─────────────────────────────────────────────────────────────

export interface AboutHeroContent {
  badge: string;
  badgeAr?: string;
  title: string;
  titleAr?: string;
}

export function AboutHeroForm({ data, onChange }: FormProps<AboutHeroContent>) {
  const set = <K extends keyof AboutHeroContent>(key: K, value: AboutHeroContent[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <SectionHeading title="About Page Hero" description="Top banner on the About page. Body paragraphs are edited in the About section." />
      <EnglishFieldsGroup>
        <TextField label="Badge Text" value={data.badge} onChange={(v) => set('badge', v)} placeholder="About UASA" />
        <TextField label="Page Title" value={data.title} onChange={(v) => set('title', v)} />
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <ArabicTextField label="نص الشارة (عربي)" value={data.badgeAr ?? ''} onChange={(v) => set('badgeAr', v)} englishValue={data.badge} />
        <ArabicTextField label="عنوان الصفحة (عربي)" value={data.titleAr ?? ''} onChange={(v) => set('titleAr', v)} englishValue={data.title} />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Principles Page ──────────────────────────────────────────────────────────

export interface PrinciplesPageContent {
  introParagraphs: string[];
  introParagraphsAr?: string[];
  objectives: string[];
  objectivesAr?: string[];
  benefits: string[];
  benefitsAr?: string[];
}

export function PrinciplesPageForm({ data, onChange }: FormProps<PrinciplesPageContent>) {
  const set = <K extends keyof PrinciplesPageContent>(key: K, value: PrinciplesPageContent[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <SectionHeading title="Principles Page" description="Intro text and bullet lists on the Principles overview page" />
      <EnglishFieldsGroup>
        <StringListEditor label="Introduction Paragraphs" items={data.introParagraphs} onChange={(v) => set('introParagraphs', v)} addLabel="Add paragraph" />
        <StringListEditor label="Objectives" items={data.objectives} onChange={(v) => set('objectives', v)} addLabel="Add objective" placeholder="Promote financial literacy..." />
        <StringListEditor label="Benefits" items={data.benefits} onChange={(v) => set('benefits', v)} addLabel="Add benefit" placeholder="Better understanding of..." />
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <StringListEditor label="فقرات المقدمة (عربي)" items={data.introParagraphsAr} onChange={(v) => set('introParagraphsAr', v)} addLabel="إضافة فقرة" placeholder="نص عربي..." isArabic />
        <StringListEditor label="الأهداف (عربي)" items={data.objectivesAr} onChange={(v) => set('objectivesAr', v)} addLabel="إضافة هدف" placeholder="نص عربي..." isArabic />
        <StringListEditor label="الفوائد (عربي)" items={data.benefitsAr} onChange={(v) => set('benefitsAr', v)} addLabel="إضافة فائدة" placeholder="نص عربي..." isArabic />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Framework Page ─────────────────────────────────────────────────────────

export interface FrameworkPageContent {
  introParagraphs: string[];
  introParagraphsAr?: string[];
  practices: string[];
  practicesAr?: string[];
  imageUrl: string;
  pdfUrl: string;
}

export function FrameworkPageForm({ data, onChange }: FormProps<FrameworkPageContent>) {
  const set = <K extends keyof FrameworkPageContent>(key: K, value: FrameworkPageContent[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <SectionHeading title="Framework Page" description="IOSCO framework content on the Framework page" />
      <EnglishFieldsGroup>
        <StringListEditor label="Introduction Paragraphs" items={data.introParagraphs} onChange={(v) => set('introParagraphs', v)} addLabel="Add paragraph" />
        <StringListEditor label="Best Practices" items={data.practices} onChange={(v) => set('practices', v)} addLabel="Add practice" />
        <ImageField label="Framework Image" value={data.imageUrl} onChange={(v) => set('imageUrl', v)} />
        <FileField label="PDF Document" value={data.pdfUrl} onChange={(v) => set('pdfUrl', v)} hint="Upload the IOSCO framework PDF" />
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <StringListEditor label="فقرات المقدمة (عربي)" items={data.introParagraphsAr} onChange={(v) => set('introParagraphsAr', v)} addLabel="إضافة فقرة" placeholder="نص عربي..." isArabic />
        <StringListEditor label="أفضل الممارسات (عربي)" items={data.practicesAr} onChange={(v) => set('practicesAr', v)} addLabel="إضافة ممارسة" placeholder="نص عربي..." isArabic />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── The Index Page ─────────────────────────────────────────────────────────

export interface TheIndexContent {
  content: string;
  contentAr?: string;
}

export function TheIndexForm({ data, onChange }: FormProps<TheIndexContent>) {
  return (
    <div className="space-y-6">
      <SectionHeading title="The Index Page" description="Main body text for the Financial Inclusion Index page" />
      <EnglishFieldsGroup>
        <TextAreaField
          label="Page Content"
          value={data.content}
          onChange={(v) => onChange({ ...data, content: v })}
          rows={8}
          placeholder="Describe the financial inclusion index..."
        />
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <ArabicTextAreaField
          label="محتوى الصفحة (عربي)"
          value={data.contentAr ?? ''}
          onChange={(v) => onChange({ ...data, contentAr: v })}
          rows={8}
          englishValue={data.content}
        />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Benchmarking Page ──────────────────────────────────────────────────────

export interface BenchmarkingPageContent {
  intro: string;
  introAr?: string;
}

export function BenchmarkingPageForm({ data, onChange }: FormProps<BenchmarkingPageContent>) {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Benchmarking Page"
        description="Intro text shown on /inclusion/index/benchmarking. Table records are managed under Members' Benchmarking in the admin sidebar."
      />
      <EnglishFieldsGroup>
        <TextAreaField
          label="Introduction"
          value={data.intro}
          onChange={(v) => onChange({ ...data, intro: v })}
          rows={4}
          placeholder="Describe the benchmarking exercise..."
        />
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <ArabicTextAreaField
          label="المقدمة (عربي)"
          value={data.introAr ?? ''}
          onChange={(v) => onChange({ ...data, introAr: v })}
          rows={4}
          englishValue={data.intro}
        />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Additional Resources Page ──────────────────────────────────────────────

export interface AdditionalResourcesContent {
  intro: string;
  introAr?: string;
  resources: { title: string; url: string; description?: string }[];
}

export function AdditionalResourcesForm({ data, onChange }: FormProps<AdditionalResourcesContent>) {
  const resources = asArray(data.resources, [{ title: '', url: '', description: '' }]);

  const updateResource = (index: number, field: 'title' | 'url' | 'description', value: string) => {
    const next = [...resources];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...data, resources: next });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Additional Resources Page"
        description="Content for /inclusion/index/resources"
      />
      <EnglishFieldsGroup>
        <TextAreaField
          label="Introduction"
          value={data.intro}
          onChange={(v) => onChange({ ...data, intro: v })}
          rows={4}
        />
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <ArabicTextAreaField
          label="المقدمة (عربي)"
          value={data.introAr ?? ''}
          onChange={(v) => onChange({ ...data, introAr: v })}
          rows={4}
          englishValue={data.intro}
        />
      </ArabicFieldsGroup>
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Resource Links</p>
        {resources.map((resource, index) => (
          <div key={index} className={cardClass}>
            <TextField label="Title" value={resource.title} onChange={(v) => updateResource(index, 'title', v)} />
            <TextField label="URL" value={resource.url} onChange={(v) => updateResource(index, 'url', v)} placeholder="https://..." />
            <TextAreaField label="Description" value={resource.description ?? ''} onChange={(v) => updateResource(index, 'description', v)} rows={2} />
            <button type="button" onClick={() => onChange({ ...data, resources: resources.filter((_, i) => i !== index) })} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
              <Trash2 size={12} /> Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...data, resources: [...resources, { title: '', url: '', description: '' }] })} className="text-xs text-[#009900] hover:text-green-700 flex items-center gap-1">
          <Plus size={12} /> Add resource
        </button>
      </div>
    </div>
  );
}

// ─── Feedback Page ──────────────────────────────────────────────────────────

export interface FeedbackContent {
  title: string;
  titleAr?: string;
  subtitle: string;
  subtitleAr?: string;
  contactEmail: string;
  contactWebsite: string;
}

export function FeedbackForm({ data, onChange }: FormProps<FeedbackContent>) {
  const set = <K extends keyof FeedbackContent>(key: K, value: FeedbackContent[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <SectionHeading title="Feedback Page" description="Header and contact details shown on the Feedback page" />
      <EnglishFieldsGroup>
        <TextField label="Page Title" value={data.title} onChange={(v) => set('title', v)} placeholder="Feedback & Inquiries" />
        <TextAreaField label="Subtitle" value={data.subtitle} onChange={(v) => set('subtitle', v)} rows={2} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Contact Email" value={data.contactEmail} onChange={(v) => set('contactEmail', v)} type="email" />
          <TextField label="Contact Website" value={data.contactWebsite} onChange={(v) => set('contactWebsite', v)} placeholder="https://..." />
        </div>
      </EnglishFieldsGroup>
      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <ArabicTextField label="عنوان الصفحة (عربي)" value={data.titleAr ?? ''} onChange={(v) => set('titleAr', v)} englishValue={data.title} />
        <ArabicTextAreaField label="العنوان الفرعي (عربي)" value={data.subtitleAr ?? ''} onChange={(v) => set('subtitleAr', v)} rows={2} englishValue={data.subtitle} />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

export interface FooterContent {
  educationLinks: string[];
  educationLinksAr?: string[];
  inclusionLinks: string[];
  inclusionLinksAr?: string[];
  usefulLinks: { label: string; href: string }[];
  address: string;
  addressAr?: string;
  phone: string;
  email: string;
}

export function FooterForm({ data, onChange }: FormProps<FooterContent>) {
  const usefulLinks = asArray(data.usefulLinks, [{ label: '', href: '' }]);

  const set = <K extends keyof FooterContent>(key: K, value: FooterContent[K]) =>
    onChange({ ...data, [key]: value });

  const updateLink = (index: number, field: 'label' | 'href', value: string) => {
    const next = [...usefulLinks];
    next[index] = { ...next[index], [field]: value };
    set('usefulLinks', next);
  };

  return (
    <div className="space-y-6">
      <SectionHeading title="Footer" description="Links and contact information in the site footer. Stats are edited separately." />
      <EnglishFieldsGroup>
        <StringListEditor label="Investor Education Links" items={data.educationLinks} onChange={(v) => set('educationLinks', v)} addLabel="Add link" placeholder="Investment Basics" />
        <StringListEditor label="Financial Inclusion Links" items={data.inclusionLinks} onChange={(v) => set('inclusionLinks', v)} addLabel="Add link" placeholder="Financial Literacy" />

        <div>
          <label className={labelClass}>Useful Links</label>
          <div className="space-y-2">
            {usefulLinks.map((link, index) => (
              <div key={index} className={`${cardClass} !p-3`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={link.label} onChange={(e) => updateLink(index, 'label', e.target.value)} placeholder="Link label" className={inputClass} />
                  <input value={link.href} onChange={(e) => updateLink(index, 'href', e.target.value)} placeholder="https://..." className={inputClass} />
                </div>
                <button type="button" onClick={() => set('usefulLinks', usefulLinks.filter((_, i) => i !== index))} className="text-xs text-red-500 hover:text-red-700 mt-1">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => set('usefulLinks', [...usefulLinks, { label: '', href: '' }])} className="flex items-center gap-1.5 text-xs font-medium text-[#009900]">
              <Plus size={14} /> Add useful link
            </button>
          </div>
        </div>

        <TextAreaField label="Address" value={data.address} onChange={(v) => set('address', v)} rows={3} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Phone" value={data.phone} onChange={(v) => set('phone', v)} />
          <TextField label="Email" value={data.email} onChange={(v) => set('email', v)} type="email" />
        </div>
      </EnglishFieldsGroup>

      <ArabicSectionDivider />
      <ArabicFieldsGroup>
        <StringListEditor label="روابط التعليم الاستثماري (عربي)" items={data.educationLinksAr} onChange={(v) => set('educationLinksAr', v)} addLabel="إضافة رابط" placeholder="نص عربي..." isArabic />
        <StringListEditor label="روابط الشمول المالي (عربي)" items={data.inclusionLinksAr} onChange={(v) => set('inclusionLinksAr', v)} addLabel="إضافة رابط" placeholder="نص عربي..." isArabic />
        <ArabicTextAreaField label="العنوان (عربي)" value={data.addressAr ?? ''} onChange={(v) => set('addressAr', v)} rows={3} englishValue={data.address} />
      </ArabicFieldsGroup>
    </div>
  );
}

// ─── Glossary Meta ──────────────────────────────────────────────────────────

export interface GlossaryMetaContent {
  pdfUrl: string;
  backgroundImage: string;
}

export function GlossaryMetaForm({ data, onChange }: FormProps<GlossaryMetaContent>) {
  const set = <K extends keyof GlossaryMetaContent>(key: K, value: GlossaryMetaContent[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <SectionHeading title="Glossary Page Settings" description="PDF download and background image. Terms are edited in the Glossary section." />
      <FileField label="PDF Download" value={data.pdfUrl} onChange={(v) => set('pdfUrl', v)} hint="Glossary PDF available for download on the page" />
      <ImageField label="Background Image" value={data.backgroundImage} onChange={(v) => set('backgroundImage', v)} />
    </div>
  );
}
