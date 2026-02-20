'use client';

import { useState, useEffect, useRef } from 'react';
import type { LookupResponse } from '@/types/api';
import { useTranslation } from 'react-i18next';
import { Copy, Check, AlertTriangle } from 'lucide-react';

interface SearchResultProps {
  data: LookupResponse;
  searchType: 'code' | 'size';
}

export function SearchResult({ data, searchType }: SearchResultProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout with ref for cleanup
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Silent fail - clipboard API may not be available
      // In production, this would be logged to a service
    }
  };

  // Determine what to highlight based on search type
  const primaryValue = searchType === 'code' ? data.sizeNormalized : data.code;
  const secondaryLabel = searchType === 'code' ? t('tireSize') : t('tireCode');

  return (
    <div className="w-full max-w-xl mx-auto mt-6 p-5 bg-card-l dark:bg-card-d border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Main Result */}
      <div className="mb-4">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {secondaryLabel}
        </span>
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {primaryValue}
          </span>
          <button
            onClick={() => handleCopy(primaryValue)}
            className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-hover-l dark:hover:bg-hover-d rounded-md transition-colors flex items-center gap-1.5"
            aria-label={t('copyToClipboard')}
          >
            {copied ? (
              <>
                <Check size={16} />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy size={16} />
                {t('copy')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('code')}:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{data.code}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{t('normalized')}:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {data.sizeNormalized}
          </span>
        </div>
        {data.sizeRaw !== data.sizeNormalized && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{t('original')}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{data.sizeRaw}</span>
          </div>
        )}
      </div>

      {/* Variant Info */}
      {data.variant && (
        <div className="mt-3 p-2.5 bg-primary/10 rounded-md">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">{t('variant')}: </span>
            {data.variant.loadIndex} {data.variant.speedIndex}
          </div>
        </div>
      )}

      {/* Available Variants List */}
      {data.variants && data.variants.length > 0 && (
        <div className="mt-3">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {t('availableVariants')}:
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.variants.map(variant => {
              // Create unique key from loadIndex and speedIndex combination
              const key = `${variant.loadIndex ?? 'null'}-${variant.speedIndex ?? 'null'}`;
              return (
                <span
                  key={key}
                  className="px-2.5 py-1 text-xs bg-hover-l dark:bg-hover-d text-gray-700 dark:text-gray-300 rounded-md"
                >
                  {variant.loadIndex} {variant.speedIndex}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning */}
      {data.warning && (
        <div className="mt-3 p-2.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle
              size={16}
              className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0"
            />
            <span className="text-xs text-yellow-800 dark:text-yellow-300">
              {t(`warning_${data.warning}`) || data.warning}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
