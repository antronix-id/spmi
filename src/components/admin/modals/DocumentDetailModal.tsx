'use client';

import React from 'react';
import { 
  FileText, 
  Tag, 
  Calendar, 
  Layers, 
  ExternalLink, 
  Eye, 
  Info,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { SpmiDocument } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentDetailModalProps {
  document: SpmiDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentDetailModal({
  document,
  isOpen,
  onClose
}: DocumentDetailModalProps) {
  if (!document) return null;

  const handleOpenFile = () => {
    if (document.file_url && document.file_url !== '#') {
      window.open(document.file_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100 p-6 sm:rounded-2xl shadow-2xl">
        
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-zinc-800">
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4.5 h-4.5 text-blue-400" />
              <span>Detail Dokumen SPMI</span>
            </DialogTitle>
            <Badge variant="outline" className="text-[10px] bg-zinc-900 border-zinc-700 text-zinc-300 font-mono">
              {document.document_code}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Informasi lengkap dokumen mutu dan arsip penjaminan mutu.
          </DialogDescription>
        </DialogHeader>

        {/* Content Body */}
        <div className="space-y-4 pt-2 text-xs">
          
          {/* Judul Dokumen */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Nama / Judul Dokumen</span>
            </div>
            <div className="text-sm font-bold text-white leading-snug">
              {document.title}
            </div>
          </div>

          {/* Grid Metadata 2x2 */}
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Kategori Dokumen */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
              <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-zinc-400" />
                <span>Kategori Dokumen</span>
              </div>
              <div className="text-xs font-bold text-zinc-100">
                {document.category}
              </div>
            </div>

            {/* Aspek Standar SPMI */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
              <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-zinc-400" />
                <span>Aspek Standar SPMI</span>
              </div>
              <div className="text-xs font-bold text-zinc-100">
                {document.standard_aspect ? `Aspek ${document.standard_aspect}` : 'Non-Aspek / Umum'}
              </div>
            </div>

            {/* Kode Dokumen */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
              <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-zinc-400" />
                <span>Kode Dokumen</span>
              </div>
              <div className="text-xs font-mono font-bold text-zinc-100 truncate">
                {document.document_code}
              </div>
            </div>

            {/* Tahun Penetapan */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-1">
              <div className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>Tahun Penetapan</span>
              </div>
              <div className="text-xs font-bold text-zinc-100 font-mono">
                Tahun {document.year}
              </div>
            </div>

          </div>

          {/* Deskripsi Dokumen */}
          <div className="space-y-1.5">
            <div className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
              Deskripsi Dokumen:
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-zinc-200 text-xs leading-relaxed min-h-[60px]">
              {document.description || 'Tidak ada deskripsi tambahan untuk dokumen ini.'}
            </div>
          </div>

          {/* Status Berkas */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status Berkas: <strong className="text-zinc-200">Tersedia di Server</strong></span>
            </div>
            <span className="font-mono text-zinc-400">{document.file_size || 'PDF'}</span>
          </div>

        </div>

        {/* Footer */}
        <DialogFooter className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs h-8 px-3.5 rounded-lg"
          >
            Tutup
          </Button>

          {document.file_url && document.file_url !== '#' ? (
            <Button
              type="button"
              size="sm"
              onClick={handleOpenFile}
              className="font-extrabold text-xs gap-1.5 h-8 px-4 rounded-xl shadow-md cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat File</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled
              className="bg-zinc-800 text-zinc-500 font-medium text-xs gap-1.5 h-8 px-3 rounded-lg"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Berkas Belum Diunggah</span>
            </Button>
          )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
