'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { ContactMessage } from '@/lib/types';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MessagesTab } from '@/components/admin/MessagesTab';
import { MessageDetailModal } from '@/components/admin/modals/MessageDetailModal';

function PesanContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await dataService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat pesan masuk', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setMessageModalOpen(true);
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      await dataService.deleteMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      showToast('Pesan berhasil dihapus');
    }
  };

  return (
    <AdminLayout activeTab="messages" itemCount={messages.length} toast={toast}>
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <p className="text-xs font-mono">Memuat Kotak Masuk Publik...</p>
        </div>
      ) : (
        <MessagesTab
          messages={messages}
          onViewDetail={handleViewMessage}
          onDelete={handleDeleteMessage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={loadMessages}
        />
      )}

      <MessageDetailModal
        message={selectedMessage}
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        onDelete={handleDeleteMessage}
      />
    </AdminLayout>
  );
}

export default function AdminPesanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <PesanContent />
    </Suspense>
  );
}
