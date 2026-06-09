import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  items: BreadcrumbItem[];
  backLink?: { to: string; label: string };
}

export default function PageHeader({ title, items, backLink }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Breadcrumb items={items} variant="embedded" />

        {backLink && (
          <Link
            to={backLink.to}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#009900] mt-4 transition-colors"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" />
            {backLink.label}
          </Link>
        )}

        <div className={backLink ? 'mt-3' : 'mt-5'}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#009900] tracking-tight">
            {title}
          </h1>
          <div className="h-1 w-14 bg-amber-400 mt-3 rounded-full" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
