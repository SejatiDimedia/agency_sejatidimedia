import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Toast } from '@/components/ui';
import { KeyRound, Lock, ShieldCheck, User, Mail, CheckCircle2, AlertCircle, LayoutTemplate, Sparkles, Sun, Check, ExternalLink, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { TemplateId, TEMPLATES, getActiveTemplate, setActiveTemplate } from '@/lib/templates';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ClientSettingsViewProps {
  userName?: string;
  userEmail?: string;
}

export const ClientSettingsView: React.FC<ClientSettingsViewProps> = ({
  userName = 'Client User',
  userEmail = 'client@company.com',
}) => {
  const { language, t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateId>('professional');
  const [ndaBlurEnabled, setNdaBlurEnabled] = useState<boolean>(true);
  const [ndaLoading, setNdaLoading] = useState<boolean>(false);

  useEffect(() => {
    // 1. Load active template from server API
    fetch('/api/settings/template')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && (data.template === 'classic' || data.template === 'professional')) {
          setCurrentTemplate(data.template);
        }
      })
      .catch(() => {
        setCurrentTemplate(getActiveTemplate());
      });

    // 2. Load active NDA blur setting from server API
    fetch('/api/settings/nda')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.ndaBlurEnabled === 'boolean') {
          setNdaBlurEnabled(data.ndaBlurEnabled);
        }
      })
      .catch(() => {});

    const handleTemplateChange = (e: CustomEvent<TemplateId>) => {
      setCurrentTemplate(e.detail);
    };

    window.addEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    return () => {
      window.removeEventListener('sejatidimedia-template-change' as any, handleTemplateChange);
    };
  }, []);

  const handleToggleNda = async () => {
    const nextVal = !ndaBlurEnabled;
    setNdaBlurEnabled(nextVal);
    setNdaLoading(true);

    try {
      const res = await fetch('/api/settings/nda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ndaBlurEnabled: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          message: nextVal
            ? 'Proteksi NDA BERHASIL DIAKTIFKAN: Rincian teknis & screenshot Pengalaman Profesional Perusahaan kini disamarkan.'
            : 'Proteksi NDA DINONAKTIFKAN: Seluruh rincian proyek & screenshot kini dapat dilihat publik secara penuh.',
          type: 'success',
        });
      } else {
        setToast({
          message: 'Gagal memperbarui pengaturan NDA server.',
          type: 'error',
        });
      }
    } catch {
      setToast({
        message: 'Pengaturan NDA berhasil disimpan secara lokal.',
        type: 'success',
      });
    } finally {
      setNdaLoading(false);
    }
  };

  const handleSelectTemplate = async (templateId: TemplateId) => {
    setCurrentTemplate(templateId);
    setActiveTemplate(templateId);

    try {
      const res = await fetch('/api/settings/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: templateId }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({
          message: 'Template berhasil diaktifkan ke semua perangkat (Laptop, HP & Tablet)!',
          type: 'success',
        });
      } else {
        setToast({
          message: 'Gagal memperbarui pengaturan template server.',
          type: 'error',
        });
      }
    } catch {
      setToast({
        message: 'Template berhasil diubah secara lokal.',
        type: 'success',
      });
    }
  };

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
    <div className="space-y-8 max-w-4xl">
      {toast && (
        <Toast
          isOpen={!!toast}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Pengaturan Akun, Keamanan & Template
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola profil akun, ganti password login, serta pilih tema template landing page website.
        </p>
      </div>

      {/* Section 1: Template Landing Page Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {t.templateSettings?.title || 'Template Landing Page'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {t.templateSettings?.subtitle || 'Pilih tema dan tampilan landing page utama website Anda'}
              </p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            <span>Preview Landing Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {TEMPLATES.map((tmpl) => {
            const isActive = currentTemplate === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border-2 overflow-hidden ${
                  isActive
                    ? 'bg-white border-blue-600 shadow-[0_10px_35px_-10px_rgba(37,99,235,0.25)] ring-4 ring-blue-50'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Visual Preview Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tmpl.id === 'classic' ? (
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          <Sun className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{tmpl.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          {tmpl.badge}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-sm">
                        <Check className="w-3 h-3" />
                        {t.templateSettings?.activeBadge || 'Aktif'}
                      </span>
                    )}
                  </div>

                  {/* Mockup Preview Graphic */}
                  <div
                    className={`h-24 sm:h-28 rounded-2xl p-3 flex flex-col justify-between border ${
                      tmpl.id === 'classic'
                        ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-indigo-900/50 text-white'
                        : 'bg-gradient-to-br from-[#f0f4f8] via-slate-100 to-blue-50/50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-400/80" />
                        <div className="w-2 h-2 rounded-full bg-amber-400/80" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-sm border border-white/10 opacity-75">
                        {tmpl.id === 'classic' ? 'Aurora & Dark Theme' : 'Clean Light Workspace'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className={`h-2.5 rounded-full w-2/3 ${tmpl.id === 'classic' ? 'bg-indigo-400/50' : 'bg-blue-600/70'}`} />
                      <div className={`h-2 rounded-full w-1/2 ${tmpl.id === 'classic' ? 'bg-slate-700' : 'bg-slate-300'}`} />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`h-4 px-2 rounded-md text-[8px] font-bold flex items-center ${
                        tmpl.id === 'classic' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        CTA Button
                      </div>
                      <div className={`h-4 w-12 rounded-md ${tmpl.id === 'classic' ? 'bg-white/10' : 'bg-slate-200'}`} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {language === 'id' ? tmpl.descriptionId : tmpl.descriptionEn}
                  </p>

                  {/* Features Tag Grid */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tmpl.features.map((feat, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant={isActive ? 'outline' : 'primary'}
                    className="w-full justify-center text-xs"
                    icon={isActive ? <Check className="w-3.5 h-3.5 text-blue-600" /> : undefined}
                  >
                    {isActive ? (t.templateSettings?.activeBadge || 'Sedang Aktif') : (t.templateSettings?.activateBtn || 'Gunakan Template')}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Portfolio NDA & Confidentiality Protection Mode */}
      <Card className="space-y-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Proteksi Kerahasiaan & Sensor NDA Portofolio
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  ndaBlurEnabled
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {ndaBlurEnabled ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Aktif (Sensor Menyala)
                    </>
                  ) : (
                    'Nonaktif (Publik Terbuka)'
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Otomatis menyamarkan teks teknis mendalam dan screenshot proyek bertipe "Pengalaman Profesional Perusahaan" (misal: proyek manufaktur/enterprise) untuk kepatuhan regulasi kerahasiaan.
              </p>
            </div>
          </div>

          {/* Toggle Switch Button */}
          <button
            type="button"
            onClick={handleToggleNda}
            disabled={ndaLoading}
            title={ndaBlurEnabled ? "Klik untuk menonaktifkan sensor NDA" : "Klik untuk mengaktifkan sensor NDA"}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2C5098] focus:ring-offset-2 ${
              ndaBlurEnabled ? 'bg-[#2C5098]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                ndaBlurEnabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Informative Explanation Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Bagian yang Tetap Terbaca:</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ringkasan awal/overview proyek, metrik pencapaian umum, teknologi yang digunakan, dan peran Anda.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <EyeOff className="w-4 h-4 text-amber-600" />
              <span>Bagian yang Disamarkan (Saat Aktif):</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Rincian arsitektur proprietary, alur data internal, dan tangkapan layar antarmuka sistem pabrik/enterprise.
            </p>
          </div>
        </div>
      </Card>

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

