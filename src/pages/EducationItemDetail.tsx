import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { EducationItem, getSectionMeta, isValidSection } from '../lib/educationSections';
import { useLanguage } from '../lib/LanguageContext';
import { pickField, pickLocalized } from '../lib/localizedText';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800';

export default function EducationItemDetail() {
  const { lang } = useLanguage();
  const { section, id } = useParams<{ section: string; id: string }>();
  const meta = section ? getSectionMeta(section) : null;
  const valid = section && isValidSection(section) && meta;
  const [item, setItem] = useState<EducationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    if (!valid || !id || !section) return;
    setLoading(true);
    api
      .get(`/investor-education/content/${id}`)
      .then((data: EducationItem) => {
        if (data.section !== section) {
          setItem(null);
        } else {
          setItem(data);
          if (data.imageUrl) setImgSrc(data.imageUrl);
        }
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id, section, valid]);

  if (!valid || !meta) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div className="py-24 text-center text-gray-400">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">Content not found.</p>
        <Link to={meta.listPath} className="text-[#009900] hover:text-amber-600 font-medium">
          Back to {pickLocalized(lang, meta.title, meta.titleAr)}
        </Link>
      </div>
    );
  }

  const title = pickField(lang, item, 'title');
  const description = pickField(lang, item, 'description');
  const content = pickLocalized(lang, item.content, item.contentAr);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to={meta.listPath}
          className="inline-flex items-center gap-2 text-[#009900] hover:text-amber-600 mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to {pickLocalized(lang, meta.title, meta.titleAr)}
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-72 sm:h-96 object-cover"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
          <div className="p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#009900] mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
              {description}
            </p>
            {content ? (
              <div
                className="prose prose-blue max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-gray-500">{description}</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
