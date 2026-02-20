'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Don't protect the login page
  if (isLoginPage) {
    return (
      <div className=" bg-main-l dark:bg-main-d flex items-center justify-center">{children}</div>
    );
  }

  // Protect all other admin pages
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-main-l dark:bg-main-d">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
