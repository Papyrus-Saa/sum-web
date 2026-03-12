'use client';

import { useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLookupMappings } from '@/hooks/useLookupMappings';

interface TireSidebarProps {
  className?: string;
  title?: string;
}

export function TireSidebar({ className = '', title }: TireSidebarProps) {
  const { filtered, loading, error, query, setQuery, fetchMappings, data } = useLookupMappings();
  const { t } = useTranslation();

  const sidebarTitle = title ?? t('sidebarTitle');

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  return (
    <aside
      className={`w-full sm:w-64 h-[calc(100vh-var(--header-height))] border-l border-border-l border-r dark:border-border-d poem flex-col overflow-auto ${className}`}
    >
      <div className="p-4 border-b border-border-l dark:border-border-d">
        <div className="text-center mb-3 flex justify-between px-1">
          <h2 className="text-sm font-semibold underline">{sidebarTitle}</h2>
          <span className="text-xs text-muted-l dark:text-muted-d bg-secondary py-1 px-2 rounded text-main-l">
            {data.length}
          </span>
        </div>
        <div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('sidebarSearchPlaceholder')}
            className="w-full px-3 py-2 text-sm border border-border-l dark:border-border-d rounded bg-main-l dark:bg-main-d placeholder-placeholder-l dark:placeholder-placeholder-d focus:outline-none focus:border-secondary"
            aria-label={t('sidebarSearchLabel')}
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 text-xs text-error-text-l dark:text-error-text-d bg-error-l dark:bg-error-d border-b border-error-border-l dark:border-error-border-d">
          {error}
        </div>
      )}

      {loading && (
        <div className="px-4 py-3 text-xs flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
          {t('loading')}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <SidebarList filtered={filtered} loading={loading} t={t} />
      </div>
    </aside>
  );
}

interface SidebarListProps {
  filtered: Array<{ codePublic: string; sizeNormalized: string }>;
  loading: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}

function SidebarList({ filtered, loading, t }: SidebarListProps) {
  if (!loading && filtered.length === 0) {
    return <div className="px-4 py-6 text-xs text-center">{t('tireSidebarNoResults')}</div>;
  }
  return (
    <ul className="divide-y divide-border-l dark:divide-border-d">
      {filtered.map(mapping => (
        <li
          key={mapping.codePublic}
          className="px-4 py-1 hover:bg-secondary-l/5 dark:hover:bg-secondary-d/5  hover:bg-hover-l dark:hover:bg-hover-d"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium tabular-nums">{mapping.codePublic}</span>
            <ArrowRightLeft className="h-3.5 w-3.5 mx-2 shrink-0 text-primary" aria-hidden="true" />
            <span className="font-mono text-xs">{mapping.sizeNormalized}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
