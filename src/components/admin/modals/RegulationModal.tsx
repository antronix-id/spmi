'use client';

import React from 'react';
import { Scale, FileUp, Loader2, CheckCircle2, Upload } from 'lucide-react';
import { Regulation } from '@/lib/types';
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

interface RegulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: {
    title: string;
    regulation_number: string;
    category: Regulation['category'];
    year: number;
    description: string;
    file_url: string;
    issued_by: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  uploading: boolean;
  uploadedFileName: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RegulationModal({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  uploading,
  uploadedFileName,
  onFileUpload
}: RegulationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 p-5 sm:p-6 sm:rounded-2xl shadow-2xl">
        
        <DialogHeader className="pb-2 border-b border-zinc-800">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-4.5 h-4.5 text-purple-400" />
            {isEditing ? 'Edit Regulasi' : 'Tambah Peraturan Baru'}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Pangkalan data payung hukum nasional dan regulasi internal universitas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-3.5 pt-2">
          
          {/* Judul Peraturan */}
          <div className="space-y-1">
            <Label htmlFor="reg-title" className="text-xs font-semibold text-zinc-300">
              Nama / Tentang Peraturan *
            </Label>
            <Input
              id="reg-title"
              required
              placeholder="Contoh: Standar Nasional Pendidikan Tinggi (SN-Dikti)"
              value={form.title}
              onChange={(e) => setForm((prev: any) => ({ ...prev, title: e.target.value }))}
              className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
            />
          </div>

          {/* Row 1: Nomor & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-num" className="text-xs font-semibold text-zinc-300">
                Nomor Peraturan / SK *
              </Label>
              <Input
                id="reg-num"
                required
                placeholder="Contoh: Permendikbudristek No. 53/2023"
                value={form.regulation_number}
                onChange={(e) => setForm((prev: any) => ({ ...prev, regulation_number: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs font-mono rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-zinc-300">Kategori Regulasi *</Label>
              <Select
                value={form.category}
                onValueChange={(val: any) => setForm((prev: any) => ({ ...prev, category: val }))}
              >
                <SelectTrigger className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs">
                  <SelectItem value="Undang-Undang">Undang-Undang</SelectItem>
                  <SelectItem value="Permendikbudristek">Permendikbudristek</SelectItem>
                  <SelectItem value="SN-Dikti">SN-Dikti</SelectItem>
                  <SelectItem value="SK Rektor">SK Rektor</SelectItem>
                  <SelectItem value="Pedoman SPMI">Pedoman SPMI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Penerbit & Tahun */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="reg-issuer" className="text-xs font-semibold text-zinc-300">
                Diterbitkan Oleh *
              </Label>
              <Input
                id="reg-issuer"
                required
                placeholder="Contoh: Kemendikbudristek RI / Rektor UNPAL"
                value={form.issued_by}
                onChange={(e) => setForm((prev: any) => ({ ...prev, issued_by: e.target.value }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-year" className="text-xs font-semibold text-zinc-300">
                Tahun Penetapan *
              </Label>
              <Input
                id="reg-year"
                type="number"
                required
                min={1945}
                max={2099}
                value={form.year}
                onChange={(e) => setForm((prev: any) => ({ ...prev, year: Number(e.target.value) }))}
                className="h-8.5 bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <Label htmlFor="reg-desc" className="text-xs font-semibold text-zinc-300">
              Ringkasan Regulasi (Opsional)
            </Label>
            <Textarea
              id="reg-desc"
              rows={2}
              placeholder="Ringkasan poin penting atau ketetapan utama..."
              value={form.description}
              onChange={(e) => setForm((prev: any) => ({ ...prev, description: e.target.value }))}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 text-xs rounded-lg"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <Label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              Salinan Berkas PDF
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
                <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium">
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
              {isEditing ? 'Simpan Perubahan' : 'Tambah Regulasi'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
