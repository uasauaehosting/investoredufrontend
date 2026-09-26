import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { InvestmentProduct, investmentProductDetailPath } from '../lib/investmentProducts';
import { useLanguage } from '../lib/LanguageContext';
import { pickField } from '../lib/localizedText';
import { t } from '../lib/translations';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?auto=format&fit=crop&q=80&w=800';

function ProductCard({ item }: { item: InvestmentProduct }) {
  const { lang, isRtl } = useLanguage();
  const [imgSrc, setImgSrc] = useState(item.imageUrl || FALLBACK_IMAGE);
  const title = pickField(lang, item, 'title');

  return (
    <Link
      to={investmentProductDetailPath(item.id)}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </div>
      <div className="p-6 flex flex-col flex-1" dir={isRtl ? 'rtl' : 'ltr'}>
        <h3 className="text-lg font-bold text-[#009900] mb-3 group-hover:text-green-700 transition-colors">
          {title}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#009900] mt-5 group-hover:text-amber-600 transition-colors">
          {t(lang, 'investmentProducts.readMore', 'Read More')}
          {isRtl
            ? <ArrowLeft  size={14} className="group-hover:-translate-x-1 transition-transform" />
            : <ArrowRight size={14} className="group-hover:translate-x-1  transition-transform" />}
        </span>
      </div>
    </Link>
  );
}

export default function InvestmentProductsLiterature() {
  const { lang, isRtl } = useLanguage();
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/investor-education/investment-products')
      .then((data) => setProducts(data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/education/reading-materials"
            className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors"
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {t(lang, 'investmentProducts.backTo', 'Back to Reading Materials')}
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            {t(lang, 'investmentProducts.badge', 'Reading Materials')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            {t(lang, 'investmentProducts.title', 'Investment Products / Literature')}
          </h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#009900] mb-8"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {t(lang, 'investmentProducts.library', 'Investment Products Library')}
          </h2>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 animate-pulse overflow-hidden">
                  <div className="aspect-[16/10] bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {t(lang, 'investmentProducts.empty', 'No investment products have been published yet.')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
