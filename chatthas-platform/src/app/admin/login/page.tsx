'use client';

import { useState } from 'react';
import { login } from './actions';
import { FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // If successful, the action will redirect, so we don't need to unset loading.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal font-body px-4">
      <div className="max-w-md w-full space-y-8 bg-dark-card p-8 md:p-10 rounded-lg shadow-card border border-dark-border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20 mb-4">
            <FaLock className="text-gold-500 text-xl" />
          </div>
          <h2 className="text-3xl font-display font-bold text-cream">Admin Login</h2>
          <p className="mt-2 text-sm text-cream/50">
            Sign in to manage Chattha's Restaurant Platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2.5 border border-dark-border bg-charcoal placeholder-cream/30 text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                placeholder="admin@chatthas.pk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2.5 border border-dark-border bg-charcoal placeholder-cream/30 text-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-ember-400 bg-ember-500/10 border border-ember-500/20 p-3 rounded-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-sm text-charcoal bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
