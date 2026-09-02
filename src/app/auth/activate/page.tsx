'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, RefreshCw, Lock, KeyRound } from 'lucide-react';

function MagicLinkActivator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Set Password Form States
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErrorMsg('Token magic link tidak ditemukan di URL.');
      return;
    }

    const processActivation = async () => {
      try {
        const res = await fetch('/api/auth/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!data.success) {
          setErrorMsg(data.error || 'Aktivasi token gagal');
        } else {
          setSuccessMsg('Verifikasi token berhasil! Akun Anda kini aktif.');
          setShowPasswordForm(true);
        }
      } catch {
        setErrorMsg('Terjadi kesalahan koneksi saat memverifikasi token.');
      } finally {
        setLoading(false);
      }
    };

    processActivation();
  }, [token]);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      alert('Password minimal 8 karakter');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setPasswordSaved(true);
        setTimeout(() => {
          router.push('/portal');
        }, 1200);
      } else {
        alert(data.error || 'Gagal menyimpan password');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 p-6 sm:p-8 text-center space-y-6">
      <div
        className="inline-flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => router.push('/')}
        title="Kembali ke Beranda"
      >
        <img
          src="/SejatiDimedia_Logo.svg"
          alt="SejatiDimedia Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {loading && (
        <div className="space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-spin">
            <Loader2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">Memverifikasi Link Login...</h2>
          <p className="text-xs text-slate-500 font-medium">
            Mohon tunggu sebentar, sistem sedang mengkonfirmasi token aktivasi Anda.
          </p>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="space-y-5 py-2">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Aktivasi Gagal</h2>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              {errorMsg}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={() => router.push('/auth/login')}
              className="w-full justify-center"
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Minta Link Login Baru
            </Button>
          </div>
        </div>
      )}

      {!loading && successMsg && (
        <div className="space-y-5 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Aktivasi Berhasil!</h2>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              {successMsg}
            </p>
          </div>

          {/* Form Buat Password Permanen (Opsional) */}
          {showPasswordForm && !passwordSaved && (
            <form onSubmit={handleSavePassword} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Buat Password Akun (Opsional)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Buat password agar Anda bisa login langsung menggunakan Email & Password tanpa bergantung pada Magic Link email.
              </p>
              
              <Input
                type="password"
                placeholder="Minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={savingPassword}
                  className="flex-1 justify-center"
                >
                  Simpan Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/portal')}
                  className="text-slate-500"
                >
                  Lewati
                </Button>
              </div>
            </form>
          )}

          {passwordSaved && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password berhasil disimpan! Mengalihkan ke portal...</span>
            </div>
          )}

          {!passwordSaved && (
            <Button
              variant="primary"
              onClick={() => router.push('/portal')}
              className="w-full justify-center mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Langsung Buka Client Portal
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActivatePage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 font-sans antialiased">
      <Suspense fallback={
        <div className="bg-white rounded-[2.5rem] p-8 text-center shadow-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold mt-2">Loading activation...</p>
        </div>
      }>
        <MagicLinkActivator />
      </Suspense>
    </div>
  );
}
