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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal font-body px-4">
      <div className="max-w-md w-full space-y-8 bg-dark-card p-8 md:p-10 rounded-sm shadow-card border border-dark-border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20 mb-4">
            <FaLock className="text-gold-500 text-xl" />
          </div>
          <h2 className="text-3xl font-display font-light italic gold-text">Admin Login</h2>
          <p className="mt-2 text-xs tracking-widest uppercase text-cream/40">
            Sign in to manage Chattha's Platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest block mb-1" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="admin-input bg-primary-black"
                placeholder="admin@chatthas.pk"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest block mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="admin-input bg-primary-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-ember-500 bg-ember-500/10 border border-ember-500/20 p-3 rounded-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full justify-center"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
