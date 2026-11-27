'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Button,
  Input,
  SearchInput,
  Modal,
  ConfirmModal,
  Checkbox,
  Toast,
} from '@/components/ui';
import {
  Globe,
  Plus,
  ExternalLink,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

export interface StaticWebItem {
  id: string;
  name: string;
  category: string;
  liveUrl: string;
  thumbnailUrl?: string | null;
  thumbnailKey?: string | null;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const PRESET_CATEGORIES = [
  'Company Profile',
  'Landing Page',
  'E-Catalog',
  'Portfolio',
  'Event & Campaign',
];

export const StaticWebManagementView: React.FC = () => {
  const [items, setItems] = useState<StaticWebItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Create / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StaticWebItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Landing Page');
  const [formLiveUrl, setFormLiveUrl] = useState('');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formOrder, setFormOrder] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal state
  const [deleteTarget, setDeleteTarget] = useState<StaticWebItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Per-row action state
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/static-web');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.items)) {
        setItems(data.items);
      } else if (!res.ok) {
        setToast({ message: data.error || 'Gagal memuat data Web & Landing Page.', type: 'error' });
      }
    } catch (err) {
      console.error('Failed to load static web items:', err);
      setToast({ message: 'Gagal memuat data Web & Landing Page.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    return ['ALL', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.liveUrl.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [items, selectedCategory, searchQuery]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Landing Page');
    setFormLiveUrl('');
    setFormIsPublished(true);
    setFormOrder(items.length);
    setIsModalOpen(true);
  };

  const openEditModal = (item: StaticWebItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormLiveUrl(item.liveUrl);
    setFormIsPublished(item.isPublished);
    setFormOrder(item.order);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategory.trim() || !formLiveUrl.trim()) {
      setToast({ message: 'Nama web, kategori, dan Live URL wajib diisi.', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = editingItem
        ? `/api/admin/static-web/${editingItem.id}`
        : '/api/admin/static-web';
      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory.trim(),
          liveUrl: formLiveUrl.trim(),
          isPublished: formIsPublished,
          order: formOrder,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setToast({ message: data.error || 'Gagal menyimpan data.', type: 'error' });
        return;
      }

      if (editingItem) {
        setItems((prev) => prev.map((it) => (it.id === editingItem.id ? data.item : it)));
        setToast({ message: `"${data.item.name}" berhasil diperbarui.`, type: 'success' });
      } else {
        setItems((prev) => [data.item, ...prev]);
        setToast({
          message: `"${data.item.name}" berhasil ditambahkan.`,
          type: 'success',
        });
      }
      setIsModalOpen(false);
    } catch {
      setToast({ message: 'Terjadi kesalahan jaringan saat menyimpan.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefreshThumbnail = async (item: StaticWebItem) => {
    setRefreshingId(item.id);
    try {
      const res = await fetch(`/api/admin/static-web/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshThumbnail: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems((prev) => prev.map((it) => (it.id === item.id ? data.item : it)));
        setToast({ message: `Thumbnail "${item.name}" diperbarui.`, type: 'success' });
      } else {
        setToast({ message: data.error || 'Gagal memperbarui thumbnail.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Gagal terhubung ke server.', type: 'error' });
    } finally {
      setRefreshingId(null);
    }
  };

  const handleTogglePublished = async (item: StaticWebItem) => {
    setTogglingId(item.id);
    const nextState = !item.isPublished;
    try {
      const res = await fetch(`/api/admin/static-web/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: nextState }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems((prev) => prev.map((it) => (it.id === item.id ? data.item : it)));
        setToast({
          message: nextState
            ? `"${item.name}" dipublikasikan ke /statis-web.`
            : `"${item.name}" disimpan sebagai Draft.`,
          type: 'success',
        });
      }
    } catch {
      setToast({ message: 'Gagal mengubah status publikasi.', type: 'error' });
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/static-web/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems((prev) => prev.filter((it) => it.id !== deleteTarget.id));
        setToast({ message: `"${deleteTarget.name}" dihapus.`, type: 'success' });
        setDeleteTarget(null);
      } else {
        setToast({ message: data.error || 'Gagal menghapus data.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan saat menghapus data.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const publishedCount = items.filter((i) => i.isPublished).length;

  return (
    <div className="space-y-6 pb-10">
      <Toast
        isOpen={Boolean(toast)}
        message={toast?.message || ''}
        type={toast?.type || 'success'}
        onClose={() => setToast(null)}
      />

      {/* Header */}
      <Card className="bg-white sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>{items.length} Total</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">{publishedCount} Live</span>
              <span aria-hidden="true">·</span>
              <span>{items.length - publishedCount} Draft</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Web &amp; Landing Page
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Masukkan Nama, Kategori, dan Live URL — thumbnail preview website diambil otomatis saat disimpan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href="/statis-web"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat /statis-web</span>
            </a>
            <Button
              onClick={openCreateModal}
              icon={<Plus className="w-4 h-4" />}
              size="md"
            >
              Tambah Web Statis
            </Button>
          </div>
        </div>
      </Card>

      {/* Search & Category Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="w-full lg:max-w-sm">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama web, kategori, atau URL..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat === 'ALL' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Memuat daftar web statis...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              {items.length === 0 ? 'Belum ada data Web Statis' : 'Tidak ada hasil yang cocok'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {items.length === 0
                ? 'Tambahkan web statis pertama Anda dengan mengisi nama, kategori, dan link live website.'
                : 'Coba ubah kata kunci pencarian atau pilih kategori lain.'}
            </p>
          </div>
          {items.length === 0 && (
            <div className="pt-1">
              <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
                Tambah Web Statis
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="!p-0 overflow-hidden flex flex-col justify-between"
            >
              {/* Screenshot Thumbnail (unobstructed) */}
              <div className="aspect-[16/10] bg-slate-100 border-b border-slate-100 overflow-hidden">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Globe className="w-7 h-7 opacity-50" />
                    <span className="text-[11px] font-medium">Preview belum tersedia</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                        item.isPublished
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                      }`}
                    >
                      {item.isPublished ? 'Live' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>

                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline break-all line-clamp-1"
                  >
                    <span>{item.liveUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleRefreshThumbnail(item)}
                    disabled={refreshingId === item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${refreshingId === item.id ? 'animate-spin text-blue-600' : ''}`}
                    />
                    <span>{refreshingId === item.id ? 'Mengambil...' : 'Refresh Preview'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(item)}
                      disabled={togglingId === item.id}
                      aria-label={item.isPublished ? 'Jadikan Draft' : 'Publikasikan'}
                      title={item.isPublished ? 'Jadikan Draft' : 'Publikasikan'}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {item.isPublished ? (
                        <Eye className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-amber-600" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      aria-label="Edit"
                      title="Edit"
                      className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      aria-label="Hapus"
                      title="Hapus"
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        maxWidth="lg"
        title={editingItem ? 'Edit Web Statis' : 'Tambah Web Statis'}
        subtitle="Thumbnail screenshot diambil otomatis dari Live URL saat disimpan."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Web Statis"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Contoh: Landing Page Kopi Nusantara"
            required
          />

          <div className="space-y-2">
            <Input
              label="Kategori"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              placeholder="Contoh: Landing Page"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CATEGORIES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormCategory(preset)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    formCategory === preset
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Live URL Website"
            type="text"
            value={formLiveUrl}
            onChange={(e) => setFormLiveUrl(e.target.value)}
            placeholder="https://contoh-website.com"
            helperText="Bisa langsung tulis domain (contoh: example.com) atau URL lengkap dengan https://"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 items-end">
            <Input
              label="Urutan Tampil"
              type="number"
              value={formOrder}
              onChange={(e) => setFormOrder(Number(e.target.value) || 0)}
              min={0}
            />

            <div className="flex items-center gap-2.5 pb-2.5">
              <Checkbox
                id="static-web-published"
                checked={formIsPublished}
                onChange={setFormIsPublished}
              />
              <label
                htmlFor="static-web-published"
                className="text-xs font-bold text-slate-700 cursor-pointer select-none"
              >
                Tampilkan di /statis-web
              </label>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button type="submit" isLoading={submitting}>
              {submitting
                ? 'Menyimpan...'
                : editingItem
                  ? 'Simpan Perubahan'
                  : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Web Statis"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.name || ''}" secara permanen?`}
        confirmText="Ya, Hapus"
        isLoading={deleting}
      />
    </div>
  );
};
