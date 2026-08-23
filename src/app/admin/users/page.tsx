'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { AdminUser } from '@/lib/types';
import { initialAdminUsers } from '@/lib/mock-data';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UsersTab } from '@/components/admin/UsersTab';

function UsersPageContent() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load admin users', err);
      showToast('Gagal memuat daftar pengguna', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <AdminLayout activeTab="users" itemCount={users.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Data Pengguna & Hak Akses...</p>
        </div>
      ) : (
        <UsersTab
          initialUsers={users}
          onShowToast={showToast}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <UsersPageContent />
    </Suspense>
  );
}
