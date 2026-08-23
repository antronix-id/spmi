'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentAccessGateProps {
  onVerify: (code: string) => Promise<boolean>;
  errorMsg?: string | null;
  loading?: boolean;
}

export default function DocumentAccessGate({
  onVerify,
  errorMsg,
  loading = false
}: DocumentAccessGateProps) {
  const [inputCode, setInputCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setLocalError('Silakan masukkan kode akses terlebih dahulu.');
      return;
    }
    setLocalError(null);
    setSubmitting(true);
    try {
      await onVerify(inputCode.trim());
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = errorMsg || localError;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Main Card */}
        <Card className="p-6 sm:p-8 border-2 border-slate-900 shadow-[6px_6px_0_0_#000000] rounded-3xl bg-white relative overflow-hidden">
          {/* Top Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
          
          <div className="text-center space-y-4 pt-2">
            {/* Lock Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-400 border-2 border-slate-900 shadow-[3px_3px_0_0_#000000] text-slate-950 mx-auto relative">
              <Lock className="w-10 h-10" />
              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-yellow-400 p-1.5 rounded-lg border border-slate-900">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="bg-yellow-100 text-slate-900 border-slate-900 font-extrabold text-xs px-3 py-1">
                Akses Terbatas & Terproteksi
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Arsip & Dokumen SPMI
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
                Halaman repositori dokumen mutu internal ini bersifat terbatas. Masukkan <strong>Kode Akses</strong> atau gunakan <strong>Tautan Khusus</strong> yang telah diberikan oleh Administrator LPM UNPAL.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-slate-700 tracking-wider">
                Kode Akses / PIN Dokumen
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Contoh: SPMI-UNPAL-2024"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value.toUpperCase());
                    if (localError) setLocalError(null);
                  }}
                  className="pl-11 pr-4 py-3 text-base sm:text-lg font-mono font-bold tracking-wider uppercase border-2 border-slate-900 rounded-xl focus-visible:ring-0 focus-visible:border-yellow-500 shadow-2xs h-12 bg-slate-50 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            {displayError && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl text-xs font-bold animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{displayError}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || submitting || !inputCode.trim()}
              className="w-full h-12 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm sm:text-base border-2 border-slate-900 shadow-[3px_3px_0_0_#000000] active:translate-y-0.5 active:shadow-none transition-all rounded-xl gap-2 cursor-pointer"
            >
              {loading || submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </div>
              ) : (
                <>
                  <span>Buka Dokumen SPMI</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
}
