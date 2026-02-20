'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMappings } from '@/hooks/useMappings';
import { Input } from '@/components/input/Input';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface EditMappingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditMappingPage({ params }: EditMappingPageProps) {
  const router = useRouter();
  const { mappings, fetchMappings, updateMapping } = useMappings();

  const [mappingId, setMappingId] = useState<string>('');
  const [formData, setFormData] = useState({
    sizeRaw: '',
    loadIndex: '',
    speedIndex: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(resolvedParams => {
      setMappingId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!mappingId) return;

    const loadMapping = async () => {
      setIsLoading(true);
      await fetchMappings();
      setIsLoading(false);
    };

    loadMapping();
  }, [mappingId, fetchMappings]);

  useEffect(() => {
    if (!mappingId || mappings.length === 0) return;

    const mapping = mappings.find(m => m.id === mappingId);
    if (mapping) {
      setFormData({
        sizeRaw: mapping.sizeRaw,
        loadIndex: '',
        speedIndex: ''
      });
    } else {
      setError('Mapping not found');
    }
  }, [mappingId, mappings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate size format
      const sizePattern = /^\d{3}\/\d{2}[A-Z]\d{2}$/;
      if (!sizePattern.test(formData.sizeRaw)) {
        setError('Invalid size format. Expected format: 205/55R16');
        setIsSubmitting(false);
        return;
      }

      const requestData = {
        sizeRaw: formData.sizeRaw,
        ...(formData.loadIndex && { loadIndex: parseInt(formData.loadIndex, 10) }),
        ...(formData.speedIndex && { speedIndex: formData.speedIndex })
      };

      const success = await updateMapping(mappingId, requestData);

      if (success) {
        router.push('/admin/mappings');
      } else {
        setError('Failed to update mapping. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Edit Mapping"
        description="Update tire code mapping details"
        backLink={{ label: 'Back to Mappings', href: '/admin/mappings' }}
      />

      <div className="bg-card-l dark:bg-card-d rounded shadow-lg border border-border-l dark:border-border-d p-6">
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded-lg">
              <p className="text-sm text-error-text-l dark:text-error-text-d">{error}</p>
            </div>
          )}

          {/* Size Raw (Required) */}
          <div className="mb-6">
            <Input
              id="sizeRaw"
              type="text"
              required
              value={formData.sizeRaw}
              onChange={e => handleChange('sizeRaw', e.target.value)}
              placeholder="205/55R16"
              disabled={isSubmitting}
              label="Tire Size (Raw)"
              labelClassName="block text-sm font-medium mb-2"
            />
            <p className="mt-1 text-xs">
              Format: 205/55R16 (width/aspect-ratio + construction + rim-diameter)
            </p>
          </div>

          {/* Load Index (Optional) */}
          <div className="mb-6">
            <Input
              id="loadIndex"
              type="text"
              value={formData.loadIndex}
              onChange={e => handleChange('loadIndex', e.target.value)}
              placeholder="91"
              disabled={isSubmitting}
              label="Load Index (Optional)"
              labelClassName="block text-sm font-medium mb-2"
            />
            <p className="mt-1 text-xs">Load capacity indicator (e.g., 91 = 615 kg)</p>
          </div>

          {/* Speed Index (Optional) */}
          <div className="mb-6">
            <Input
              id="speedIndex"
              type="text"
              value={formData.speedIndex}
              onChange={e => handleChange('speedIndex', e.target.value)}
              placeholder="V"
              disabled={isSubmitting}
              label="Speed Index (Optional)"
              labelClassName="block text-sm font-medium mb-2"
            />
            <p className="mt-1 text-xs">Maximum speed rating (e.g., V = 240 km/h)</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.sizeRaw}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/mappings"
              className={`px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-hover-l dark:bg-hover-d hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 ${
                isSubmitting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
