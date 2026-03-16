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
    <div className="w-full max-w-xl mx-auto  p-5 bg-card-l dark:bg-card-d border border-border-l dark:border-border-d rounded">
      {/* Main Result */}
      <div className="mb-4">
        <span className="text-xs font-medium uppercase tracking-wide">{secondaryLabel}</span>
        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold text-main-d dark:text-main-l">{primaryValue}</span>
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
      <div className="space-y-2 pt-3 border-t border-border-l dark:border-border-d">
        <div className="flex justify-between text-sm">
          <span className="">{t('code')}:</span>
          <span className="font-medium text-main-d dark:text-main-l">{data.code}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="">{t('normalized')}:</span>
          <span className="font-medium text-main-d dark:text-main-l">{data.sizeNormalized}</span>
        </div>
        {data.sizeRaw !== data.sizeNormalized && (
          <div className="flex justify-between text-sm">
            <span className="text-placeholder-l dark:text-placeholder-d">{t('original')}:</span>
            <span className="font-medium text-main-d dark:text-main-l">{data.sizeRaw}</span>
          </div>
        )}
      </div>

      {/* Variant Info */}
      {data.variant && (
        <div className="mt-3 p-2.5 bg-primary/10 rounded-md">
          <div className="text-sm text-main-d dark:text-main-l">
            <span className="font-medium">{t('variant')}: </span>
            {data.variant.loadIndex} {data.variant.speedIndex}
          </div>
        </div>
      )}

      {/* Available Variants List */}
      {data.variants && data.variants.length > 0 && (
        <div className="mt-3">
          <span className="text-xs font-medium text-placeholder-l dark:text-placeholder-d">
            {t('availableVariants')}:
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {data.variants.map(variant => {
              const key = `${variant.loadIndex ?? 'null'}-${variant.speedIndex ?? 'null'}`;
              return (
                <span
                  key={key}
                  className="px-2.5 py-1 text-xs bg-hover-l dark:bg-hover-d text-main-d dark:text-main-l rounded-md"
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
        <div className="mt-3 p-2.5 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle
              size={16}
              className="text-error-text-l dark:text-error-text-d mt-0.5 shrink-0"
            />
            <span className="text-xs text-error-text-l dark:text-error-text-d">
              {t(`warning_${data.warning}`) || data.warning}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
