'use client';

import React from 'react';
import { MessageSquare, Mail, Calendar, User, Trash2 } from 'lucide-react';
import { ContactMessage } from '@/lib/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MessageDetailModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function MessageDetailModal({
  message,
  isOpen,
  onClose,
  onDelete
}: MessageDetailModalProps) {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100 p-6 sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-400" />
              Detail Pesan Masuk
            </DialogTitle>
            <Badge variant="outline" className="text-[10px] bg-zinc-900 border-zinc-700 text-zinc-300">
              {message.created_at || 'Baru'}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            Aspirasi / pertanyaan dari civitas akademika atau masyarakat umum.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Sender Info Card */}
          <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-bold">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>{message.name}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 font-mono">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              <a href={`mailto:${message.email}`} className="text-brand-400 hover:underline">
                {message.email}
              </a>
            </div>
            {message.subject && (
              <div className="text-zinc-300 font-semibold pt-1 border-t border-zinc-800/60">
                Subjek: {message.subject}
              </div>
            )}
          </div>

          {/* Message Content */}
          <div className="space-y-1.5">
            <div className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">
              Isi Pesan:
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-zinc-200 text-xs leading-relaxed whitespace-pre-wrap min-h-[100px]">
              {message.message}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onDelete(message.id);
              onClose();
            }}
            className="border-red-950/60 bg-red-950/20 text-red-300 hover:bg-red-900/40 text-xs gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Pesan</span>
          </Button>

          <div className="flex items-center gap-2">
            <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Layanan SPMI UNPAL')}`}>
              <Button
                type="button"
                size="sm"
                className="bg-white hover:bg-zinc-200 text-black font-bold text-xs"
              >
                Balas via Email
              </Button>
            </a>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs"
            >
              Tutup
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
