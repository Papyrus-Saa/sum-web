'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // ProtectedRoute will automatically redirect to /admin/login
  };

  return (
    <>
      <AdminHeader
        title="Admin Dashboard"
        description={`Welcome, ${user?.email}`}
        actions={
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 cursor-pointer rounded"
          >
            Logout
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mappings Card */}
        <div className="bg-card-l dark:bg-card-d p-6 rounded shadow-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-2">Tire Mappings</h2>
          <p className="text-sm mb-4">Create, update, and delete tire code mappings</p>
          <Link
            href="/admin/mappings"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors duration-200 inline-block text-center"
          >
            Manage Mappings
          </Link>
        </div>

        {/* CSV Import Card */}
        <div className="bg-card-l dark:bg-card-d p-6 rounded shadow-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-2">CSV Import</h2>
          <p className="text-sm mb-4">Bulk import tire codes from CSV files</p>
          <Link
            href="/admin/import"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors duration-200 inline-block text-center"
          >
            Import CSV
          </Link>
        </div>

        {/* Analytics Card */}
        <div className="bg-card-l dark:bg-card-d p-6 rounded shadow-lg border border-border-l dark:border-border-d">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-sm mb-4">View search statistics and top queries</p>
          <Link
            href="/admin/analytics"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors duration-200 inline-block text-center"
          >
            View Analytics
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-card-l dark:bg-card-d p-6 rounded shadow-lg border border-border-l dark:border-border-d">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/mappings/new"
            className="px-4 py-3 text-sm font-medium bg-hover-l dark:bg-hover-d rounded hover:opacity-80 transition-opacity duration-200 text-center"
          >
            + Create Mapping
          </Link>
          <Link
            href="/admin/import"
            className="px-4 py-3 text-sm font-medium bg-hover-l dark:bg-hover-d rounded hover:opacity-80 transition-opacity duration-200 text-center"
          >
            ⬆ Upload CSV
          </Link>
          <Link
            href="/"
            className="px-4 py-3 text-sm font-medium bg-hover-l dark:bg-hover-d rounded hover:opacity-80 transition-opacity duration-200 text-center"
          >
            🔍 Go to Search
          </Link>
        </div>
      </div>
    </>
  );
}
