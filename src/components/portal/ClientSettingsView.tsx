'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Toast } from '@/components/ui';
import { KeyRound, Lock, ShieldCheck, User, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface ClientSettingsViewProps {
  userName?: string;
  userEmail?: string;
}

export const ClientSettingsView: React.FC<ClientSettingsViewProps> = ({
  userName = 'Client User',
  userEmail = 'client@company.com',
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!password || password.length < 8) {
      setErrorMsg('Password minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          message: 'Password akun Anda berhasil disimpan! Sekarang Anda bisa login menggunakan Email & Password ini.',
          type: 'success',
        });
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(data.error || 'Gagal menyimpan password');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <Toast
          isOpen={!!toast}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun & Keamanan
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola profil akun dan stel password login konvensional Anda di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Account Profile Info */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Profil Akun Klien</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Nama Lengkap
              </label>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 font-bold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>{userName}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Alamat Email Login
              </label>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 font-bold text-slate-800 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{userEmail}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                Akses Terverifikasi Client Portal
              </span>
            </div>
          </div>
        </Card>

        {/* Card 2: Set / Update Password Form */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <KeyRound className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Set / Ubah Password Akun</h3>
              <p className="text-[10px] text-slate-500">
                Buat password untuk login tanpa bantuan Magic Link email.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <Input
              label="Password Baru"
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Konfirmasi Password Baru"
              type="password"
              placeholder="Ketik ulang password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full justify-center"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Simpan Password Akun
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
