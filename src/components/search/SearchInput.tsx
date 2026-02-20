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
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={disabled || loading}
            placeholder={t('searchPlaceholder')}
            className="w-full px-4 py-2.5 text-base border border-border-l dark:border-border-d rounded bg-card-l dark:bg-card-d text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('searchInputLabel')}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || loading || !query.trim()}
          className="px-6 py-2.5 text-base font-medium text-white bg-secondary hover:bg-secondary/90 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
        >
          {loading ? t('searching') : t('searchButton')}
        </button>

        <p className="text-xs text-center mt-1 bg-card-l dark:bg-card-d">{t('searchHint')}</p>
      </div>
    </form>
  );
}
