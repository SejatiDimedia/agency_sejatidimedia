'use client';

import React, { useState } from 'react';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { PortalHeader } from '@/components/portal/PortalHeader';
import { ActiveNavSection } from '@/types/portal';
import { 
  Button, 
  Badge, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardBody, 
  CardFooter, 
  Input, 
  SearchInput, 
  Avatar, 
  AvatarGroup, 
  SidebarItem, 
  Modal 
} from '@/components/ui';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Send, 
  Check, 
  FolderKanban, 
  UserCheck, 
  Settings, 
  ChevronRight, 
  LayoutDashboard,
  Eye
} from 'lucide-react';

export function DesignSystemShowcase() {
  const [activeSection, setActiveSection] = useState<ActiveNavSection>('dashboard-leads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Client'>('Admin');

  const [activeTab, setActiveTab] = useState<'all' | 'buttons' | 'badges' | 'cards' | 'inputs' | 'avatars' | 'modals'>('all');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const sampleAvatars = [
    { name: 'Sarah Connor', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80' },
    { name: 'Alex Mercer', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80' },
    { name: 'David Miller', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80' },
    { name: 'Elena Rostova' },
    { name: 'Marcus Vance' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 p-3 sm:p-5 flex gap-5 font-sans antialiased">
      {/* 1. Left Floating Sidebar */}
      <PortalSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        leadsCount={4}
        projectsCount={2}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openAddLeadModal={() => {}}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <PortalHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          openAddLeadModal={() => {}}
          openStyleGuideModal={() => {}}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
        />

        {/* Header Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SejatiDimedia Design System Showcase</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Galeri Komponen UI Reusable
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                Dokumentasi interaktif dan galeri visual komponen UI (*Light Mode SaaS Aesthetic*) untuk portal dan admin panel. Semua komponen telah dibungkus modular di <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">@/components/ui</code>.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Test Interaktif Modal</span>
                </button>

                <a
                  href="/admin/dashboard"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs flex items-center gap-2 border border-white/20 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Buka Admin Dashboard</span>
                </a>
              </div>
            </div>
          </div>

          {/* Filter Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2">
            {(['all', 'buttons', 'badges', 'cards', 'inputs', 'avatars', 'modals'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {tab === 'all' ? 'Semua Komponen' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {/* 1. BUTTONS SECTION */}
          {(activeTab === 'all' || activeTab === 'buttons') && (
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  1. Button Component (`Button.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Komponen tombol dengan 6 opsi varian (`primary`, `secondary`, `dark`, `ghost`, `outline`, `danger`) dan 3 ukuran.
                </p>
              </div>

              {/* Button Variants */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Button Variants</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                    Primary Button
                  </Button>
                  <Button variant="secondary" icon={<Settings className="w-4 h-4" />}>
                    Secondary Button
                  </Button>
                  <Button variant="dark" icon={<UserCheck className="w-4 h-4" />}>
                    Dark Button
                  </Button>
                  <Button variant="outline" icon={<Sparkles className="w-4 h-4 text-amber-500" />}>
                    Outline Button
                  </Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>
                    Danger Button
                  </Button>
                </div>
              </div>

              {/* Button Sizes & States */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Button Sizes (sm, md, lg)</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm" variant="primary">Small (sm)</Button>
                    <Button size="md" variant="primary">Medium (md)</Button>
                    <Button size="lg" variant="primary">Large (lg)</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading & Disabled States</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" isLoading>Loading State</Button>
                    <Button variant="outline" disabled>Disabled State</Button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. BADGES SECTION */}
          {(activeTab === 'all' || activeTab === 'badges') && (
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  2. Badge Component (`Badge.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Pill badge status untuk lead status, project milestone, dan tag custom.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status Badges (Standard)</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge status="New" showDot count={5} />
                    <Badge status="Reviewing" showDot count={12} />
                    <Badge status="Won" showDot />
                    <Badge status="Lost/Spam" showDot />
                    <Badge status="Active" showDot />
                    <Badge status="Completed" showDot />
                    <Badge status="Pending" showDot />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Custom Color Badges</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="custom" colorClass="bg-purple-50 text-purple-700 border-purple-200" label="Web Development" />
                    <Badge variant="custom" colorClass="bg-cyan-50 text-cyan-700 border-cyan-200" label="UI/UX Design" />
                    <Badge variant="custom" colorClass="bg-rose-50 text-rose-700 border-rose-200" label="High Priority" />
                    <Badge variant="custom" colorClass="bg-slate-900 text-white border-slate-900" label="Dark Tag" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 3. CARDS SECTION */}
          {(activeTab === 'all' || activeTab === 'cards') && (
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  3. Card Component (`Card.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Container card serbaguna dengan sub-komponen Header, Title, Body, dan Footer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Default Card */}
                <Card hoverEffect clickable>
                  <CardHeader>
                    <CardTitle>Interactive Default Card</CardTitle>
                    <Badge status="New" />
                  </CardHeader>
                  <CardBody>
                    <p className="text-xs text-slate-600">
                      Card varian default dengan latar belakang putih dan efek hover border biru.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="text-slate-400">Klik untuk interaksi</span>
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  </CardFooter>
                </Card>

                {/* Muted Card */}
                <Card variant="muted">
                  <CardHeader>
                    <CardTitle>Muted Surface Card</CardTitle>
                    <Badge status="Reviewing" />
                  </CardHeader>
                  <CardBody>
                    <p className="text-xs text-slate-600">
                      Card varian muted cocok untuk item sekunder atau latar belakang kontainer kanban.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="text-slate-400">Status: In Review</span>
                  </CardFooter>
                </Card>

                {/* Outlined Card */}
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Outlined Border Card</CardTitle>
                    <Badge status="Won" />
                  </CardHeader>
                  <CardBody>
                    <p className="text-xs text-slate-600">
                      Card varian outlined transparan untuk layout datar tanpa elevation.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <span className="text-slate-400">Status: Converted</span>
                  </CardFooter>
                </Card>
              </div>
            </section>
          )}

          {/* 4. INPUTS SECTION */}
          {(activeTab === 'all' || activeTab === 'inputs') && (
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  4. Input & Search Component (`Input.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Komponen formulir input dengan label, icon pendukung, dan pesan error validasi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Nama Klien / Perusahaan"
                    placeholder="Masukkan nama lengkap..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (e.target.value.length < 3) {
                        setInputError('Nama minimal 3 karakter');
                      } else {
                        setInputError('');
                      }
                    }}
                    error={inputError}
                    helperText="Ketik nama untuk menguji validasi error realtime"
                  />

                  <Input
                    label="Email Klien"
                    type="email"
                    placeholder="client@company.com"
                    icon={<Send className="w-4 h-4" />}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Re-usable Search Input (`SearchInput`)
                    </label>
                    <SearchInput
                      value={searchValue}
                      onSearchChange={setSearchValue}
                      placeholder="Search leads, email, or project name..."
                    />
                    {searchValue && (
                      <p className="text-xs text-blue-600 font-bold mt-1">
                        Query pencarian: "{searchValue}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 5. AVATARS SECTION */}
          {(activeTab === 'all' || activeTab === 'avatars') && (
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                  5. Avatar & AvatarGroup Component (`Avatar.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Komponen foto profil dengan foto URL atau fallback inisial nama otomatis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Single Avatars (xs, sm, md, lg)</h3>
                  <div className="flex items-end gap-4">
                    <div className="text-center space-y-1">
                      <Avatar size="xs" name="Takiya Baksh" />
                      <span className="text-[10px] text-slate-400 block">xs</span>
                    </div>
                    <div className="text-center space-y-1">
                      <Avatar size="sm" name="Sarah Connor" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80" />
                      <span className="text-[10px] text-slate-400 block">sm</span>
                    </div>
                    <div className="text-center space-y-1">
                      <Avatar size="md" name="Alex Mercer" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" />
                      <span className="text-[10px] text-slate-400 block">md</span>
                    </div>
                    <div className="text-center space-y-1">
                      <Avatar size="lg" name="Budi Santoso" />
                      <span className="text-[10px] text-slate-400 block">lg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avatar Grouping (`AvatarGroup`)</h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <AvatarGroup avatars={sampleAvatars} maxDisplay={3} size="sm" />
                      <span className="text-[10px] text-slate-400 block mt-1">maxDisplay = 3</span>
                    </div>

                    <div>
                      <AvatarGroup avatars={sampleAvatars} maxDisplay={4} size="md" />
                      <span className="text-[10px] text-slate-400 block mt-1">maxDisplay = 4</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. SIDEBAR ITEMS & MODAL PREVIEW SECTION */}
          {(activeTab === 'all' || activeTab === 'modals') && (
            <section className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  6. Navigation & Modal Components (`SidebarItem.tsx`, `Modal.tsx`)
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Elemen navigasi sidebar dan dialog modal interaktif.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sidebar Item States</h3>
                  <div className="space-y-2">
                    <SidebarItem
                      icon={<LayoutDashboard className="w-5 h-5" />}
                      label="Active Nav Item"
                      isActive={true}
                      onClick={() => {}}
                      count={14}
                    />
                    <SidebarItem
                      icon={<FolderKanban className="w-5 h-5" />}
                      label="Inactive Nav Item"
                      isActive={false}
                      onClick={() => {}}
                      count={3}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Modal Dialog Component</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Modal modern dengan backdrop blur, penutupan tombol ESC/X, dan header berukuran responsif.
                    </p>
                  </div>

                  <Button variant="primary" onClick={() => setIsDemoModalOpen(true)} icon={<Sparkles className="w-4 h-4" />}>
                    Buka Modal Demo Interaktif
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Demo Interactive Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Demo Modal Reusable Component"
        subtitle="Ini adalah contoh penggunaan komponen Modal.tsx secara live."
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            Modal ini dibangun menggunakan komponen <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600">Modal.tsx</code> yang mendukung opsi `maxWidth` (`sm`, `md`, `lg`, `xl`, `2xl`), backdrop blur, dan animasi smooth.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <Input label="Sample Modal Field" placeholder="Ketik sesuatu di modal..." />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsDemoModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsDemoModalOpen(false)} icon={<Check className="w-3.5 h-3.5" />}>
              Simpan & Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
