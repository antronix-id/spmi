'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { MonitoringData, SpmiStandardAspect } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';

const STANDARD_ASPECTS: SpmiStandardAspect[] = [
  'Non-Aspek',
  'Pendidikan',
  'Penelitian',
  'Pengabdian pada Masyarakat',
  'Organisasi',
  'Kemahasiswaan',
  'Sumber Daya Manusia',
  'Sarana Prasarana',
  'Keuangan',
  'Kerja Sama',
  'Kesejahteraan'
];

interface MonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: {
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
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
}

export function MonitoringModal({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave
}: MonitoringModalProps) {
  const calculatedRate = form.target_score > 0 
    ? Number(((form.actual_score / form.target_score) * 100).toFixed(1)) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-5 sm:p-6 sm:rounded-2xl shadow-2xl">
        
        <DialogHeader className="pb-2 border-b border-zinc-800">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-emerald-400" />
            {isEditing ? 'Edit Evaluasi AMI' : 'Tambah Evaluasi Mutu Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Formulir skor target dan capaian indikator Audit Mutu Internal (AMI).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-3.5 pt-2">
          
          {/* Nama Standar */}
          <div className="space-y-1">
            <Label htmlFor="mon-name" className="text-xs font-semibold text-zinc-300">
              Nama Standar / Indikator Mutu *
            </Label>
            <Input
              id="mon-name"
              required
              placeholder="Contoh: Rasio Dosen Bergelar Doktor (S3)"
              value={form.standard_name}
              onChange={(e) => setForm((prev: any) => ({ ...prev, standard_name: e.target.value }))}
              className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
            />
          </div>

          {/* Row 1: Aspek & Periode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Aspek SPMI *</Label>
              <Select
                value={form.category}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg">
                  <SelectValue placeholder="Pilih Aspek" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  {STANDARD_ASPECTS.map((aspect) => (
                    <SelectItem key={aspect} value={aspect}>
                      {aspect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="mon-period" className="text-xs font-semibold text-zinc-300">
                Periode Audit *
              </Label>
              <Input
                id="mon-period"
                required
                placeholder="Contoh: 2024/2025 Ganjil"
                value={form.audit_period}
                onChange={(e) => setForm((prev: any) => ({ ...prev, audit_period: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Row 2: Fakultas & Prodi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="mon-fac" className="text-xs font-semibold text-zinc-300">
                Fakultas / Unit Kerja *
              </Label>
              <Input
                id="mon-fac"
                required
                placeholder="Contoh: Fakultas Ekonomi & Bisnis"
                value={form.faculty}
                onChange={(e) => setForm((prev: any) => ({ ...prev, faculty: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="mon-prodi" className="text-xs font-semibold text-zinc-300">
                Program Studi (Opsional)
              </Label>
              <Input
                id="mon-prodi"
                placeholder="Contoh: S1 Manajemen"
                value={form.study_program}
                onChange={(e) => setForm((prev: any) => ({ ...prev, study_program: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Row 3: Target, Capaian & Status */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="mon-target" className="text-[11px] font-semibold text-zinc-400">Target *</Label>
                <Input
                  id="mon-target"
                  type="number"
                  required
                  step="0.1"
                  value={form.target_score}
                  onChange={(e) => setForm((prev: any) => ({ ...prev, target_score: Number(e.target.value) }))}
                  className="h-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs font-mono font-bold rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="mon-actual" className="text-[11px] font-semibold text-zinc-400">Realisasi *</Label>
                <Input
                  id="mon-actual"
                  type="number"
                  required
                  step="0.1"
                  value={form.actual_score}
                  onChange={(e) => setForm((prev: any) => ({ ...prev, actual_score: Number(e.target.value) }))}
                  className="h-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs font-mono font-bold rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-zinc-400">Capaian</Label>
                <div className="h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center px-2.5 text-xs font-mono font-bold text-emerald-400">
                  {calculatedRate}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <Label className="text-[11px] font-semibold text-zinc-400">Status Capaian</Label>
                <Select
                  value={form.status}
                  onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger className="h-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs rounded-lg">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                    <SelectItem value="Melampaui">Melampaui (&gt;100%)</SelectItem>
                    <SelectItem value="Tercapai">Tercapai (95-100%)</SelectItem>
                    <SelectItem value="Belum Tercapai">Belum Tercapai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="mon-findings" className="text-[11px] font-semibold text-zinc-400">Jml Temuan</Label>
                <Input
                  id="mon-findings"
                  type="number"
                  min={0}
                  value={form.findings_count}
                  onChange={(e) => setForm((prev: any) => ({ ...prev, findings_count: Number(e.target.value) }))}
                  className="h-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs font-mono rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="mon-resolved" className="text-[11px] font-semibold text-zinc-400">Ditindaklanjuti</Label>
                <Input
                  id="mon-resolved"
                  type="number"
                  min={0}
                  value={form.resolved_findings}
                  onChange={(e) => setForm((prev: any) => ({ ...prev, resolved_findings: Number(e.target.value) }))}
                  className="h-8 bg-zinc-950 border-zinc-800 text-zinc-100 text-xs font-mono rounded-lg"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-lg px-4"
            >
              {isEditing ? 'Simpan Perubahan' : 'Tambah Evaluasi'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
