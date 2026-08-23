'use client';

import React from 'react';
import { FileUp, Loader2, CheckCircle2, FileText, Upload } from 'lucide-react';
import { SpmiDocument, SpmiStandardAspect } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';

const STANDARD_ASPECTS: SpmiStandardAspect[] = [
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

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: {
    title: string;
    category: SpmiDocument['category'];
    standard_aspect: SpmiStandardAspect | '';
    document_code: string;
    year: number;
    description: string;
    file_url: string;
    file_size: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  uploading: boolean;
  uploadedFileName: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentModal({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  uploading,
  uploadedFileName,
  onFileUpload
}: DocumentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-5 sm:p-6 sm:rounded-2xl shadow-2xl">
        
        <DialogHeader className="pb-2 border-b border-zinc-800">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-brand-400" />
            {isEditing ? 'Edit Dokumen SPMI' : 'Tambah Dokumen Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Arsip standar, manual mutu, kebijakan, dan formulir penjaminan mutu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-3.5 pt-2">
          
          {/* Judul Dokumen */}
          <div className="space-y-1">
            <Label htmlFor="doc-title" className="text-xs font-semibold text-zinc-300">
              Nama / Judul Dokumen *
            </Label>
            <Input
              id="doc-title"
              required
              placeholder="Contoh: Standar Kompetensi Lulusan Universitas Palembang"
              value={form.title}
              onChange={(e) => setForm((prev: any) => ({ ...prev, title: e.target.value }))}
              className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
            />
          </div>

          {/* Row 1: Kategori & Aspek */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Kategori Dokumen *</Label>
              <Select
                value={form.category}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  <SelectItem value="Kebijakan SPMI">Kebijakan SPMI</SelectItem>
                  <SelectItem value="Manual Mutu">Manual Mutu</SelectItem>
                  <SelectItem value="Standar SPMI">Standar SPMI</SelectItem>
                  <SelectItem value="Formulir Mutu">Formulir Mutu / SOP</SelectItem>
                  <SelectItem value="Laporan AMI">Laporan AMI</SelectItem>
                  <SelectItem value="Dokumen RTM">Dokumen RTM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Aspek Standar SPMI</Label>
              <Select
                value={form.standard_aspect || 'none'}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, standard_aspect: val === 'none' ? '' : val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg">
                  <SelectValue placeholder="Pilih Aspek Standar" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  <SelectItem value="none">-- Umum / Tanpa Aspek --</SelectItem>
                  {STANDARD_ASPECTS.map((aspect) => (
                    <SelectItem key={aspect} value={aspect}>
                      {aspect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Kode & Tahun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="doc-code" className="text-xs font-semibold text-zinc-300">
                Kode Dokumen *
              </Label>
              <Input
                id="doc-code"
                required
                placeholder="Contoh: UNPAL-STD-PEND-01"
                value={form.document_code}
                onChange={(e) => setForm((prev: any) => ({ ...prev, document_code: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs font-mono rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="doc-year" className="text-xs font-semibold text-zinc-300">
                Tahun Penetapan *
              </Label>
              <Input
                id="doc-year"
                type="number"
                required
                min={2000}
                max={2099}
                value={form.year}
                onChange={(e) => setForm((prev: any) => ({ ...prev, year: Number(e.target.value) }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <Label htmlFor="doc-desc" className="text-xs font-semibold text-zinc-300">
              Deskripsi Singkat (Opsional)
            </Label>
            <Textarea
              id="doc-desc"
              rows={2}
              placeholder="Deskripsi ringkas mengenai cakupan atau ruang lingkup dokumen..."
              value={form.description}
              onChange={(e) => setForm((prev: any) => ({ ...prev, description: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-brand-400" />
              Berkas PDF Dokumen
            </Label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors shadow-2xs">
                <FileUp className="w-3.5 h-3.5" />
                <span>Pilih PDF</span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={onFileUpload} 
                  disabled={uploading} 
                />
              </label>

              {uploading && (
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
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
              {isEditing ? 'Simpan Perubahan' : 'Tambah Dokumen'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
