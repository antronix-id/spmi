'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { Accreditation } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AccreditationsTab } from '@/components/admin/AccreditationsTab';
import { AccreditationModal } from '@/components/admin/modals/AccreditationModal';

function AkreditasiContent() {
  const searchParams = useSearchParams();
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form State
  const [accredModalOpen, setAccredModalOpen] = useState(false);
  const [editingAccredId, setEditingAccredId] = useState<string | null>(null);
  const [accredForm, setAccredForm] = useState<{
    institution_or_program: string;
    level: Accreditation['level'];
    faculty: string;
    rating: Accreditation['rating'];
    sk_number: string;
    decree_date: string;
    expiry_date: string;
    status: Accreditation['status'];
    accreditation_agency: Accreditation['accreditation_agency'];
    certificate_url: string;
  }>({
    institution_or_program: '',
    level: 'S1',
    faculty: 'Fakultas Ekonomi & Bisnis',
    rating: 'Unggul',
    sk_number: '',
    decree_date: '2023-01-01',
    expiry_date: '2028-01-01',
    status: 'Aktif',
    accreditation_agency: 'LAMEMBA',
    certificate_url: '#'
  });
  const [uploadingAccredFile, setUploadingAccredFile] = useState(false);
  const [uploadedAccredFileName, setUploadedAccredFileName] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAccreditations = async () => {
    setLoading(true);
    try {
      const data = await dataService.getAccreditations();
      setAccreditations(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat daftar akreditasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccreditations();
  }, []);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openAddAccred();
    }
  }, [searchParams]);

  const openAddAccred = () => {
    setEditingAccredId(null);
    setAccredForm({
      institution_or_program: '',
      level: 'S1',
      faculty: 'Fakultas Ekonomi & Bisnis',
      rating: 'Unggul',
      sk_number: `SK/BAN-PT/AK-${new Date().getFullYear()}/001`,
      decree_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Aktif',
      accreditation_agency: 'LAMEMBA',
      certificate_url: '#'
    });
    setUploadedAccredFileName('');
    setAccredModalOpen(true);
  };

  const openEditAccred = (acc: Accreditation) => {
    setEditingAccredId(acc.id);
    setAccredForm({
      institution_or_program: acc.institution_or_program,
      level: acc.level,
      faculty: acc.faculty || 'Universitas',
      rating: acc.rating,
      sk_number: acc.sk_number,
      decree_date: acc.decree_date || '',
      expiry_date: acc.expiry_date,
      status: acc.status,
      accreditation_agency: acc.accreditation_agency,
      certificate_url: acc.certificate_url || '#'
    });
    setUploadedAccredFileName('');
    setAccredModalOpen(true);
  };

  const handleAccredFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB
    if (file.size > MAX_FILE_SIZE) {
      const currentMB = (file.size / (1024 * 1024)).toFixed(2);
      showToast(`Ukuran berkas (${currentMB} MB) melebihi batas maksimal 6 MB. Silakan pilih berkas yang lebih kecil.`, 'error');
      e.target.value = '';
      return;
    }

    setUploadingAccredFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      setAccredForm(prev => ({
        ...prev,
        certificate_url: data.url
      }));
      setUploadedAccredFileName(file.name);
      showToast(`Sertifikat "${file.name}" berhasil diunggah!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah sertifikat', 'error');
    } finally {
      setUploadingAccredFile(false);
    }
  };

  const handleSaveAccred = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accredForm.institution_or_program || !accredForm.sk_number) {
      showToast('Nama Program/Institusi dan Nomor SK wajib diisi', 'error');
      return;
    }

    const item: Accreditation = {
      id: editingAccredId || `acc_${Date.now()}`,
      institution_or_program: accredForm.institution_or_program,
      level: accredForm.level,
      faculty: accredForm.faculty,
      rating: accredForm.rating,
      sk_number: accredForm.sk_number,
      decree_date: accredForm.decree_date,
      expiry_date: accredForm.expiry_date,
      status: accredForm.status,
      accreditation_agency: accredForm.accreditation_agency,
      certificate_url: accredForm.certificate_url
    };

    const success = await dataService.saveAccreditation(item);
    if (success) {
      if (editingAccredId) {
        setAccreditations(accreditations.map(a => a.id === editingAccredId ? item : a));
        showToast('Data akreditasi berhasil diperbarui');
      } else {
        setAccreditations([item, ...accreditations]);
        showToast('Akreditasi baru berhasil ditambahkan');
      }
      setAccredModalOpen(false);
    } else {
      showToast('Gagal menyimpan akreditasi', 'error');
    }
  };

  const handleDeleteAccred = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data akreditasi ini?')) {
      await dataService.deleteAccreditation(id);
      setAccreditations(accreditations.filter(a => a.id !== id));
      showToast('Akreditasi berhasil dihapus');
    }
  };

  return (
    <AdminLayout activeTab="accreditations" itemCount={accreditations.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Data Akreditasi...</p>
        </div>
      ) : (
        <AccreditationsTab
          accreditations={accreditations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAdd={openAddAccred}
          onOpenEdit={openEditAccred}
          onDelete={handleDeleteAccred}
          onRefresh={loadAccreditations}
        />
      )}

      <AccreditationModal
        isOpen={accredModalOpen}
        onClose={() => setAccredModalOpen(false)}
        isEditing={!!editingAccredId}
        form={accredForm}
        setForm={setAccredForm}
        onSave={handleSaveAccred}
        uploading={uploadingAccredFile}
        uploadedFileName={uploadedAccredFileName}
        onFileUpload={handleAccredFileUpload}
      />
    </AdminLayout>
  );
}

export default function AdminAkreditasiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <AkreditasiContent />
    </Suspense>
  );
}
