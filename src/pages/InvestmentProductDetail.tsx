import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { api } from '../lib/api';
import {
  InvestmentProductItem,
  InvestmentProductBlock,
  INVESTMENT_PRODUCTS_LIST_PATH,
} from '../lib/investmentProducts';
import { parseInvestmentProductContent } from '../lib/investmentProductContent';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200';

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

export default function InvestmentProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InvestmentProductItem | null>(null);
  const [blocks, setBlocks] = useState<InvestmentProductBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMAGE);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/investor-education/investment-products/${id}`)
      .then((data: InvestmentProductItem) => {
        setItem(data);
        setBlocks(parseInvestmentProductContent(data.content));
        if (data.imageUrl) setImgSrc(data.imageUrl);
      })
      .catch(() => {
        setItem(null);
        setBlocks([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-gray-400">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-500 mb-4">Investment product not found.</p>
        <Link to={INVESTMENT_PRODUCTS_LIST_PATH} className="text-[#009900] hover:text-amber-600 font-medium">
          Back to Investment Products/ Literature
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gradient-to-br from-[#009900] to-[#00b300] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to={INVESTMENT_PRODUCTS_LIST_PATH}
            className="inline-flex items-center gap-2 text-green-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Investment Products/ Literature
          </Link>
          <span className="inline-block px-4 py-1.5 bg-amber-400 text-[#009900] text-xs font-bold rounded-full mb-4 tracking-widest uppercase">
            Investment Products/ Literature
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{item.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center justify-center p-6 sm:p-8 lg:p-10">
              <img
                src={imgSrc}
                alt={item.title}
                className="w-full max-h-72 sm:max-h-96 lg:max-h-[32rem] object-contain rounded-2xl"
                onError={() => setImgSrc(FALLBACK_IMAGE)}
              />
            </div>
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                {item.description}
              </p>
              {blocks.length > 0 ? (
                <div className="space-y-10">
                  {blocks.map((block, index) => (
                    <ContentBlock key={index} block={block} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">{item.description}</p>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
