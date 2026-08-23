'use client';

import React, { useState } from 'react';
import { 
  KeyRound, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Power, 
  PowerOff, 
  Clock, 
  Users, 
  Search, 
  ShieldCheck, 
  Link as LinkIcon, 
  AlertTriangle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { DocumentAccessKey, AdminUser } from '@/lib/types';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface DocumentAccessTabProps {
  accessKeys: DocumentAccessKey[];
  onOpenGenerate: () => void;
  onToggleStatus: (id: string, is_active: boolean) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  currentUser: AdminUser | null;
}

export function DocumentAccessTab({
  accessKeys,
  onOpenGenerate,
  onToggleStatus,
  onDelete,
  onRefresh,
  currentUser
}: DocumentAccessTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const getFullDirectUrl = (accessCode: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/spmi/dokumen?access=${encodeURIComponent(accessCode)}`;
    }
    return `/spmi/dokumen?access=${encodeURIComponent(accessCode)}`;
  };

  const handleCopyLink = (key: DocumentAccessKey) => {
    const url = getFullDirectUrl(key.code);
    navigator.clipboard.writeText(url);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCode = (key: DocumentAccessKey) => {
    navigator.clipboard.writeText(key.code);
    setCopiedCodeId(key.id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const isExpired = (key: DocumentAccessKey) => {
    if (!key.expires_at) return false;
    return Date.now() > new Date(key.expires_at).getTime();
  };

  const isLimitReached = (key: DocumentAccessKey) => {
    if (!key.max_uses) return false;
    return key.used_count >= key.max_uses;
  };

  const filteredKeys = accessKeys.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      item.label.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Banner / Info Card */}
      <div className="bg-amber-50 border-2 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0_0_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-2xs font-bold text-slate-950 mt-0.5">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">
              Otorisasi Akses Dokumen SPMI
            </h4>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              Halaman publik Dokumen SPMI terkunci secara otomatis. Buat dan bagikan link atau kode akses di bawah ini kepada pihak yang berkepentingan (Asesor, Auditor, Fakultas, dll).
            </p>
          </div>
        </div>

        <Button
          onClick={onOpenGenerate}
          className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-2 border-slate-900 font-black text-xs h-9 px-4 gap-2 shadow-[2px_2px_0_0_#000000] active:translate-y-0.5 active:shadow-none shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kode / Link Akses Baru</span>
        </Button>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <Input
            placeholder="Cari penerima atau kode akses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 h-8 text-xs bg-slate-50 border-2 border-slate-900 rounded-lg shadow-2xs font-semibold focus-visible:ring-0 focus-visible:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 border-2 border-slate-900 font-bold text-xs gap-1.5 hover:bg-slate-100"
            title="Muat ulang data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </Button>

          <span className="text-xs font-bold text-slate-600 ml-2">
            Total: <strong>{filteredKeys.length}</strong> Kunci Akses
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-yellow-400/30 border-b-2 border-slate-900">
              <TableRow className="border-b-2 border-slate-900 hover:bg-transparent">
                <TableHead className="w-12 text-center text-xs font-black text-slate-900 uppercase">No</TableHead>
                <TableHead className="text-xs font-black text-slate-900 uppercase min-w-[200px]">Penerima & Catatan</TableHead>
                <TableHead className="text-xs font-black text-slate-900 uppercase min-w-[170px]">Kode Akses (PIN)</TableHead>
                <TableHead className="text-xs font-black text-slate-900 uppercase min-w-[150px]">Status Akses</TableHead>
                <TableHead className="text-xs font-black text-slate-900 uppercase min-w-[140px]">Masa Berlaku</TableHead>
                <TableHead className="text-xs font-black text-slate-900 uppercase min-w-[110px] text-center">Pemakaian</TableHead>
                <TableHead className="text-right text-xs font-black text-slate-900 uppercase pr-6 min-w-[160px]">Aksi & Bagikan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-2 divide-slate-100">
              {filteredKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-44 text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <KeyRound className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-extrabold text-slate-900">Belum ada kode akses dibuat</p>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Klik tombol "+ Buat Kode / Link Akses Baru" untuk mengizinkan pihak lain membuka arsip Dokumen SPMI.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredKeys.map((item, index) => {
                  const expired = isExpired(item);
                  const limitOut = isLimitReached(item);
                  const active = item.is_active && !expired && !limitOut;

                  return (
                    <TableRow 
                      key={item.id}
                      className="hover:bg-yellow-50/50 transition-colors font-sans"
                    >
                      {/* No */}
                      <TableCell className="text-center font-black text-xs text-slate-500">
                        {index + 1}
                      </TableCell>

                      {/* Recipient & Note */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {item.label}
                          </p>
                          {item.note && (
                            <p className="text-[11px] text-slate-500 italic line-clamp-1">
                              {item.note}
                            </p>
                          )}
                          <p className="text-[10px] font-mono text-slate-400">
                            Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </TableCell>

                      {/* Code Box */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-black text-xs px-2 py-1 rounded-md bg-yellow-100 border border-slate-900 text-slate-900 select-all">
                            {item.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item)}
                            title="Salin Kode Akses"
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          >
                            {copiedCodeId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {!item.is_active ? (
                          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-400 font-bold text-[10px]">
                            Dinonaktifkan
                          </Badge>
                        ) : expired ? (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-400 font-bold text-[10px]">
                            Kedaluwarsa
                          </Badge>
                        ) : limitOut ? (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-400 font-bold text-[10px]">
                            Kuota Habis
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-500 font-extrabold text-[10px]">
                            ● Aktif
                          </Badge>
                        )}
                      </TableCell>

                      {/* Expiry */}
                      <TableCell>
                        <div className="text-xs font-semibold text-slate-700">
                          {item.expires_at ? (
                            <span className={expired ? 'text-red-600 font-bold' : ''}>
                              {new Date(item.expires_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold">Permanen (Tanpa Batas)</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Usage */}
                      <TableCell className="text-center">
                        <div className="text-xs font-mono font-bold text-slate-800">
                          {item.used_count} <span className="text-slate-400 font-normal">/ {item.max_uses ? `${item.max_uses}x` : '∞'}</span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Copy Direct Link */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyLink(item)}
                            className="h-7 px-2.5 text-[11px] font-bold border-slate-900 hover:bg-yellow-100 gap-1"
                            title="Salin Link Akses Langsung (1-Click Auto Open)"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <LinkIcon className="w-3 h-3 text-slate-700" />
                                <span>Salin Link</span>
                              </>
                            )}
                          </Button>

                          {/* Toggle Active / Inactive */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onToggleStatus(item.id, !item.is_active)}
                            className={`h-7 w-7 p-0 rounded-lg border ${
                              item.is_active 
                                ? 'border-amber-400 text-amber-700 hover:bg-amber-100' 
                                : 'border-emerald-500 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title={item.is_active ? 'Nonaktifkan Akses' : 'Aktifkan Kembali'}
                          >
                            {item.is_active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                          </Button>

                          {/* Delete */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(item.id)}
                            className="h-7 w-7 p-0 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                            title="Hapus Kunci Akses"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}
