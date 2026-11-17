import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { Framework, FRAMEWORK_LIST_PATH } from '../lib/frameworks';
import { useLanguage } from '../lib/LanguageContext';
import { pickField } from '../lib/localizedText';
import { t } from '../lib/translations';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?auto=format&fit=crop&q=80&w=800';

export default function FrameworkDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang, isRtl } = useLanguage();
  const [item, setItem] = useState<Framework | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/investor-education/frameworks/${id}`)
      .then((data: Framework) => {
        setItem(data);
        if (data.imageUrl) setImgSrc(data.imageUrl);
      })
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-400">
        {t(lang, 'detail.loading', 'Loading...')}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">{t(lang, 'detail.frameworkNotFound', 'Framework not found.')}</p>
        <Link to={FRAMEWORK_LIST_PATH} className="text-[#009900] hover:text-amber-600 font-medium">
          {t(lang, 'detail.backToFramework', 'Back to Framework')}
        </Link>
      </div>
    );
  }

  const title       = pickField(lang, item, 'title');
  const description = pickField(lang, item, 'description');
  const content     = pickField(lang, item, 'content');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to={FRAMEWORK_LIST_PATH}
            className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors"
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {t(lang, 'detail.backToFramework', 'Back to Framework')}
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-4 tracking-widest uppercase">
            {t(lang, 'detail.frameworkBadge', 'Framework')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight" dir={isRtl ? 'rtl' : 'ltr'}>
            {title}
          </h1>
        </div>
      </div>

      {/* Wide content card */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-8">
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-10 lg:p-14 overflow-hidden min-w-0" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Top row: small image card + description */}
            <div className={`flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-gray-100 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
              {/* Small image card */}
              <div className="flex-shrink-0 self-start">
                <div className="w-48 sm:w-56 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                  <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-36 sm:h-44 object-cover"
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                  />
                </div>
              </div>
              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed flex-1">
                {description}
              </p>
            </div>

            {/* Full-width rich content */}
            {content ? (
              <div
                className="prose prose-gray max-w-none overflow-hidden min-w-0
                  prose-headings:text-[#009900] prose-headings:font-bold
                  prose-a:text-[#009900] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-800
                  prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto
                  prose-li:text-gray-600 prose-p:text-gray-600
                  prose-table:block prose-table:overflow-x-auto prose-table:w-full
                  text-gray-600 leading-relaxed education-content"
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
