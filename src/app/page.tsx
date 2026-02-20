'use client';

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { DEFAULT_TRANSLATIONS } from '@/i18n/defaultTranslations';
import { SearchInput } from '@/components/search/SearchInput';
import { SearchResult } from '@/components/search/SearchResult';
import { useSearch } from '@/hooks/useSearch';

export default function Home(): React.ReactElement {
  const { t, ready } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const { data, error, loading, searchType, search } = useSearch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const title = !mounted || !ready ? DEFAULT_TRANSLATIONS.mainTitle : (t('mainTitle') as string);

  return (
    <div className="min-h-[calc(100vh-200px)] py-8">
      <main className="flex flex-col items-center justify-start px-4">
        {/* Title */}
        <h1 className="font-semibold text-center px-1 text-lg sm:text-xl md:text-2xl max-w-2xl mb-8">
          {title}
        </h1>

        {/* Search Input */}
        <SearchInput onSearch={search} loading={loading} />

        {/* Error Message */}
        {error && !loading && (
          <div className="w-full max-w-xl mx-auto mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {data && searchType && !loading && !error && (
          <SearchResult data={data} searchType={searchType} />
        )}
      </main>
    </div>
  );
}
