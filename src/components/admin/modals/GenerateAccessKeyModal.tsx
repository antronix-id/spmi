'use client';

import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Users, 
  FileText, 
  Link as LinkIcon,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { DocumentAccessKey } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface GenerateAccessKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: DocumentAccessKey) => Promise<boolean>;
}

export function GenerateAccessKeyModal({
  isOpen,
  onClose,
  onSave
}: GenerateAccessKeyModalProps) {
  const [label, setLabel] = useState('');
  const [code, setCode] = useState('');
  const [expiryOption, setExpiryOption] = useState<'1h' | '24h' | '7d' | '30d' | '1y' | 'never'>('7d');
  const [maxUsesOption, setMaxUsesOption] = useState<'unlimited' | 'custom'>('unlimited');
  const [customMaxUses, setCustomMaxUses] = useState('10');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success state after generation
  const [generatedKey, setGeneratedKey] = useState<DocumentAccessKey | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 6; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(`SPMI-${rand}`);
  };

  React.useEffect(() => {
    if (isOpen && !code && !generatedKey) {
      generateRandomCode();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setLabel('');
    setCode('');
    setExpiryOption('7d');
    setMaxUsesOption('unlimited');
    setCustomMaxUses('10');
    setNote('');
    setError(null);
    setGeneratedKey(null);
    setCopiedLink(false);
    setCopiedCode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Nama penerima / peruntukan akses wajib diisi.');
      return;
    }

    const finalCode = code.trim() || `SPMI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Calculate expiry date
    let expires_at: string | null = null;
    const now = Date.now();
    if (expiryOption === '1h') {
      expires_at = new Date(now + 60 * 60 * 1000).toISOString();
    } else if (expiryOption === '24h') {
      expires_at = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === '7d') {
      expires_at = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === '30d') {
      expires_at = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (expiryOption === '1y') {
      expires_at = new Date(now + 365 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      expires_at = null; // never
    }

    let max_uses: number | null = null;
    if (maxUsesOption === 'custom') {
      const parsed = parseInt(customMaxUses, 10);
      max_uses = isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    }

    const newKey: DocumentAccessKey = {
      id: `key_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      code: finalCode.toUpperCase(),
      label: label.trim(),
      created_at: new Date().toISOString(),
      expires_at,
      max_uses,
      used_count: 0,
      is_active: true,
      created_by: 'Administrator LPM',
      note: note.trim() || undefined
    };

    setSaving(true);
    setError(null);
    try {
      const ok = await onSave(newKey);
      if (ok) {
        setGeneratedKey(newKey);
      } else {
        setError('Gagal menyimpan kode akses.');
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSaving(false);
    }
  };

  const getFullDirectUrl = (accessCode: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/spmi/dokumen?access=${encodeURIComponent(accessCode)}`;
    }
    return `/spmi/dokumen?access=${encodeURIComponent(accessCode)}`;
  };

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white border-2 border-slate-900 rounded-3xl shadow-[6px_6px_0_0_#000000] w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-900 bg-yellow-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-yellow-400 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-tight">
                {generatedKey ? 'Kode Akses Berhasil Dibuat!' : 'Generate Kode & Link Akses Dokumen'}
              </h3>
              <p className="text-xs font-bold text-slate-800">
                Otorisasi Akses Repositori SPMI Publik
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleResetForm();
              onClose();
            }}
            className="p-1.5 rounded-lg border border-slate-900 bg-white hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {generatedKey ? (
            /* SUCCESS VIEW */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <Check className="w-5 h-5 bg-emerald-500 text-white rounded-full p-0.5" />
                  <span>Kode Akses Aktif & Siap Dibagikan</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  Berikan kode atau link langsung berikut kepada <strong>{generatedKey.label}</strong>.
                </p>
              </div>

              {/* Direct Link Copy Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-brand-600" />
                  <span>Tautan Akses Langsung (1-Click Auto Open)</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={getFullDirectUrl(generatedKey.code)}
                    className="font-mono text-xs bg-slate-50 border-2 border-slate-900 rounded-xl h-10 select-all"
                  />
                  <Button
                    type="button"
                    onClick={() => copyToClipboard(getFullDirectUrl(generatedKey.code), 'link')}
                    className="shrink-0 h-10 px-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-2 border-slate-900 font-bold text-xs gap-1.5 shadow-2xs"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
                  </Button>
                </div>
              </div>

              {/* Access Code Copy Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Kode Akses Manual (PIN)</span>
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={generatedKey.code}
                    className="font-mono font-black text-base text-center tracking-widest bg-yellow-50 text-slate-900 border-2 border-slate-900 rounded-xl h-12 select-all"
                  />
                  <Button
                    type="button"
                    onClick={() => copyToClipboard(generatedKey.code, 'code')}
                    className="shrink-0 h-12 px-4 bg-slate-900 hover:bg-slate-800 text-yellow-400 border-2 border-slate-900 font-bold text-xs gap-1.5 shadow-2xs"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                  </Button>
                </div>
              </div>

              {/* Summary Details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Penerima / Peruntukan:</span>
                  <span className="font-bold text-slate-900">{generatedKey.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Masa Berlaku:</span>
                  <span className="font-bold text-slate-900">
                    {generatedKey.expires_at ? new Date(generatedKey.expires_at).toLocaleString('id-ID') : 'Tanpa Batas (Permanen)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Batas Penggunaan:</span>
                  <span className="font-bold text-slate-900">
                    {generatedKey.max_uses ? `${generatedKey.max_uses} kali pakai` : 'Tak Terbatas (Multi-user)'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* FORM VIEW */
            <form id="generate-key-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Recipient / Label */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                  Nama Penerima / Peruntukan Akses <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: Asesor BAN-PT 2024 / Auditor Eksternal / Fakultas Kedokteran"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="border-2 border-slate-900 rounded-xl text-sm font-semibold h-10"
                  required
                />
              </div>

              {/* Access Code (Custom or Random) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                    Kode Akses (PIN/Token)
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-[11px] font-extrabold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Acak Kode Otomatis</span>
                  </button>
                </div>
                <Input
                  placeholder="Kosongkan untuk generate otomatis atau ketik contoh: SPMI-ASESOR-24"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="border-2 border-slate-900 rounded-xl font-mono text-sm font-bold uppercase h-10 tracking-wider"
                />
                <p className="text-[11px] text-slate-500">
                  Format akan otomatis dibuat uppercase agar mudah diingat dan diketik.
                </p>
              </div>

              {/* Expiry Duration */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                  Masa Berlaku Akses
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: '1h', label: '1 Jam' },
                    { id: '24h', label: '24 Jam' },
                    { id: '7d', label: '7 Hari' },
                    { id: '30d', label: '30 Hari' },
                    { id: '1y', label: '1 Tahun' },
                    { id: 'never', label: 'Permanen' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExpiryOption(item.id as any)}
                      className={`py-2 px-2.5 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                        expiryOption === item.id 
                          ? 'bg-yellow-400 border-slate-900 text-slate-900 shadow-2xs font-black' 
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Usage Limits */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                  Batas Jumlah Pemakaian
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setMaxUsesOption('unlimited')}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                      maxUsesOption === 'unlimited' 
                        ? 'bg-yellow-400 border-slate-900 text-slate-900 shadow-2xs font-black' 
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    Tak Terbatas (Multi-user)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaxUsesOption('custom')}
                    className={`py-2 px-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer ${
                      maxUsesOption === 'custom' 
                        ? 'bg-yellow-400 border-slate-900 text-slate-900 shadow-2xs font-black' 
                        : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    Batas Kuota Penggunaan
                  </button>
                </div>
                {maxUsesOption === 'custom' && (
                  <div className="pt-1">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Jumlah maksimal pemakaian (contoh: 5)"
                      value={customMaxUses}
                      onChange={(e) => setCustomMaxUses(e.target.value)}
                      className="border-2 border-slate-900 rounded-xl text-sm font-semibold h-9"
                    />
                  </div>
                )}
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                  Catatan Tambahan (Opsional)
                </label>
                <Textarea
                  placeholder="Keterangan keperluan audit, nomor surat tugas, dll."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-2 border-slate-900 rounded-xl text-xs resize-none"
                  rows={2}
                />
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t-2 border-slate-900 bg-slate-50">
          {generatedKey ? (
            <Button
              type="button"
              onClick={() => {
                handleResetForm();
                onClose();
              }}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-2 border-slate-900 font-extrabold text-xs shadow-2xs px-5"
            >
              Selesai & Tutup
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleResetForm();
                  onClose();
                }}
                className="border-2 border-slate-900 text-xs font-bold"
              >
                Batal
              </Button>
              <Button
                type="submit"
                form="generate-key-form"
                disabled={saving || !label.trim()}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-2 border-slate-900 font-extrabold text-xs shadow-2xs gap-1.5"
              >
                {saving ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Buat Kode Akses Sekarang</span>
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
