'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import { useImportJob } from '@/hooks/useImportJob';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function ImportPage() {
  const { jobId, status, isUploading, error, uploadCsv, resetJob } = useImportJob();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await uploadCsv(selectedFile);
    if (!success) {
      alert('Failed to upload CSV. Please try again.');
    }
  };

  const handleReset = () => {
    resetJob();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = () => {
    if (!status) return 'text-gray-600';
    switch (status.state) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'processing':
        return 'text-blue-600 dark:text-blue-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'failed':
        return 'text-error-text-l dark:text-error-text-d';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressPercentage = () => {
    if (!status?.progress || status.progress.total === 0) return 0;
    return Math.round((status.progress.current / status.progress.total) * 100);
  };

  return (
    <>
      <AdminHeader
        title="CSV Import"
        description="Bulk import tire code mappings from CSV file"
        backLink={{ label: 'Back to Dashboard', href: '/admin' }}
      />

      {/* Instructions */}
      <div className="bg-primary/30 dark:bg-blue-900/20 border border-primary/30 dark:border-primary/50 rounded p-4 mb-6">
        <h3 className="text-sm font-semibold text-secondary mb-2">CSV Format Requirements</h3>
        <ul className="text-sm space-y-1">
          <li>
            • Column headers:{' '}
            <code className="bg-primary/20 dark:bg-primary/50 px-1 rounded">size</code> (required),{' '}
            <code className="bg-primary/20 dark:bg-primary/50 px-1 rounded">loadIndex</code>{' '}
            (optional),{' '}
            <code className="bg-primary/20 dark:bg-primary/50 px-1 rounded">speedIndex</code>{' '}
            (optional)
          </li>
          <li>• Size format: 205/55R16 (width/aspect-ratio + construction + rim-diameter)</li>
          <li>• Example: size,loadIndex,speedIndex</li>
          <li>• Example row: 205/55R16,91,V</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded">
          <p className="text-sm text-error-text-l dark:text-error-text-d">{error}</p>
        </div>
      )}

      {/* Upload Section */}
      {!jobId && (
        <div className="bg-card-l dark:bg-card-d rounded shadow-lg border border-primary/30 dark:border-primary/50 p-6">
          <h2 className="text-lg font-semibold text-secondary mb-4">Upload CSV File</h2>

          {/* File Input */}
          <div className="mb-4">
            <label
              className={`flex items-center justify-between gap-4 rounded border border-border-l dark:border-border-d bg-main-l dark:bg-main-d px-4 py-3 text-sm ${
                isUploading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-hover-l dark:hover:bg-hover-d'
              }`}
            >
              <span className="flex items-center gap-2 ">
                <Upload className="h-4 w-4 text-primary" />
                {selectedFile ? selectedFile.name : 'Choose CSV file'}
              </span>
              <span className="text-xs ">.csv only</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="sr-only"
              />
            </label>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="mb-4 p-3  rounded">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Selected file:</span> {selectedFile.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload and Process'}
          </button>
        </div>
      )}

      {/* Progress Section */}
      {jobId && status && (
        <div className="bg-card-l dark:bg-card-d rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Import Progress
          </h2>

          {/* Job Status */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className={`text-sm font-semibold uppercase ${getStatusColor()}`}>
                {status.state}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {status.progress?.current || 0} of {status.progress?.total || 0} records processed (
              {getProgressPercentage()}%)
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {status.result?.processed || 0}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">Successful</p>
            </div>
            <div className="p-3 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded-lg">
              <p className="text-2xl font-bold text-error-text-l dark:text-error-text-d">
                {status.result?.errors?.length || 0}
              </p>
              <p className="text-sm text-error-text-l dark:text-error-text-d">Errors</p>
            </div>
          </div>

          {/* Error Details */}
          {status.result?.errors && status.result.errors.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Errors ({status.result.errors.length})
              </h3>
              <div className="max-h-48 overflow-y-auto bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded-lg p-3">
                <ul className="space-y-1 text-sm text-error-text-l dark:text-error-text-d">
                  {status.result.errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {status.state === 'completed' || status.state === 'failed' ? (
              <>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200"
                >
                  Import Another File
                </button>
                <Link
                  href="/admin/mappings"
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-hover-l dark:bg-hover-d hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  View Mappings
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Processing...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
