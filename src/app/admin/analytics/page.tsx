'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AnalyticsPage() {
  const { overview, topSearches, isLoading, error, fetchAll } = useAnalytics();
  const [selectedDays, setSelectedDays] = useState(7);

  useEffect(() => {
    fetchAll(selectedDays);
  }, [selectedDays, fetchAll]);

  const handleDaysChange = (days: number) => {
    setSelectedDays(days);
  };

  const getSuccessRate = () => {
    if (!overview || overview.totalSearches === 0) return 0;
    return Math.round((overview.successfulSearches / overview.totalSearches) * 100);
  };

  return (
    <>
      <AdminHeader
        title="Analytics Dashboard"
        description="Search statistics and insights"
        backLink={{ label: 'Back to Dashboard', href: '/admin' }}
        actions={
          <div className="flex gap-2">
            {[7, 30, 90].map(days => (
              <button
                key={days}
                onClick={() => handleDaysChange(days)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  selectedDays === days
                    ? 'bg-primary text-white hover:bg-primary/80'
                    : 'bg-hover-l dark:bg-hover-d hover:opacity-80'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        }
      />

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

      {/* Overview Cards */}
      {!isLoading && overview && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Searches */}
            <StatCard
              label="Total Searches"
              value={overview.totalSearches.toLocaleString()}
              valueClassName="text-primary"
            />
            <StatCard
              label="Successful Searches"
              value={overview.successfulSearches.toLocaleString()}
              valueClassName="text-green-600 dark:text-green-400"
            />
            <StatCard
              label="Failed Searches"
              value={overview.failedSearches.toLocaleString()}
              valueClassName="text-error-text-l dark:text-error-text-d"
            />
            <StatCard
              label="Success Rate"
              value={`${getSuccessRate()}%`}
              valueClassName="text-blue-600 dark:text-blue-400"
            />
          </div>

          {/* Search by Type */}
          <div className="bg-card-l dark:bg-card-d rounded border-border-l dark:border-border-d border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Searches by Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {overview.searchesByType.map(item => (
                <div key={item.type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                  <p className="text-sm mb-1 capitalize">{item.type}</p>
                  <p className="text-2xl font-bold ">{item.count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Top Searches Table */}
      {!isLoading && topSearches.length > 0 && (
        <div className="bg-card-l dark:bg-card-d rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Top Search Queries
            </h2>
          </div>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Query
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topSearches.map((search, index) => (
                <tr
                  key={index}
                  className="hover:bg-hover-l dark:hover:bg-hover-d transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {search.query}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {search.queryType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {search.resultFound ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        Found
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-error-l dark:bg-error-d text-error-text-l dark:text-error-text-d rounded">
                        Not Found
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {search.count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !overview && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No analytics data available for the selected period.
          </p>
        </div>
      )}
    </>
  );
}
