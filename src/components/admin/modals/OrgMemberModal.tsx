'use client';

import React from 'react';
import { Users, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { OrganizationMember } from '@/lib/types';
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

interface OrgMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  form: {
    name: string;
    position: string;
    division: string;
    email: string;
    nip: string;
    photo_url: string;
    order: number;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onSave: (e: React.FormEvent) => void;
  uploading: boolean;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DIVISIONS = [
  'Pimpinan Utama SPMI',
  'Pusat Audit & Evaluasi Mutu',
  'Pusat Standar Mutu',
  'Pusat Akreditasi & Asesmen',
  'Divisi Tata Kelola & Administrasi'
];

export function OrgMemberModal({
  isOpen,
  onClose,
  isEditing,
  form,
  setForm,
  onSave,
  uploading,
  onPhotoUpload
}: OrgMemberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-zinc-950 border-zinc-800 text-zinc-100 p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                {isEditing ? 'Edit Anggota / Pengurus LPM' : 'Tambah Anggota / Pengurus LPM'}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                {isEditing 
                  ? 'Perbarui profil pimpinan atau staf pengelola penjaminan mutu' 
                  : 'Tambahkan personil pimpinan atau auditor ke dalam struktur organisasi'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSave} className="space-y-4 pt-2">
          {/* Nama Lengkap & Gelar */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-300">
              Nama Lengkap & Gelar <span className="text-red-400">*</span>
            </Label>
            <Input
              required
              placeholder="Contoh: Dr. H. Hendra Wijaya, S.E., M.M."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-9 text-xs"
            />
          </div>

          {/* Jabatan Organisasi */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-300">
              Jabatan dalam LPM <span className="text-red-400">*</span>
            </Label>
            <Input
              required
              placeholder="Contoh: Kepala Lembaga Penjaminan Mutu Internal"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Divisi / Unit */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Divisi / Unit Kerja <span className="text-red-400">*</span>
              </Label>
              <Select
                value={form.division || DIVISIONS[0]}
                onValueChange={(val) => setForm({ ...form, division: val })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:ring-zinc-700 h-9 text-xs">
                  <SelectValue placeholder="Pilih Divisi" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div} value={div} className="text-xs focus:bg-zinc-800 focus:text-white">
                      {div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nomor Urut Tampil */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">
                Urutan Tampil (Prioritas)
              </Label>
              <Input
                type="number"
                min={1}
                max={99}
                value={form.order || 1}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700 h-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* NIP / NIDN */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">NIP / NIDN</Label>
              <Input
                placeholder="197508122003121002"
                value={form.nip}
                onChange={(e) => setForm({ ...form, nip: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-9 text-xs font-mono"
              />
            </div>

            {/* Email Resmi */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-300">Email Resmi</Label>
              <Input
                type="email"
                placeholder="nama@unpal.ac.id"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-9 text-xs"
              />
            </div>
          </div>

          {/* Foto Profil / URL */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold text-zinc-300">Foto Profil Personil</Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="https://... atau upload file"
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 h-9 text-xs"
                />
              </div>
              <label className="cursor-pointer shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={uploading}
                  className="h-9 px-3 text-xs bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200 gap-1.5"
                  asChild
                >
                  <span>
                    {uploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Upload Foto</span>
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-800 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 h-9 rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="text-xs font-extrabold h-9 px-4 rounded-xl shadow-md gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan' : 'Tambah Anggota'}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
