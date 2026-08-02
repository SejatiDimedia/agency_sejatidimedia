'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';

function MagicLinkActivator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
          setSuccessMsg('Verifikasi token berhasil! Mengalihkan ke portal Anda...');
          setTimeout(() => {
            router.push(data.redirectUrl || '/portal');
          }, 1200);
        }
      } catch {
        setErrorMsg('Terjadi kesalahan koneksi saat memverifikasi token.');
      } finally {
        setLoading(false);
      }
    };

    processActivation();
  }, [token, router]);

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl border border-slate-200/80 p-6 sm:p-8 text-center space-y-6">
      <div className="inline-flex items-center justify-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img src="/logo.svg" alt="SejatiDimedia Logo" className="w-full h-full object-contain" />
        </div>
        <span className="font-extrabold text-slate-900 text-xl tracking-tight">SejatiDimedia</span>
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
            <h2 className="text-lg font-black text-slate-900">Login Berhasil!</h2>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              {successMsg}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => router.push('/portal')}
            className="w-full justify-center"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Buka Client Portal Sekarang
          </Button>
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
