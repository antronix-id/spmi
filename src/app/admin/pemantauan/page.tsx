'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { MonitoringData, SpmiStandardAspect } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MonitoringTab } from '@/components/admin/MonitoringTab';
import { MonitoringModal } from '@/components/admin/modals/MonitoringModal';

function PemantauanContent() {
  const searchParams = useSearchParams();
  const [monitoring, setMonitoring] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form State
  const [monModalOpen, setMonModalOpen] = useState(false);
  const [editingMonId, setEditingMonId] = useState<string | null>(null);
  const [monForm, setMonForm] = useState<{
    standard_name: string;
    category: SpmiStandardAspect;
    faculty: string;
    study_program: string;
    target_score: number;
    actual_score: number;
    status: MonitoringData['status'];
    audit_period: string;
    findings_count: number;
    resolved_findings: number;
  }>({
    standard_name: '',
    category: 'Pendidikan',
    faculty: 'Fakultas Ekonomi & Bisnis',
    study_program: 'S1 Manajemen',
    target_score: 90,
    actual_score: 95,
    status: 'Melampaui',
    audit_period: '2024/2025 Genap',
    findings_count: 0,
    resolved_findings: 0
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMonitoring = async () => {
    setLoading(true);
    try {
      const data = await dataService.getMonitoringData();
      setMonitoring(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data pemantauan mutu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoring();
  }, []);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      openAddMon();
    }
  }, [searchParams]);

  const openAddMon = () => {
    setEditingMonId(null);
    setMonForm({
      standard_name: '',
      category: 'Pendidikan',
      faculty: 'Fakultas Ekonomi & Bisnis',
      study_program: 'S1 Manajemen',
      target_score: 90,
      actual_score: 92,
      status: 'Tercapai',
      audit_period: '2024/2025 Genap',
      findings_count: 0,
      resolved_findings: 0
    });
    setMonModalOpen(true);
  };

  const openEditMon = (mon: MonitoringData) => {
    setEditingMonId(mon.id);
    setMonForm({
      standard_name: mon.standard_name,
      category: mon.category,
      faculty: mon.faculty,
      study_program: mon.study_program || '',
      target_score: mon.target_score,
      actual_score: mon.actual_score,
      status: mon.status,
      audit_period: mon.audit_period,
      findings_count: mon.findings_count || 0,
      resolved_findings: mon.resolved_findings || 0
    });
    setMonModalOpen(true);
  };

  const handleSaveMon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monForm.standard_name) {
      showToast('Nama Standar wajib diisi', 'error');
      return;
    }

    const achievement_rate = monForm.target_score > 0 
      ? Math.round((Number(monForm.actual_score) / Number(monForm.target_score)) * 100) 
      : 100;

    const item: MonitoringData = {
      id: editingMonId || `mon_${Date.now()}`,
      standard_name: monForm.standard_name,
      category: monForm.category,
      faculty: monForm.faculty,
      study_program: monForm.study_program,
      target_score: Number(monForm.target_score),
      actual_score: Number(monForm.actual_score),
      achievement_rate: achievement_rate,
      status: monForm.status,
      audit_period: monForm.audit_period,
      findings_count: Number(monForm.findings_count),
      resolved_findings: Number(monForm.resolved_findings)
    };

    const success = await dataService.saveMonitoringData(item);
    if (success) {
      if (editingMonId) {
        setMonitoring(monitoring.map(m => m.id === editingMonId ? item : m));
        showToast('Data pemantauan AMI berhasil diperbarui');
      } else {
        setMonitoring([item, ...monitoring]);
        showToast('Data pemantauan AMI baru berhasil ditambahkan');
      }
      setMonModalOpen(false);
    } else {
      showToast('Gagal menyimpan data pemantauan', 'error');
    }
  };

  const handleDeleteMon = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data audit ini?')) {
      await dataService.deleteMonitoringData(id);
      setMonitoring(monitoring.filter(m => m.id !== id));
      showToast('Data pemantauan berhasil dihapus');
    }
  };

  return (
    <AdminLayout activeTab="monitoring" itemCount={monitoring.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Evaluasi & Pemantauan Mutu (AMI)...</p>
        </div>
      ) : (
        <MonitoringTab
          monitoring={monitoring}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAdd={openAddMon}
          onOpenEdit={openEditMon}
          onDelete={handleDeleteMon}
          onRefresh={loadMonitoring}
        />
      )}

      <MonitoringModal
        isOpen={monModalOpen}
        onClose={() => setMonModalOpen(false)}
        isEditing={!!editingMonId}
        form={monForm}
        setForm={setMonForm}
        onSave={handleSaveMon}
      />
    </AdminLayout>
  );
}

export default function AdminPemantauanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <PemantauanContent />
    </Suspense>
  );
}
