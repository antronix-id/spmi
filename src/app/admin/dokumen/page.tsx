'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { SpmiDocument, SpmiStandardAspect, DocumentAccessKey } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DocumentsTab } from '@/components/admin/DocumentsTab';
import { DocumentModal } from '@/components/admin/modals/DocumentModal';
import { GenerateAccessKeyModal } from '@/components/admin/modals/GenerateAccessKeyModal';

function DokumenContent() {
  const searchParams = useSearchParams();
  const [documents, setDocuments] = useState<SpmiDocument[]>([]);
  const [accessKeys, setAccessKeys] = useState<DocumentAccessKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Access Key Modal State
  const [generateKeyModalOpen, setGenerateKeyModalOpen] = useState(false);

  // Modal & Form State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docForm, setDocForm] = useState<{
    title: string;
    category: SpmiDocument['category'];
    standard_aspect: SpmiStandardAspect | '';
    document_code: string;
    year: number;
    description: string;
    file_url: string;
    file_size: string;
  }>({
    title: '',
    category: 'Standar SPMI',
    standard_aspect: 'Pendidikan',
    document_code: '',
    year: new Date().getFullYear(),
    description: '',
    file_url: '#',
    file_size: '2.5 MB'
  });
  const [uploadingDocFile, setUploadingDocFile] = useState(false);
  const [uploadedDocFileName, setUploadedDocFileName] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, keys] = await Promise.all([
        dataService.getDocuments(),
        dataService.getDocumentAccessKeys()
      ]);
      setDocuments(docs);
      setAccessKeys(keys);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data dokumen dan akses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadAccessKeys = async () => {
    try {
      const keys = await dataService.getDocumentAccessKeys();
      setAccessKeys(keys);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAccessKey = async (newKey: DocumentAccessKey): Promise<boolean> => {
    const success = await dataService.saveDocumentAccessKey(newKey);
    if (success) {
      setAccessKeys(prev => [newKey, ...prev.filter(k => k.id !== newKey.id)]);
      showToast(`Kode akses "${newKey.code}" berhasil dibuat!`);
      return true;
    }
    return false;
  };

  const handleToggleAccessKeyStatus = async (id: string, is_active: boolean) => {
    await dataService.toggleDocumentAccessKey(id, is_active);
    setAccessKeys(prev => prev.map(k => k.id === id ? { ...k, is_active } : k));
    showToast(is_active ? 'Akses berhasil diaktifkan kembali' : 'Akses berhasil dinonaktifkan');
  };

  const handleDeleteAccessKey = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kode akses ini? Pihak yang memegang kode ini tidak akan bisa mengakses dokumen lagi.')) {
      await dataService.deleteDocumentAccessKey(id);
      setAccessKeys(prev => prev.filter(k => k.id !== id));
      showToast('Kode akses berhasil dihapus');
    }
  };

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openAddDoc();
    }
  }, [searchParams]);

  const openAddDoc = () => {
    setEditingDocId(null);
    setDocForm({
      title: '',
      category: 'Standar SPMI',
      standard_aspect: 'Pendidikan',
      document_code: `STD-SPMI-${new Date().getFullYear()}-${String(documents.length + 1).padStart(3, '0')}`,
      year: new Date().getFullYear(),
      description: '',
      file_url: '#',
      file_size: '2.5 MB'
    });
    setUploadedDocFileName('');
    setDocModalOpen(true);
  };

  const openEditDoc = (doc: SpmiDocument) => {
    setEditingDocId(doc.id);
    setDocForm({
      title: doc.title,
      category: doc.category,
      standard_aspect: doc.standard_aspect || '',
      document_code: doc.document_code,
      year: doc.year,
      description: doc.description || '',
      file_url: doc.file_url,
      file_size: doc.file_size || '2.0 MB'
    });
    setUploadedDocFileName('');
    setDocModalOpen(true);
  };

  const handleDocFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDocFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      setDocForm(prev => ({
        ...prev,
        file_url: data.url,
        file_size: data.size ? `${(data.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB'
      }));
      setUploadedDocFileName(file.name);
      showToast(`File "${file.name}" berhasil diunggah!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah file', 'error');
    } finally {
      setUploadingDocFile(false);
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.document_code) {
      showToast('Judul dan Kode Dokumen wajib diisi', 'error');
      return;
    }

    const item: SpmiDocument = {
      id: editingDocId || `doc_${Date.now()}`,
      title: docForm.title,
      category: docForm.category,
      standard_aspect: docForm.category === 'Standar SPMI' ? (docForm.standard_aspect as SpmiStandardAspect) : undefined,
      document_code: docForm.document_code,
      year: Number(docForm.year),
      description: docForm.description,
      file_url: docForm.file_url || '#',
      file_size: docForm.file_size || '2.0 MB',
      updated_at: new Date().toISOString()
    };

    const success = await dataService.saveDocument(item);
    if (success) {
      if (editingDocId) {
        setDocuments(documents.map(d => d.id === editingDocId ? item : d));
        showToast('Dokumen berhasil diperbarui');
      } else {
        setDocuments([item, ...documents]);
        showToast('Dokumen baru berhasil ditambahkan');
      }
      setDocModalOpen(false);
    } else {
      showToast('Gagal menyimpan dokumen', 'error');
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      await dataService.deleteDocument(id);
      setDocuments(documents.filter(d => d.id !== id));
      showToast('Dokumen berhasil dihapus');
    }
  };

  return (
    <AdminLayout activeTab="documents" itemCount={documents.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Dokumen SPMI...</p>
        </div>
      ) : (
        <DocumentsTab
          documents={documents}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAdd={openAddDoc}
          onOpenEdit={openEditDoc}
          onDelete={handleDeleteDoc}
          onRefresh={loadData}
          accessKeys={accessKeys}
          onOpenGenerateAccessKey={() => setGenerateKeyModalOpen(true)}
          onToggleAccessKeyStatus={handleToggleAccessKeyStatus}
          onDeleteAccessKey={handleDeleteAccessKey}
          onRefreshAccessKeys={loadAccessKeys}
        />
      )}

      {/* Edit / Add Document Modal */}
      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        isEditing={!!editingDocId}
        form={docForm}
        setForm={setDocForm}
        onSave={handleSaveDoc}
        uploading={uploadingDocFile}
        uploadedFileName={uploadedDocFileName}
        onFileUpload={handleDocFileUpload}
      />

      {/* Generate Access Key Modal */}
      <GenerateAccessKeyModal
        isOpen={generateKeyModalOpen}
        onClose={() => setGenerateKeyModalOpen(false)}
        onSave={handleSaveAccessKey}
      />
    </AdminLayout>
  );
}

export default function AdminDokumenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <DokumenContent />
    </Suspense>
  );
}
