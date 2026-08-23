'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { Regulation } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { RegulationsTab } from '@/components/admin/RegulationsTab';
import { RegulationModal } from '@/components/admin/modals/RegulationModal';

function PeraturanContent() {
  const searchParams = useSearchParams();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form State
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [editingRegId, setEditingRegId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState<{
    title: string;
    regulation_number: string;
    category: Regulation['category'];
    year: number;
    description: string;
    file_url: string;
    issued_by: string;
  }>({
    title: '',
    regulation_number: '',
    category: 'SK Rektor',
    year: new Date().getFullYear(),
    description: '',
    file_url: '#',
    issued_by: 'Rektor Universitas Palembang'
  });
  const [uploadingRegFile, setUploadingRegFile] = useState(false);
  const [uploadedRegFileName, setUploadedRegFileName] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadRegulations = async () => {
    setLoading(true);
    try {
      const data = await dataService.getRegulations();
      setRegulations(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat daftar regulasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegulations();
  }, []);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openAddReg();
    }
  }, [searchParams]);

  const openAddReg = () => {
    setEditingRegId(null);
    setRegForm({
      title: '',
      regulation_number: `SK-REKTOR/${new Date().getFullYear()}/01`,
      category: 'SK Rektor',
      year: new Date().getFullYear(),
      description: '',
      file_url: '#',
      issued_by: 'Rektor Universitas Palembang'
    });
    setUploadedRegFileName('');
    setRegModalOpen(true);
  };

  const openEditReg = (reg: Regulation) => {
    setEditingRegId(reg.id);
    setRegForm({
      title: reg.title,
      regulation_number: reg.regulation_number,
      category: reg.category,
      year: reg.year,
      description: reg.description || '',
      file_url: reg.file_url,
      issued_by: reg.issued_by || 'Rektor Universitas Palembang'
    });
    setUploadedRegFileName('');
    setRegModalOpen(true);
  };

  const handleRegFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingRegFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      setRegForm(prev => ({
        ...prev,
        file_url: data.url
      }));
      setUploadedRegFileName(file.name);
      showToast(`File regulasi "${file.name}" berhasil diunggah!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah regulasi', 'error');
    } finally {
      setUploadingRegFile(false);
    }
  };

  const handleSaveReg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.title || !regForm.regulation_number) {
      showToast('Judul dan Nomor Regulasi wajib diisi', 'error');
      return;
    }

    const item: Regulation = {
      id: editingRegId || `reg_${Date.now()}`,
      title: regForm.title,
      regulation_number: regForm.regulation_number,
      category: regForm.category,
      year: Number(regForm.year),
      description: regForm.description,
      file_url: regForm.file_url || '#',
      issued_by: regForm.issued_by
    };

    const success = await dataService.saveRegulation(item);
    if (success) {
      if (editingRegId) {
        setRegulations(regulations.map(r => r.id === editingRegId ? item : r));
        showToast('Peraturan berhasil diperbarui');
      } else {
        setRegulations([item, ...regulations]);
        showToast('Peraturan baru berhasil ditambahkan');
      }
      setRegModalOpen(false);
    } else {
      showToast('Gagal menyimpan peraturan', 'error');
    }
  };

  const handleDeleteReg = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus peraturan ini?')) {
      await dataService.deleteRegulation(id);
      setRegulations(regulations.filter(r => r.id !== id));
      showToast('Peraturan berhasil dihapus');
    }
  };

  return (
    <AdminLayout activeTab="regulations" itemCount={regulations.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Peraturan & Regulasi...</p>
        </div>
      ) : (
        <RegulationsTab
          regulations={regulations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAdd={openAddReg}
          onOpenEdit={openEditReg}
          onDelete={handleDeleteReg}
          onRefresh={loadRegulations}
        />
      )}

      <RegulationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        isEditing={!!editingRegId}
        form={regForm}
        setForm={setRegForm}
        onSave={handleSaveReg}
        uploading={uploadingRegFile}
        uploadedFileName={uploadedRegFileName}
        onFileUpload={handleRegFileUpload}
      />
    </AdminLayout>
  );
}

export default function AdminPeraturanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <PeraturanContent />
    </Suspense>
  );
}
