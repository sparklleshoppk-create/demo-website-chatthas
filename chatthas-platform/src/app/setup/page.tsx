'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SetupAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // 1. Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage({ text: error.message, type: 'error' });
      setIsLoading(false);
      return;
    }

    if (data.user) {
      setUserId(data.user.id);
      setMessage({ 
        text: 'User created successfully! Please see step 2 below to grant Admin privileges.', 
        type: 'success' 
      });
    } else {
      setMessage({ text: 'Check your email to verify your account.', type: 'info' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal text-cream font-body py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-dark-card p-8 rounded-lg border border-dark-border shadow-card">
        <div>
          <h2 className="text-center text-3xl font-display font-bold text-gold-500">
            Super Admin Setup
          </h2>
          <p className="mt-2 text-center text-sm text-cream/70">
            Step 1: Create your secure authentication account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSetup}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-dark-border bg-charcoal placeholder-cream/30 text-cream rounded-md focus:outline-none focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm"
                placeholder="admin@chatthas.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/80 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-dark-border bg-charcoal placeholder-cream/30 text-cream rounded-md focus:outline-none focus:ring-gold-500 focus:border-gold-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md text-sm ${
              message.type === 'error' ? 'bg-ember-500/10 text-ember-400 border border-ember-500/20' : 
              message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
              'bg-gold-500/10 text-gold-400 border border-gold-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !!userId}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-charcoal bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>

        {userId && (
          <div className="mt-8 p-6 bg-charcoal border border-gold-500/30 rounded-lg">
            <h3 className="text-lg font-bold text-gold-500 mb-2">Step 2: Grant Privileges</h3>
            <p className="text-sm text-cream/70 mb-4">
              Your account is created, but it does not have admin permissions yet. 
              Copy the SQL query below and run it in your Supabase SQL Editor to link this account to the <code className="text-gold-400">admins</code> table:
            </p>
            <div className="relative group">
              <pre className="bg-[#111] p-4 rounded text-xs text-green-400 overflow-x-auto border border-dark-border">
                INSERT INTO public.admins (user_id, role) <br/>
                VALUES ('{userId}', 'super_admin');
              </pre>
            </div>
            <p className="text-xs text-ember-400 mt-4 italic">
              Note: Depending on your Supabase settings, you may also need to check your email to verify the address before logging in. You can disable "Confirm Email" in Supabase Auth -&gt; Providers -&gt; Email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
