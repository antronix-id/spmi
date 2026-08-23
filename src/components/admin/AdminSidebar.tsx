'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  FileText, 
  Award, 
  Activity, 
  Scale, 
  MessageSquare, 
  LayoutTemplate,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { AdminUser } from '@/lib/types';

export type AdminTab = 'overview' | 'documents' | 'accreditations' | 'monitoring' | 'regulations' | 'messages' | 'content' | 'users';

interface AdminSidebarProps {
  activeTab?: AdminTab;
  setActiveTab?: (tab: AdminTab) => void;
  counts?: {
    documents?: number;
    accreditations?: number;
    monitoring?: number;
    regulations?: number;
    messages?: number;
    content?: number;
  };
  onLogout?: () => void;
}

export function AdminSidebar({
  activeTab
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const menuItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Ringkasan Eksekutif',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      id: 'documents' as AdminTab,
      label: 'Dokumen SPMI',
      icon: FileText,
      href: '/admin/dokumen',
    },
    {
      id: 'accreditations' as AdminTab,
      label: 'Akreditasi BAN/LAM',
      icon: Award,
      href: '/admin/akreditasi',
    },
    {
      id: 'monitoring' as AdminTab,
      label: 'Pemantauan Mutu (AMI)',
      icon: Activity,
      href: '/admin/pemantauan',
    },
    {
      id: 'regulations' as AdminTab,
      label: 'Peraturan & Regulasi',
      icon: Scale,
      href: '/admin/peraturan',
    },
    {
      id: 'messages' as AdminTab,
      label: 'Kotak Masuk Publik',
      icon: MessageSquare,
      href: '/admin/pesan',
    },
    {
      id: 'content' as AdminTab,
      label: 'Konten Publik',
      icon: LayoutTemplate,
      href: '/admin/konten',
    },
    {
      id: 'users' as AdminTab,
      label: 'Manajemen Pengguna',
      icon: ShieldCheck,
      href: '/admin/users',
    },
  ];

  // Filter menu items by user permissions
  const allowedMenuItems = menuItems.filter((item) => {
    if (!currentUser) return true;
    if (currentUser.role === 'superadmin') return true;
    // Check permission
    if (currentUser.permissions && currentUser.permissions[item.id]) {
      return currentUser.permissions[item.id].view;
    }
    // Default fallback: only users tab hidden if not superadmin
    if (item.id === 'users') return false;
    return true;
  });

  return (
    <aside className="w-64 h-screen border-r-2 border-slate-900 bg-white flex flex-col justify-between shrink-0 select-none z-30 shadow-[4px_0_0_0_#000000]">
      
      {/* Top Section */}
      <div className="flex flex-col min-h-0 overflow-y-auto">
        
        {/* Brand Header */}
        <div className="px-5 py-4 border-b-2 border-slate-900 bg-white sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
              <Image 
                src="/unpal.avif" 
                alt="Logo UNPAL" 
                width={28} 
                height={28} 
                className="object-contain" 
                priority 
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-black text-sm text-slate-900 tracking-tight leading-none truncate">
                SPMI
              </h1>
              <p className="text-[10px] text-slate-600 mt-1 truncate font-bold">Universitas Palembang</p>
            </div>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <div className="p-3">
          <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Navigasi Utama
          </div>
          <nav className="space-y-1.5">
            {allowedMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === '/admin/dashboard' && pathname === '/admin') || (activeTab === item.id);
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full relative flex items-center justify-between h-10 px-3 rounded-xl text-xs transition-all duration-100 group cursor-pointer select-none ${
                    isActive
                      ? 'bg-yellow-400 !text-black font-black border-2 border-slate-900 shadow-[3px_3px_0_0_#000000] active:translate-y-0.5'
                      : 'text-slate-700 hover:text-black hover:bg-yellow-50 border-2 border-transparent hover:border-slate-900 active:translate-y-0.5 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pl-1">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? '!text-black font-bold' : 'text-slate-600 group-hover:text-black'}`} />
                    <span className={`truncate ${isActive ? '!text-black font-black' : 'text-slate-700 group-hover:text-black font-bold'}`}>
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 transition-all ${isActive ? 'opacity-100 !text-black font-bold translate-x-0.5' : 'opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 text-slate-600'}`} />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

    </aside>
  );
}
