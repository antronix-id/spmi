'use client';

import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  ExternalLink, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { AdminTab } from './AdminSidebar';
import { dataService } from '@/lib/supabase';
import { AdminUser } from '@/lib/types';

interface AdminHeaderProps {
  activeTab: AdminTab;
  itemCount: number;
  onLogout: () => void;
}

export function AdminHeader({
  activeTab,
  onLogout
}: AdminHeaderProps) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const getTabDetails = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Ringkasan Eksekutif & Status Mutu',
          description: 'Dashboard analitik PPEPP, distribusi akreditasi, dan performa penjaminan mutu',
        };
      case 'documents':
        return {
          title: 'Manajemen Dokumen SPMI',
          description: 'Kelola buku kebijakan, manual mutu, 10 standar SPMI, SOP, dan laporan AMI',
        };
      case 'accreditations':
        return {
          title: 'Manajemen Akreditasi Institusi & Prodi',
          description: 'Peringkat akreditasi BAN-PT, LAMEMBA, LAMDIK, dan LAM-TEKNIK beserta masa berlaku',
        };
      case 'monitoring':
        return {
          title: 'Evaluasi & Pemantauan Mutu (AMI)',
          description: 'Hasil audit mutu internal, skor target vs capaian realisasi 10 standar SPMI',
        };
      case 'regulations':
        return {
          title: 'Direktori Peraturan & Regulasi',
          description: 'Kumpulan payung hukum Undang-Undang, Permendikbudristek, dan SK Rektor UNPAL',
        };
      case 'messages':
        return {
          title: 'Kotak Masuk & Aspirasi Pengunjung',
          description: 'Daftar masukan, pertanyaan, dan konsultasi dari mahasiswa, dosen, serta publik',
        };
      case 'content':
        return {
          title: 'Manajemen Konten Halaman Publik',
          description: 'Kelola isi teks halaman Tentang Kami, Beranda, Kontak, Struktur Organisasi & Informasi Mutu',
        };
      case 'users':
        return {
          title: 'Manajemen Pengguna & Hak Akses',
          description: 'Kelola akun staf administrator, auditor internal, dan pengaturan hak akses role-based',
        };
    }
  };

  const { title, description } = getTabDetails();

  return (
    <header className="shrink-0 px-6 py-3.5 border-b-2 border-slate-900 bg-white/85 backdrop-blur-md z-20 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
      
      {/* Title & Description Area */}
      <div className="min-w-0">
        <h2 className="text-base font-black text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5 truncate leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Admin Profile Menu on the right */}
      <div className="flex items-center gap-2.5 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-slate-900 bg-white text-slate-900 hover:bg-yellow-100 text-xs font-black gap-2 h-8 px-3 rounded-lg shadow-2xs cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-slate-900 text-[10px] flex items-center justify-center font-black">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="truncate max-w-[140px] font-bold">{currentUser?.name?.split(',')[0] || 'Admin SPMI'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 space-y-1">
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="font-extrabold text-xs text-slate-900 truncate">{currentUser?.name || 'Administrator'}</div>
              <div className="text-[11px] text-slate-600 font-mono truncate font-medium">{currentUser?.email || 'admin@unpal.ac.id'}</div>
              <div className="mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-400 text-black border border-slate-900 font-bold shadow-2xs">
                  {currentUser?.role_label || 'Super Admin'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem asChild className="rounded-lg">
              <a href="/" target="_blank" className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 hover:text-black">
                <ExternalLink className="w-3.5 h-3.5 text-slate-700" />
                <span>Lihat Website Publik</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg">
              <a href="/admin/users" className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 hover:text-black">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Kelola Akun Pengguna</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem 
              onClick={onLogout}
              variant="destructive"
              className="cursor-pointer font-bold rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              <span>Keluar (Logout)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
