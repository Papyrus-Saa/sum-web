'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMappings } from '@/hooks/useMappings';
import { Input } from '@/components/input/Input';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function CreateMappingPage() {
  const router = useRouter();
  const { createMapping } = useMappings();

  const [formData, setFormData] = useState({
    sizeRaw: '',
    loadIndex: '',
    speedIndex: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate size format (###/##R## or similar patterns)
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

      const success = await createMapping(requestData);

      if (success) {
        router.push('/admin/mappings');
      } else {
        setError('Failed to create mapping. Please try again.');
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

  return (
    <>
      <AdminHeader
        title="Create New Mapping"
        description="Add a new tire code mapping to the database"
        backLink={{ label: 'Back to Mappings', href: '/admin/mappings' }}
      />

      <div className="bg-card-l dark:bg-card-d rounded shadow-lg border border-border-l dark:border-border-d p-6">
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded">
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
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Mapping'}
            </button>
            <Link
              href="/admin/mappings"
              className={`px-6 py-2.5 text-sm font-medium  bg-hover-l dark:bg-hover-d hover:bg-gray-300 dark:hover:bg-gray-600 rounded ${
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
