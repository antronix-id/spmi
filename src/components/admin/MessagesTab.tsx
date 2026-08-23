'use client';

import React from 'react';
import { 
  MessageSquare, 
  Eye, 
  Trash2, 
  FileQuestion, 
  Search, 
  X, 
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { ContactMessage } from '@/lib/types';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

import { dataService } from '@/lib/supabase';
import { AdminUser } from '@/lib/types';

interface MessagesTabProps {
  messages: ContactMessage[];
  onViewDetail: (msg: ContactMessage) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}

export function MessagesTab({
  messages,
  onViewDetail,
  onDelete,
  searchQuery,
  setSearchQuery,
  onRefresh
}: MessagesTabProps) {
  const [currentUser, setCurrentUser] = React.useState<AdminUser | null>(null);

  React.useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const canDelete = currentUser?.role === 'superadmin' || currentUser?.permissions?.messages?.delete !== false;

  const filteredMsgs = messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      (msg.subject && msg.subject.toLowerCase().includes(q)) ||
      msg.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-200">
      
      {/* Search & Refresh Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
        
        <div className="flex items-center gap-1.5 text-slate-800 text-xs font-black">
          <MessageSquare className="w-4 h-4 text-black" />
          <span>Daftar Pesan Masuk ({filteredMsgs.length})</span>
        </div>

        {/* Right Side: Search & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-48 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <Input
              placeholder="Cari pesan / pengirim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 h-8 bg-white border-2 border-slate-900 text-xs text-slate-900 placeholder:text-slate-500 rounded-lg font-bold focus-visible:ring-1 focus-visible:ring-black shadow-2xs"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black h-6 w-6 rounded-md"
                title="Hapus pencarian"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 border-2 border-slate-900 bg-white text-slate-900 hover:text-black hover:bg-yellow-100 rounded-lg shadow-2xs shrink-0"
            title="Segarkan pesan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

      </div>

      {/* Main Table Card with 3D border */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-slate-900 bg-slate-100">
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[28%] min-w-[200px]">Pengirim & Kontak</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[22%] min-w-[150px]">Subjek Pesan</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[34%] min-w-[220px]">Cuplikan Pesan</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[10%] min-w-[100px]">Waktu Masuk</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-right w-[6%] min-w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMsgs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-14 text-xs text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold">
                      <FileQuestion className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">Tidak ada pesan masuk</p>
                    <p className="text-xs text-slate-600">Aspirasi atau masukan dari formulir kontak publik akan ditampilkan di sini.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMsgs.map((msg) => (
                <TableRow key={msg.id} className="border-b border-slate-200 hover:bg-yellow-50/40 transition-colors group">
                  
                  {/* Sender */}
                  <TableCell className="py-3.5 px-4">
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm truncate leading-snug">
                        {msg.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono font-medium truncate mt-0.5">
                        {msg.email}
                      </div>
                    </div>
                  </TableCell>

                  {/* Subject */}
                  <TableCell className="py-3.5 px-4">
                    <div className="font-extrabold text-xs text-slate-900 truncate">
                      {msg.subject || '(Tanpa Subjek)'}
                    </div>
                  </TableCell>

                  {/* Snippet */}
                  <TableCell className="py-3.5 px-4">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {msg.message}
                    </p>
                  </TableCell>

                  {/* Time */}
                  <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="text-xs text-slate-600 font-mono font-bold">
                      {msg.created_at || 'Baru'}
                    </span>
                  </TableCell>

                  {/* Shadcn Table Actions Dropdown */}
                  <TableCell className="py-3.5 px-4 text-right whitespace-nowrap">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-700 hover:text-black hover:bg-yellow-100 rounded-xl"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Buka menu aksi</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Aksi Pesan</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetail(msg)}>
                          <Eye className="w-3.5 h-3.5 mr-2 text-slate-700" />
                          <span>Lihat & Balas</span>
                        </DropdownMenuItem>
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              variant="destructive"
                              onClick={() => onDelete(msg.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              <span>Hapus Pesan</span>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
}
