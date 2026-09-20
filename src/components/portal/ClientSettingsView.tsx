import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, Button, Input, Toast } from '@/components/ui';
import {
  KeyRound, Lock, ShieldCheck, User, Mail, CheckCircle2, AlertCircle,
  ExternalLink, Briefcase, BookOpen, UploadCloud, Link2, Loader2, Camera, RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ClientSettingsViewProps {
  userName?: string;
  userEmail?: string;
  userRole?: 'ADMIN' | 'CLIENT';
}

export const ClientSettingsView: React.FC<ClientSettingsViewProps> = ({
  userName = 'Client User',
  userEmail = 'client@company.com',
  userRole = 'CLIENT',
}) => {
  const { language, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Author Profile States (ADMIN ONLY)
  const [authorName, setAuthorName] = useState('Timur Dian Radha Sejati');
  const [authorRoleText, setAuthorRoleText] = useState('Lead Software Engineer · SejatiDimedia');
  const [authorAvatar, setAuthorAvatar] = useState('/images/author_timur_dian.jpg');
  const [authorBioId, setAuthorBioId] = useState('');
  const [authorBioEn, setAuthorBioEn] = useState('');
  const [authorAvatarType, setAuthorAvatarType] = useState<'upload' | 'url'>('upload');
  const [isUploadingAuthorAvatar, setIsUploadingAuthorAvatar] = useState(false);
  const [isSavingAuthor, setIsSavingAuthor] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

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

  // 2. Load Author Profile (ADMIN ONLY)
  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetch('/api/admin/author-profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.profile) {
            setAuthorName(data.profile.name || 'Timur Dian Radha Sejati');
            setAuthorRoleText(data.profile.role || 'Lead Software Engineer · SejatiDimedia');
            setAuthorAvatar(data.profile.avatar || '/images/author_timur_dian.jpg');
            setAuthorBioId(data.profile.bioId || '');
            setAuthorBioEn(data.profile.bioEn || '');
          }
        })
        .catch((err) => console.error('Failed to load author profile:', err));
    }
  }, [userRole]);

  // 3. Handle Avatar File Upload
  const handleAvatarUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: 'Ukuran foto maksimal 10MB', type: 'error' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Harap pilih file gambar (JPG, PNG, WEBP)', type: 'error' });
      return;
    }

    setIsUploadingAuthorAvatar(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/admin/insights/upload', {
        method: 'POST',
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setAuthorAvatar(data.url);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sejati-profile-updated', {
              detail: {
                avatar: data.url,
                name: authorName,
                role: authorRoleText,
              },
            })
          );
        }
        setToast({ message: 'Foto berhasil diunggah! Klik "Simpan & Terapkan" untuk menyimpan permanen.', type: 'success' });
      } else {
        setToast({ message: data.error || 'Gagal mengunggah foto profil', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan saat mengunggah foto profil', type: 'error' });
    } finally {
      setIsUploadingAuthorAvatar(false);
    }
  };

  // 4. Handle Save Author Profile
  const handleSaveAuthorProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorAvatar) {
      setToast({ message: 'Foto profil penulis wajib diisi atau diunggah.', type: 'error' });
      return;
    }

    setIsSavingAuthor(true);
    try {
      const res = await fetch('/api/admin/author-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authorName,
          role: authorRoleText,
          avatar: authorAvatar,
          bioId: authorBioId,
          bioEn: authorBioEn,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('sejati-profile-updated', {
              detail: {
                avatar: authorAvatar,
                name: authorName,
                role: authorRoleText,
              },
            })
          );
        }
        setToast({
          message: 'Foto profil & bio berhasil disimpan dan diterapkan ke Portal & seluruh artikel Insights!',
          type: 'success',
        });
      } else {
        setToast({ message: data.error || 'Gagal menyimpan profil penulis', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan jaringan saat menyimpan profil', type: 'error' });
    } finally {
      setIsSavingAuthor(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <Toast
        isOpen={!!toast}
        message={toast?.message || ''}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun & Keamanan
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola profil akun, ganti password login, dan konfigurasi keamanan portal.
        </p>
      </div>

      {/* Section 2: Portfolio Showcase & NDA Shortcut (ADMIN ONLY) */}
      {userRole === 'ADMIN' && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/80 border border-blue-200/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Manajemen Portofolio & Proteksi NDA
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pengaturan proyek NDA dan visibilitas galeri portofolio kini dapat dikelola mandiri di menu Portfolio Showcase.
              </p>
            </div>
          </div>
          <a
            href="/portal/portfolio"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
          >
            <span>Buka Menu Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Section 3: Author Profile & Photo Settings (ADMIN ONLY) */}
      {userRole === 'ADMIN' && (
        <Card className="p-6 sm:p-7 space-y-6 border border-slate-200/90 shadow-sm rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2C5098] text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Profil Penulis & Foto Founder (Portal & Insights)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Foto dan profil ini ditampilkan di Portal Header serta kartu profil penulis di setiap halaman membaca Insights publik.
                </p>
              </div>
            </div>
            <a
              href="/insights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0"
            >
              <span>Lihat Halaman Insights</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <form onSubmit={handleSaveAuthorProfile} className="space-y-6">
            {/* Avatar Photo Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
              {/* Photo Preview */}
              <div className="relative group shrink-0">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md ring-2 ring-blue-100/80 bg-slate-200">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  {isUploadingAuthorAvatar && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer"
                  title="Ganti Foto Profil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Upload Controls & URL */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Foto Profil Penulis</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                    Live di Portal & Insights
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthorAvatarType('upload')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authorAvatarType === 'upload'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Unggah File Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthorAvatarType('url')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      authorAvatarType === 'url'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Gunakan URL Gambar
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={avatarFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                  className="hidden"
                />

                {authorAvatarType === 'upload' ? (
                  <div
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-colors bg-white hover:bg-blue-50/30 flex items-center justify-center gap-3"
                  >
                    <UploadCloud className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="text-left">
                      <span className="text-xs font-bold text-slate-700 block">
                        {isUploadingAuthorAvatar ? 'Sedang mengunggah foto ke Cloud Storage...' : 'Klik untuk pilih foto profil baru dari laptop / HP'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">JPG, PNG, WEBP (Maksimal 10MB)</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={authorAvatar}
                      onChange={(e) => setAuthorAvatar(e.target.value)}
                      placeholder="https://... URL gambar avatar"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-mono bg-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Author Name & Role Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                  Nama Lengkap Penulis *
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Timur Dian Radha Sejati"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-500 mb-1.5">
                  Jabatan / Peran Penulis *
                </label>
                <input
                  type="text"
                  value={authorRoleText}
                  onChange={(e) => setAuthorRoleText(e.target.value)}
                  placeholder="Contoh: Lead Software Engineer · SejatiDimedia"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-bold bg-white"
                />
              </div>
            </div>

            {/* Author Bio ID & EN Bilingual Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                    ID
                  </span>
                  <label className="text-xs font-mono font-bold uppercase text-slate-500">
                    Bio Singkat Penulis (Bahasa Indonesia)
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={authorBioId}
                  onChange={(e) => setAuthorBioId(e.target.value)}
                  placeholder="Software engineer dan konsultan sistem di SejatiDimedia. Berfokus pada perancangan arsitektur berkinerja tinggi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-sans bg-white leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-700">
                    EN
                  </span>
                  <label className="text-xs font-mono font-bold uppercase text-slate-500">
                    Author Short Bio (English)
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={authorBioEn}
                  onChange={(e) => setAuthorBioEn(e.target.value)}
                  placeholder="Software engineer and systems consultant at SejatiDimedia. Specializing in high-performance architecture design..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-sans bg-white leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
              <p className="text-[11px] text-slate-400 font-medium">
                Perubahan foto dan profil ini akan otomatis diterapkan ke seluruh artikel Insights dan kartu biografi pembaca.
              </p>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSavingAuthor}
                icon={<CheckCircle2 className="w-4 h-4" />}
                className="px-6 py-2.5 text-xs font-bold shadow-md hover:shadow-lg"
              >
                Simpan & Terapkan Foto Penulis
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Account Profile Info */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              {userRole === 'ADMIN' ? 'Profil Akun Administrator' : 'Profil Akun Klien'}
            </h3>
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

