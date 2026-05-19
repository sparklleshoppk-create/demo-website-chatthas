'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUser, FaGoogle } from 'react-icons/fa';
import Link from 'next/link';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (signUpError) throw signUpError;
        setError("Account created! Please check your email for verification.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-500 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-4xl font-bold gold-text">Chattha's</Link>
          <p className="text-cream/50 text-sm mt-2 uppercase tracking-widest font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </p>
        </div>

        <div className="liquid-glass p-8 md:p-10 rounded-sm">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className={`p-4 text-xs font-bold rounded-sm border ${error.includes('created') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-ember/10 border-ember text-ember'}`}>
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={14} />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Waqar Chattha" 
                    className="admin-input pl-11" 
                    required 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={14} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="admin-input pl-11" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-cream/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20" size={14} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="admin-input pl-11" 
                  required 
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="btn-gold w-full py-4 font-black tracking-widest mt-4 uppercase flex justify-center items-center gap-3"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Join Now'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-dark-border text-center">
            <p className="text-cream/40 text-xs">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-gold-500 font-bold hover:text-gold-300 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
