'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMappings } from '@/hooks/useMappings';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function MappingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mappings, isLoading, error, fetchMappings, deleteMapping } = useMappings();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; codePublic: string } | null>(
    null
  );
  const [flashMessage, setFlashMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    status?: 'created' | 'updated' | 'deleted';
  } | null>(null);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  useEffect(() => {
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    if (!status || !message) return;

    // Evitar setState directo: usar microtask para evitar render en cascada
    Promise.resolve().then(() => {
      if (status === 'created' || status === 'updated') {
        setFlashMessage({ type: 'success', text: message, status });
      } else {
        setFlashMessage({ type: 'success', text: message });
      }
      router.replace('/admin/mappings');
    });
  }, [router, searchParams]);

  useEffect(() => {
    if (!flashMessage) return;
    const timer = setTimeout(() => setFlashMessage(null), 4500);
    return () => clearTimeout(timer);
  }, [flashMessage]);

  const handleDelete = async (id: string, codePublic: string) => {
    setConfirmTarget({ id, codePublic });
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    const { id } = confirmTarget;
    setDeletingId(id);
    const result = await deleteMapping(id);
    setDeletingId(null);
    setConfirmTarget(null);

    if (!result.success) {
      setFlashMessage({
        type: 'error',
        text: result.error || 'Failed to delete mapping. Please try again.'
      });
      return;
    }

    setFlashMessage({
      type: 'success',
      text: result.message || 'Mapping deleted successfully',
      status: 'deleted'
    });
  };

  const filteredMappings = mappings.filter(mapping => {
    const query = searchQuery.toLowerCase();
    return (
      mapping.codePublic.toLowerCase().includes(query) ||
      mapping.sizeRaw.toLowerCase().includes(query) ||
      mapping.sizeNormalized?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <AdminHeader
        title="Tire Code Mappings"
        description="Manage tire code mappings and normalized sizes"
        backLink={{ label: 'Back to Dashboard', href: '/admin' }}
        actions={
          <Link
            href="/admin/mappings/new"
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors duration-200"
          >
            + Create Mapping
          </Link>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by code or size..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 text-base border border-border-l dark:border-border-d rounded bg-card-l dark:bg-card-d placeholder-placeholder-l dark:placeholder-placeholder-d focus:outline-none focus:border-primary dark:focus:border-primary"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded">
          <p className="text-sm text-error-text-l dark:text-error-text-d">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredMappings.length === 0 && (
        <div className="text-center py-12">
          <p className="mb-4">
            {searchQuery
              ? 'No mappings found matching your search.'
              : 'No mappings yet. Create your first one!'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/mappings/new"
              className="px-6 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded inline-block"
            >
              Create First Mapping
            </Link>
          )}
        </div>
      )}

      {/* Mappings Table */}
      {!isLoading && filteredMappings.length > 0 && (
        <div className="bg-card-l dark:bg-card-d rounded border border-border-l dark:border-border-d overflow-hidden">
          <table className="min-w-full divide-y divide-border-l dark:divide-border-d">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Size (Raw)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Size (Normalized)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-l dark:divide-border-d">
              {filteredMappings.map(mapping => (
                <tr key={mapping.id} className="hover:bg-hover-l dark:hover:bg-hover-d">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-tireMappingAdmin-green dark:bg-tireMappingAdmin-green/10 bg-tireMappingAdmin-green/5">
                    {mapping.codePublic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tireMappingAdmin-orange dark:bg-tireMappingAdmin-orange/10 bg-tireMappingAdmin-orange/5">
                    {mapping.sizeRaw}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-tireMappingAdmin-purple dark:bg-tireMappingAdmin-purple/10 bg-tireMappingAdmin-purple/5">
                    {mapping.sizeNormalized || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/mappings/${mapping.id}/edit`}
                      className="text-primary hover:text-primary/90 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(mapping.id, mapping.codePublic)}
                      disabled={deletingId === mapping.id}
                      className="text-delate cursor-pointer hover:text-delate/50 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingId === mapping.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && filteredMappings.length > 0 && (
        <div className="mt-4 text-sm bg-card-l dark:bg-card-d rounded p-2">
          Showing {filteredMappings.length} of {mappings.length} mappings
        </div>
      )}

      {flashMessage && (
        <div className="mt-4 p-4 rounded border bg-card-l dark:bg-card-d">
          <div
            className={`text-sm ${
              flashMessage.type === 'success'
                ? flashMessage.status === 'created'
                  ? 'text-mapping-created'
                  : flashMessage.status === 'updated'
                    ? 'text-mapping-updated'
                    : flashMessage.status === 'deleted'
                      ? 'text-mapping-deleted'
                      : 'text-mapping-created'
                : 'text-error-text-l dark:text-error-text-d'
            }`}
          >
            {flashMessage.text}
          </div>
        </div>
      )}

      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-card-l dark:bg-card-d border border-border-l dark:border-border-d p-5">
            <h3 className="text-base font-semibold text-primary mb-2">Confirm delete</h3>
            <p className="text-sm mb-4">
              Are you sure you want to delete mapping for code &quot;{confirmTarget.codePublic}
              &quot;
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="px-4 py-2 text-sm rounded bg-hover-l dark:bg-hover-d"
                disabled={deletingId === confirmTarget.id}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded text-white bg-delate hover:bg-delate/80 disabled:opacity-50"
                disabled={deletingId === confirmTarget.id}
              >
                {deletingId === confirmTarget.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
