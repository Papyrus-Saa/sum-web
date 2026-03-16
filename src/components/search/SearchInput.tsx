'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SearchInput({ onSearch, loading = false, disabled = false }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-2 mb-6">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={disabled || loading}
            placeholder={t('searchPlaceholder')}
            className="w-full px-4 py-2.5 text-base border border-border-l dark:border-border-d rounded bg-card-l dark:bg-card-d text-main-d dark:text-main-l placeholder:text-placeholder-l dark:placeholder:text-placeholder-d focus:border-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('searchInputLabel')}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
        </div>
        <p className="text-center mt-1 dark:text-placeholder-d text-placeholder-l text-xs lg:text-sm">
          {t('searchHint')}
        </p>
        <button
          type="submit"
          disabled={disabled || loading || !query.trim()}
          className="px-6 py-2.5 text-base font-medium text-white bg-secondary hover:bg-secondary/90 rounded disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
        >
          {loading ? t('searching') : t('searchButton')}
        </button>
      </div>
    </form>
  );
}
