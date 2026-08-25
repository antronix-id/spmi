'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { initialDocuments } from '@/lib/mock-data';
import { dataService } from '@/lib/supabase';
import { SpmiDocument, DocumentAccessKey } from '@/lib/types';
import DocumentViewerModal from '@/components/spmi/DocumentViewerModal';
import DocumentAccessGate from '@/components/spmi/DocumentAccessGate';
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  LogOut,
  Clock, 
  Sparkles,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SESSION_STORAGE_KEY = 'spmi_document_access_session';

interface AccessSessionData {
  code: string;
  label: string;
  expires_at: string | null;
  verified_at: string;
}

function DokumenSpmiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [documents, setDocuments] = useState<SpmiDocument[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedAspect, setSelectedAspect] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [activeModalDoc, setActiveModalDoc] = useState<SpmiDocument | null>(null);

  // Authentication & Protection State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<AccessSessionData | null>(null);

  // Check stored session or URL search param on initial mount
  useEffect(() => {
    async function checkInitialAccess() {
      setIsCheckingAuth(true);
      setAuthError(null);

      // 1. Check URL query params for ?access=... or ?token=... or ?code=...
      const urlCode = searchParams.get('access') || searchParams.get('token') || searchParams.get('code');
      if (urlCode) {
        const result = await dataService.validateDocumentAccess(urlCode);
        if (result.valid && result.key) {
          const sessionData: AccessSessionData = {
            code: result.key.code,
            label: result.key.label,
            expires_at: result.key.expires_at,
            verified_at: new Date().toISOString(),
          };
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
          }
          setActiveSession(sessionData);
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
          return;
        } else {
          setAuthError(result.message || 'Tautan akses tidak valid atau telah kedaluwarsa.');
        }
      }

      // 2. Check SessionStorage
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (stored) {
          try {
            const parsed: AccessSessionData = JSON.parse(stored);
            if (parsed.expires_at) {
              const expTime = new Date(parsed.expires_at).getTime();
              if (Date.now() > expTime) {
                sessionStorage.removeItem(SESSION_STORAGE_KEY);
                setAuthError('Masa berlaku akses Anda telah berakhir. Silakan masukkan kode akses baru.');
                setIsAuthenticated(false);
                setIsCheckingAuth(false);
                return;
              }
            }
            setActiveSession(parsed);
            setIsAuthenticated(true);
            setIsCheckingAuth(false);
            return;
          } catch {
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      }

      setIsAuthenticated(false);
      setIsCheckingAuth(false);
    }

    checkInitialAccess();
  }, [searchParams]);

  // Load documents when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      async function loadDocs() {
        try {
          const docs = await dataService.getDocuments();
          setDocuments(docs);
        } catch (e) {
          console.error('Failed to load documents', e);
        }
      }
      loadDocs();
    }
  }, [isAuthenticated]);

  // Handle manual code verification from Lock Screen
  const handleVerifyCode = async (code: string): Promise<boolean> => {
    setAuthError(null);
    const result = await dataService.validateDocumentAccess(code);
    if (result.valid && result.key) {
      const sessionData: AccessSessionData = {
        code: result.key.code,
        label: result.key.label,
        expires_at: result.key.expires_at,
        verified_at: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      }
      setActiveSession(sessionData);
      setIsAuthenticated(true);
      return true;
    } else {
      setAuthError(result.message || 'Kode akses tidak valid.');
      return false;
    }
  };

  // Lock / Logout from Document View
  const handleLockAccess = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setActiveSession(null);
    setIsAuthenticated(false);
    setAuthError(null);
    // Remove query params from url cleanly
    router.replace('/spmi/dokumen');
  };

  const categories = [
    'Semua',
    'Kebijakan SPMI',
    'Manual Mutu',
    'Standar SPMI',
    'Formulir Mutu',
    'Laporan AMI',
    'Dokumen RTM',
  ];

  const aspects = [
    'Semua',
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

  const years = ['Semua', '2024', '2023', '2022'];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.document_code && doc.document_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'Semua' || doc.category === selectedCategory;

      const matchesAspect =
        selectedAspect === 'Semua'
          ? true
          : selectedAspect === 'Non-Aspek'
          ? !doc.standard_aspect || doc.standard_aspect.trim() === ''
          : doc.standard_aspect === selectedAspect;

      const matchesYear =
        selectedYear === 'Semua' || doc.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesAspect && matchesYear;
    });
  }, [documents, searchTerm, selectedCategory, selectedAspect, selectedYear]);

  // Loading screen during initial token check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <p className="text-xs font-mono font-bold text-slate-600">Memeriksa Hak Akses Dokumen SPMI...</p>
      </div>
    );
  }

  // If not authenticated, render Access Gate
  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 bg-slate-50/50 min-h-screen">
        <DocumentAccessGate
          onVerify={handleVerifyCode}
          errorMsg={authError}
        />
      </div>
    );
  }

  // If authenticated, render Document Catalog with Access Banner
  return (
    <div className="pt-24 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Verified Access Active Banner */}
        <div className="bg-emerald-50 border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0_0_#000000] flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white border-2 border-slate-900 shadow-2xs flex items-center justify-center shrink-0 font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                  Akses Terverifikasi:
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  {activeSession?.label || 'Akses Resmi Dokumen SPMI'}
                </span>
                <Badge variant="outline" className="bg-white border-slate-900 font-mono text-[10px] font-bold">
                  {activeSession?.code}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {activeSession?.expires_at ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Masa berlaku hingga: <strong>{new Date(activeSession.expires_at).toLocaleString('id-ID')}</strong></span>
                  </span>
                ) : (
                  <span>Masa berlaku: <strong>Permanen / Tanpa Batas</strong></span>
                )}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLockAccess}
            className="border-2 border-slate-900 bg-white hover:bg-red-50 hover:text-red-700 font-bold text-xs gap-1.5 h-9 rounded-xl shadow-2xs shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci Akses / Keluar</span>
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Arsip & Dokumen <span className="gradient-text">SPMI UNPAL</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Akses dan unduh buku kebijakan SPMI, manual mutu, standar pendidikan tinggi, formulir instrumen AMI, serta laporan audit mutu internal resmi Universitas Palembang.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-5 shadow-soft space-y-4 border-2 border-slate-900 shadow-[4px_4px_0_0_#000000] rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Cari judul dokumen atau kode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-slate-900 text-sm text-slate-700 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'Semua' ? 'Semua Kategori Dokumen' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Aspect Dropdown */}
            <div>
              <select
                value={selectedAspect}
                onChange={(e) => setSelectedAspect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-slate-900 text-sm text-slate-700 bg-white"
              >
                {aspects.map((asp) => (
                  <option key={asp} value={asp}>
                    {asp === 'Semua' ? 'Semua Aspek Standar' : asp === 'Non-Aspek' ? 'Non-Aspek / Dokumen Umum' : `Aspek ${asp}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Dropdown */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-slate-900 text-sm text-slate-700 bg-white"
              >
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr === 'Semua' ? 'Semua Tahun' : `Tahun ${yr}`}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-bold mr-1">Kategori Cepat:</span>
              {categories.slice(1, 6).map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? 'Semua' : cat)}
                  className={`text-xs h-7 px-2.5 rounded-lg ${selectedCategory === cat ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-extrabold border border-slate-900' : ''}`}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="text-slate-600 font-medium">
              Ditemukan <strong>{filteredDocs.length}</strong> dokumen
            </div>
          </div>
        </Card>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="p-6 border-2 border-slate-900 shadow-[4px_4px_0_0_#000000] hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 flex flex-col justify-between group space-y-4 rounded-2xl bg-white"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-400 text-slate-900 border border-slate-900 text-[10px] uppercase font-black">
                    {doc.category}
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    {doc.year}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono font-medium pt-1">
                  {doc.document_code && (
                    <>
                      <span>{doc.document_code}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{doc.file_size || '2.5 MB'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                {doc.file_url && doc.file_url !== '#' ? (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full gap-1.5 text-xs h-9 font-bold border border-slate-300 hover:border-slate-900 hover:bg-yellow-50"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Pratinjau</span>
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveModalDoc(doc)}
                    className="flex-1 gap-1.5 text-xs h-9 font-bold border border-slate-300 hover:border-slate-900 hover:bg-yellow-50"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Pratinjau</span>
                  </Button>
                )}

                {doc.file_url && doc.file_url !== '#' ? (
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs h-9 font-bold bg-yellow-400 text-slate-900 border border-slate-900 hover:bg-yellow-300"
                      title="Unduh Dokumen PDF"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh</span>
                    </Button>
                  </a>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setActiveModalDoc(doc)}
                    className="gap-1.5 text-xs h-9 font-bold bg-yellow-400 text-slate-900 border border-slate-900 hover:bg-yellow-300"
                    title="Unduh Dokumen"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh</span>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <Card className="p-12 text-center space-y-3 border-2 border-dashed border-slate-300 rounded-2xl">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">Dokumen tidak ditemukan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Silakan coba kata kunci lain atau bersihkan filter pencarian.
            </p>
          </Card>
        )}

      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        document={activeModalDoc}
        onClose={() => setActiveModalDoc(null)}
      />
    </div>
  );
}

export default function DokumenSpmiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        <p className="text-xs font-mono font-bold text-slate-600">Memuat Dokumen SPMI...</p>
      </div>
    }>
      <DokumenSpmiContent />
    </Suspense>
  );
}
