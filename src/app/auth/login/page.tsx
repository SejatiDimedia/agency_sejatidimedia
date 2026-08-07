'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'password' | 'magic-link'>('password');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activationUrlDemo, setActivationUrlDemo] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || 'Login gagal');
      } else {
        setSuccessMsg('Login berhasil! Mengalihkan ke portal...');
        setTimeout(() => {
          router.push(data.redirectUrl || '/portal');
        }, 1000);
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setActivationUrlDemo(null);

    if (!email) {
      setErrorMsg('Email wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!data.success) {
        setErrorMsg(data.error || 'Gagal mengirim magic link');
      } else {
        setSuccessMsg(data.message || 'Link login berhasil dikirim ke email!');
        if (data.activationUrl) {
          setActivationUrlDemo(data.activationUrl);
        }
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden space-y-6">
        {/* Top Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="SejatiDimedia Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl tracking-tight uppercase font-sora" style={{ fontFamily: "'Sora', sans-serif" }}>
              <span style={{ color: '#2E54A2' }}>Sejati</span> <span style={{ color: '#23385B' }}>Dimedia</span>
            </span>
          </div>

          {/* <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Client Portal Login
          </h1> */}
        </div>

        {/* Dual Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-bold mt-10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all text-center cursor-pointer ${activeTab === 'password'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('magic-link');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all text-center cursor-pointer ${activeTab === 'magic-link'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            Magic Link Email
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>{successMsg}</p>
              {activationUrlDemo && (
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Demo Quick Activation Link:</span>
                  <a
                    href={activationUrlDemo}
                    className="text-blue-600 font-bold underline break-all block hover:text-blue-800"
                  >
                    {activationUrlDemo}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: Password Login */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <Input
              label="Alamat Email"
              type="email"
              placeholder="klien@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full justify-center py-3"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Masuk ke Portal
            </Button>
            <p className="text-xs text-slate-500 font-medium text-center">
              Masuk ke portal klien SejatiDimedia untuk melihat status project & deliverables.
            </p>
          </form>
        )}

        {/* TAB 2: Magic Link Request */}
        {activeTab === 'magic-link' && (
          <form onSubmit={handleMagicLinkRequest} className="space-y-4">
            <Input
              label="Alamat Email Klien"
              type="email"
              placeholder="klien@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              helperText="Link aktivasi/login instant akan dikirimkan ke email ini (berlaku 48 jam)."
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full justify-center py-3"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Kirim Magic Link Login
            </Button>
          </form>
        )}

        {/* Security Footer Note */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          <span>Hybrid Auth System (SHA-256 + HTTP-Only Cookie)</span>
        </div>
      </div>
    </div>
  );
}
