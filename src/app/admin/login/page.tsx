'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Input } from '@/components/input/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-md mx-auto">
        {/* Logo/Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Sum Tirecode</h1>
          <p className="mt-2">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-card-l dark:bg-card-d p-8 rounded">
          <h2 className="text-2xl font-semibold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="admin@example.com"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-error-l dark:bg-error-d border border-error-border-l dark:border-error-border-d rounded-lg">
                <p className="text-error-text-l dark:text-error-text-d text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white px-6 py-3 text-base font-medium  bg-primary hover:bg-primary/70 rounded disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-sm">Authorized access only</p>
      </div>
    </div>
  );
}
