import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'standalone' | 'embedded';
}

export default function Breadcrumb({ items, variant = 'standalone' }: BreadcrumbProps) {
  const isEmbedded = variant === 'embedded';

  return (
    <nav aria-label="Breadcrumb" className={isEmbedded ? undefined : 'py-5'}>
      <ol
        className={
          isEmbedded
            ? 'flex flex-wrap items-center gap-1 text-sm'
            : 'inline-flex flex-wrap items-center gap-0.5 px-3 py-2 bg-white rounded-xl border border-gray-100 shadow-sm'
        }
      >
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;
          const isLink = Boolean(item.href) && !isLast;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={13}
                  className="mx-1 shrink-0 text-gray-300 rtl:rotate-180"
                  aria-hidden="true"
                />
              )}
              {isLink ? (
                <Link
                  to={item.href!}
                  className={
                    isEmbedded
                      ? 'inline-flex items-center gap-1 text-gray-500 hover:text-[#009900] transition-colors'
                      : 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm text-gray-500 hover:text-[#009900] hover:bg-green-50 transition-colors'
                  }
                >
                  {isFirst && <Home size={13} className="shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className={
                    isEmbedded
                      ? 'inline-flex items-center gap-1 text-[#009900] font-medium'
                      : `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm ${
                          isLast
                            ? 'bg-[#009900] text-white font-medium shadow-sm'
                            : 'text-gray-500'
                        }`
                  }
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isFirst && <Home size={13} className="shrink-0" />}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
