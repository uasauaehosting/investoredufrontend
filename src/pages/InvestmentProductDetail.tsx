import { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import { getInvestmentProduct, InvestmentProductBlock } from '../lib/investmentProducts';

function ContentBlock({ block }: { block: InvestmentProductBlock }) {
  return (
    <div className="space-y-4">
      {block.heading && <h3 className="text-xl sm:text-2xl font-bold text-[#009900]">{block.heading}</h3>}
      {block.paragraphs?.map((paragraph, index) => (
        <p key={index} className="text-gray-600 leading-relaxed">{paragraph}</p>
      ))}
      {block.subItems && (
        <div className="space-y-4">
          {block.subItems.map((item, index) => (
            <div key={index} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <h4 className="font-bold text-[#009900] mb-2">{item.title}</h4>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      )}
      {block.bullets && (
        <ul className="space-y-3 list-disc ps-6 text-gray-600 leading-relaxed">
          {block.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
        </ul>
      )}
      {block.source && <p className="text-sm text-gray-500 italic pt-2">{block.source}</p>}
      {block.externalLink && (
        <a href={block.externalLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#009900] font-semibold hover:text-amber-600 transition-colors">
          Read more: {block.externalLink.label} <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}

interface ProductView {
  title: string;
  imageUrl: string;
  blocks: InvestmentProductBlock[];
}

export default function InvestmentProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductView | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fallback = getInvestmentProduct(slug);
    api
      .get(`/investor-education/investment-products/slug/${slug}`)
      .then((data) => {
        let blocks: InvestmentProductBlock[] = fallback?.blocks ?? [];
        if (data.content) {
          try {
            const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            if (parsed.blocks) blocks = parsed.blocks;
            else if (Array.isArray(parsed)) blocks = parsed;
          } catch { /* use fallback blocks */ }
        }
        setProduct({
          title: data.title ?? fallback?.title ?? '',
          imageUrl: data.imageUrl ?? data.image_url ?? fallback?.imageUrl ?? '',
          blocks,
        });
      })
      .catch(() => {
        if (fallback) {
          setProduct({ title: fallback.title, imageUrl: fallback.imageUrl, blocks: fallback.blocks });
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (notFound || !product) {
    return <Navigate to="/education/reading-materials/products" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/education/reading-materials/products" className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Investment Products/ Literature
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">Investment Products/ Literature</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{product.title}</h1>
          <div className="h-1.5 w-24 bg-amber-400 mt-8 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-16">
          {product.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md mb-10 max-w-3xl">
              <img src={product.imageUrl} alt={product.title} className="w-full h-auto object-cover" />
            </div>
          )}
          <div className="max-w-4xl space-y-10">
            {product.blocks.map((block, index) => (
              <ContentBlock key={index} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
