'use client';

import React from 'react';
import { Award, FileUp, Loader2, CheckCircle2, Upload } from 'lucide-react';
import { Accreditation } from '@/lib/types';
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

const UNPAL_PROGRAM_STUDI = [
  { name: 'Universitas Palembang', level: 'Institusi' as const, faculty: 'Universitas', agency: 'BAN-PT' as const },
  { name: 'S1 Manajemen', level: 'S1' as const, faculty: 'Fakultas Ekonomi & Bisnis', agency: 'LAMEMBA' as const },
  { name: 'S1 Pendidikan Bahasa Inggris', level: 'S1' as const, faculty: 'Fakultas Keguruan & Ilmu Pendidikan', agency: 'LAMDIK' as const },
  { name: 'S1 Teknik Elektro', level: 'S1' as const, faculty: 'Fakultas Teknik', agency: 'LAM-TEKNIK' as const },
  { name: 'S1 Teknik Sipil', level: 'S1' as const, faculty: 'Fakultas Teknik', agency: 'LAM-TEKNIK' as const },
  { name: 'S1 Ilmu Hukum', level: 'S1' as const, faculty: 'Fakultas Hukum', agency: 'BAN-PT' as const },
  { name: 'S1 Agroteknologi', level: 'S1' as const, faculty: 'Fakultas Pertanian', agency: 'BAN-PT' as const },
];

interface AccreditationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: {
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
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  uploading: boolean;
  uploadedFileName: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AccreditationModal({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  uploading,
  uploadedFileName,
  onFileUpload
}: AccreditationModalProps) {
  const handleSelectProdi = (name: string) => {
    const preset = UNPAL_PROGRAM_STUDI.find(p => p.name === name);
    if (preset) {
      setForm((prev: any) => ({
        ...prev,
        institution_or_program: preset.name,
        level: preset.level,
        faculty: preset.faculty,
        accreditation_agency: preset.agency,
      }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        institution_or_program: name,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-5 sm:p-6 sm:rounded-2xl shadow-2xl">
        
        <DialogHeader className="pb-2 border-b border-zinc-800">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4.5 h-4.5 text-amber-400" />
            {isEditing ? 'Edit Status Akreditasi' : 'Tambah Akreditasi Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Perbarui data akreditasi BAN-PT atau Lembaga Akreditasi Mandiri (LAM).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-3.5 pt-2">
          
          {/* Row 1: Institusi / Program Studi & Jenjang */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs font-semibold text-zinc-300">
                Institusi / Program Studi *
              </Label>
              <Select
                value={form.institution_or_program}
                onValueChange={handleSelectProdi}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Pilih atau masukkan prodi..." />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  {UNPAL_PROGRAM_STUDI.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Jenjang *</Label>
              <Select
                value={form.level}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, level: val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Jenjang" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  <SelectItem value="Institusi">Institusi</SelectItem>
                  <SelectItem value="S1">S1 (Sarjana)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Lembaga & Peringkat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Lembaga Akreditasi *</Label>
              <Select
                value={form.accreditation_agency}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, accreditation_agency: val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Pilih Lembaga" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  <SelectItem value="BAN-PT">BAN-PT</SelectItem>
                  <SelectItem value="LAMEMBA">LAMEMBA (Ekonomi)</SelectItem>
                  <SelectItem value="LAMDIK">LAMDIK (Pendidikan)</SelectItem>
                  <SelectItem value="LAM-TEKNIK">LAM-TEKNIK</SelectItem>
                  <SelectItem value="LAM-INFOKOM">LAM-INFOKOM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Peringkat Nilai *</Label>
              <Select
                value={form.rating}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, rating: val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-xs text-zinc-100 rounded-lg">
                  <SelectValue placeholder="Pilih Nilai" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  <SelectItem value="Unggul">Unggul</SelectItem>
                  <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                  <SelectItem value="Baik">Baik</SelectItem>
                  <SelectItem value="A">A (7 Standar)</SelectItem>
                  <SelectItem value="B">B (7 Standar)</SelectItem>
                  <SelectItem value="Terakreditasi">Terakreditasi Sementara</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>



          {/* Row 4: Nomor SK & Tanggal SK & Masa Berlaku */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="acc-sk" className="text-xs font-semibold text-zinc-300">
                Nomor SK *
              </Label>
              <Input
                id="acc-sk"
                required
                placeholder="1234/SK/BAN-PT/..."
                value={form.sk_number}
                onChange={(e) => setForm((prev: any) => ({ ...prev, sk_number: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs font-mono rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="acc-date" className="text-xs font-semibold text-zinc-300">
                Tgl Ditetapkan *
              </Label>
              <Input
                id="acc-date"
                type="date"
                required
                value={form.decree_date}
                onChange={(e) => setForm((prev: any) => ({ ...prev, decree_date: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="acc-exp" className="text-xs font-semibold text-zinc-300">
                Masa Berlaku *
              </Label>
              <Input
                id="acc-exp"
                type="date"
                required
                value={form.expiry_date}
                onChange={(e) => setForm((prev: any) => ({ ...prev, expiry_date: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Row 5: Simple Upload Sertifikat */}
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              Sertifikat / Salinan SK (PDF)
            </Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors shadow-2xs">
                <FileUp className="w-3.5 h-3.5" />
                <span>Pilih Berkas</span>
                <input 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  onChange={onFileUpload} 
                  disabled={uploading} 
                />
              </label>

              {uploading && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengunggah...</span>
                </div>
              )}

              {uploadedFileName && !uploading && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 truncate max-w-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{uploadedFileName}</span>
                </div>
              )}
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
              {isEditing ? 'Simpan Perubahan' : 'Tambah Akreditasi'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
