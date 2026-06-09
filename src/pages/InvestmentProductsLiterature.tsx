import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { INVESTMENT_PRODUCTS } from '../lib/investmentProducts';

interface Product {
  id?: number;
  slug: string;
  title: string;
  imageUrl: string;
  excerpt: string;
}

export default function InvestmentProductsLiterature() {
  const [products, setProducts] = useState<Product[]>(
    INVESTMENT_PRODUCTS.map((p) => ({ slug: p.slug, title: p.title, imageUrl: p.imageUrl, excerpt: p.excerpt })),
  );

  useEffect(() => {
    api
      .get('/investor-education/investment-products')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(
            data.map((p: { id: number; slug?: string; title: string; imageUrl?: string; image_url?: string; description: string }) => ({
              id: p.id,
              slug: p.slug ?? String(p.id),
              title: p.title,
              imageUrl: p.imageUrl ?? p.image_url ?? '',
              excerpt: p.description,
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#00285e] to-[#003580] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/education/reading-materials" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Reading Materials
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#00285e] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Reading Materials</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Investment Products/ Literature</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.slug}
              to={`/education/reading-materials/products/${product.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-[#00285e] mb-3 group-hover:text-blue-700 transition-colors">{product.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{product.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00285e] mt-5 group-hover:text-amber-600 transition-colors">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
