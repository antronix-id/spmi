'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { 
  AboutPageContent, 
  HomePageContent, 
  ContactPageContent, 
  OrganizationMember 
} from '@/lib/types';
import { 
  initialAboutContent, 
  initialHomeContent, 
  initialContactContent, 
  initialOrgMembers 
} from '@/lib/mock-data';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContentManagementTab } from '@/components/admin/ContentManagementTab';

function KontenPageContent() {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutPageContent>(initialAboutContent);
  const [homeData, setHomeData] = useState<HomePageContent>(initialHomeContent);
  const [contactData, setContactData] = useState<ContactPageContent>(initialContactContent);
  const [members, setMembers] = useState<OrganizationMember[]>(initialOrgMembers);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [about, home, contact, orgMembers] = await Promise.all([
        dataService.getAboutContent(),
        dataService.getHomeContent(),
        dataService.getContactContent(),
        dataService.getOrgMembers()
      ]);
      setAboutData(about);
      setHomeData(home);
      setContactData(contact);
      setMembers(orgMembers);
    } catch (err) {
      console.error('Failed to load content', err);
      showToast('Gagal memuat konten halaman publik', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  return (
    <AdminLayout activeTab="content" itemCount={members.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Pengaturan Konten Halaman Publik...</p>
        </div>
      ) : (
        <ContentManagementTab
          initialAbout={aboutData}
          initialHome={homeData}
          initialContact={contactData}
          initialMembers={members}
          onShowToast={showToast}
        />
      )}
    </AdminLayout>
  );
}

export default function AdminKontenPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <KontenPageContent />
    </Suspense>
  );
}
