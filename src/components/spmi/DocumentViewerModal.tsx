'use client';

import React, { useState } from 'react';
import { SpmiDocument } from '@/lib/types';
import { 
  X, 
  Download, 
  FileText, 
  Calendar, 
  Tag, 
  CheckCircle,
  Eye
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentViewerModalProps {
  document: SpmiDocument | null;
  onClose: () => void;
}

export default function DocumentViewerModal({ document, onClose }: DocumentViewerModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!document) return null;

  const handleDownload = () => {
    setDownloading(true);
    if (document?.file_url && document.file_url !== '#') {
      window.open(document.file_url, '_blank');
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
      return;
    }
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }, 800);
  };

  return (
    <Dialog open={Boolean(document)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="max-w-3xl p-0 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <Badge variant="brand" className="text-[10px] uppercase font-bold">
                {document.category}
              </Badge>
              <DialogTitle className="text-base font-bold text-slate-900 line-clamp-1 mt-1">
                {document.title}
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Modal Body & Document Simulation Preview */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[65vh]">
          
          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Nomor / Kode
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1 truncate">
                {document.document_code || '-'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Tahun Terbit
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                {document.year}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Ukuran Berkas
              </div>
              <div className="text-xs font-bold text-slate-800 mt-1">
                {document.file_size || '2.4 MB'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                Status
              </div>
              <div className="text-xs font-bold text-emerald-700 mt-1">
                Berlaku Resmi
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Deskripsi Dokumen
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              {document.description}
            </p>
          </div>

          {/* PDF Preview Simulated Container */}
          <div className="border border-slate-200 rounded-xl bg-slate-800 p-8 text-center text-white relative shadow-inner">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center border border-white/20">
                <FileText className="w-8 h-8 text-sky-400" />
              </div>
              <div>
                <h5 className="font-bold text-base text-white">
                  Pratinjau Dokumen SPMI
                </h5>
                <p className="text-xs text-slate-300 mt-1">
                  Format PDF resmi berstempel dan ditandatangani Badan Penjaminan Mutu Universitas Palembang.
                </p>
              </div>
              <Badge variant="outline" className="border-white/20 text-sky-300 font-mono text-xs max-w-full truncate">
                {document.document_code ? `${document.document_code}.pdf` : `${document.title}.pdf`}
              </Badge>
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Dokumen mutu berhasil diunduh ke perangkat Anda.</span>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Terakhir dimutakhirkan: {document.updated_at}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Tutup
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-2"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Mengunduh...' : 'Unduh Berkas PDF'}</span>
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
