'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { dataService } from '@/lib/supabase';
import { AdminUser } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  itemCount?: number;
  toast?: { message: string; type?: 'success' | 'error' } | null;
}

export function AdminLayout({
  children,
  activeTab,
  itemCount = 0,
  toast = null
}: AdminLayoutProps) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('spmi_admin_auth');
      if (!auth) {
        router.push('/admin/login');
        return;
      }
      const user = dataService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      setAuthChecked(true);
    }
  }, [router]);

  const handleLogout = () => {
    dataService.logoutUser();
    router.push('/admin/login');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
        <span className="text-xs font-mono font-bold">Memverifikasi Sesi Administrator...</span>
      </div>
    );
  }

  // Check if current user has permission to view this active tab
  const hasViewPermission = () => {
    if (!currentUser) return true;
    if (currentUser.role === 'superadmin') return true;
    if (activeTab === 'overview') return true; // Everyone can see dashboard overview
    if (currentUser.permissions && currentUser.permissions[activeTab]) {
      return currentUser.permissions[activeTab].view;
    }
    // Fallback: only users tab hidden if not superadmin
    if (activeTab === 'users') return false;
    return true;
  };

  const isAllowed = hasViewPermission();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900 font-sans antialiased">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000] text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200 ${
          toast.type === 'error'
            ? 'bg-red-50 text-red-900'
            : 'bg-yellow-400 text-black'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden bg-white relative">
        {/* Soft Yellow Glow for Admin (identical to public) */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, #FFF991 0%, transparent 70%)
            `,
            opacity: 0.6,
            mixBlendMode: "multiply",
          }}
        />
        
        {/* Top Header */}
        <div className="relative z-10">
          <AdminHeader
            activeTab={activeTab}
            itemCount={itemCount}
            onLogout={handleLogout}
          />
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative z-10">
          {isAllowed ? (
            children
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center">
              <div className="max-w-md w-full p-8 rounded-2xl bg-white border-2 border-slate-900 text-center space-y-4 shadow-[6px_6px_0_0_#000000]">
                <div className="w-12 h-12 rounded-2xl bg-red-100 border-2 border-slate-900 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-base font-black text-slate-900">Akses Dibatasi (403)</h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Akun Anda ({currentUser?.role_label}) tidak diberikan izin oleh Super Admin untuk mengakses modul ini.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push('/admin/dashboard')}
                  className="bg-yellow-400 text-black border-2 border-slate-900 hover:bg-yellow-300 text-xs font-black gap-2 h-9 px-4 rounded-xl cursor-pointer shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Dashboard</span>
                </Button>
              </div>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
