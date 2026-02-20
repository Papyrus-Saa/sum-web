'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminHeaderProps {
  title: string;
  description?: string;
  backLink?: {
    label: string;
    href: string;
  };
  actions?: ReactNode;
}

export function AdminHeader({ title, description, backLink, actions }: AdminHeaderProps) {
  return (
    <header className="bg-card-l dark:bg-card-d border-b border-border-l dark:border-border-d mb-6">
      <div className="p-6">
        {backLink && (
          <Link
            href={backLink.href}
            className="text-sm  hover:text-primary mb-3 inline-block transition-colors"
          >
            ← {backLink.label}
          </Link>
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {description && <p className="text-sm  mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-4">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
