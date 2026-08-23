'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { 
  Accreditation, 
  SpmiDocument, 
  MonitoringData, 
  Regulation, 
  ContactMessage,
  AdminUser,
  OrganizationMember
} from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminOverviewTab } from '@/components/admin/AdminOverviewTab';
import { AdminTab } from '@/components/admin/AdminSidebar';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Main Data States
  const [documents, setDocuments] = useState<SpmiDocument[]>([]);
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [monitoring, setMonitoring] = useState<MonitoringData[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [docs, accreds, mon, regs, msgs, userList, memberList] = await Promise.all([
        dataService.getDocuments(),
        dataService.getAccreditations(),
        dataService.getMonitoringData(),
        dataService.getRegulations(),
        dataService.getMessages(),
        dataService.getUsers(),
        dataService.getOrgMembers()
      ]);
      setDocuments(docs);
      setAccreditations(accreds);
      setMonitoring(mon);
      setRegulations(regs);
      setMessages(msgs);
      setUsers(userList);
      setMembers(memberList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Gagal memuat data ringkasan admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleNavigateTab = (tab: AdminTab) => {
    switch (tab) {
      case 'documents':
        router.push('/admin/dokumen');
        break;
      case 'accreditations':
        router.push('/admin/akreditasi');
        break;
      case 'monitoring':
        router.push('/admin/pemantauan');
        break;
      case 'regulations':
        router.push('/admin/peraturan');
        break;
      case 'messages':
        router.push('/admin/pesan');
        break;
      case 'content':
        router.push('/admin/konten');
        break;
      case 'users':
        router.push('/admin/users');
        break;
      default:
        router.push('/admin/dashboard');
        break;
    }
  };

  return (
    <AdminLayout activeTab="overview" toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Ringkasan Eksekutif SPMI...</p>
        </div>
      ) : (
        <AdminOverviewTab
          documents={documents}
          accreditations={accreditations}
          monitoring={monitoring}
          regulations={regulations}
          messages={messages}
          usersCount={users.length}
          membersCount={members.length}
          setActiveTab={handleNavigateTab}
          onOpenAddDoc={() => router.push('/admin/dokumen?add=true')}
          onOpenAddAccred={() => router.push('/admin/akreditasi?add=true')}
          onOpenAddMon={() => router.push('/admin/pemantauan?add=true')}
          onOpenAddReg={() => router.push('/admin/peraturan?add=true')}
        />
      )}
    </AdminLayout>
  );
}
