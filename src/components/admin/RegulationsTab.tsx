'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  Edit3, 
  Trash2, 
  Download, 
  Eye,
  Filter, 
  Plus, 
  Search, 
  X, 
  RefreshCw, 
  FileQuestion,
  MoreHorizontal
} from 'lucide-react';
import { Regulation } from '@/lib/types';
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
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

interface RegulationsTabProps {
  regulations: Regulation[];
  onOpenAdd: () => void;
  onOpenEdit: (reg: Regulation) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}

export function RegulationsTab({
  regulations,
  onOpenAdd,
  onOpenEdit,
  onDelete,
  searchQuery,
  setSearchQuery,
  onRefresh
}: RegulationsTabProps) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

  React.useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const canCreate = currentUser?.role === 'superadmin' || currentUser?.permissions?.regulations?.create !== false;
  const canEdit = currentUser?.role === 'superadmin' || currentUser?.permissions?.regulations?.edit !== false;
  const canDelete = currentUser?.role === 'superadmin' || currentUser?.permissions?.regulations?.delete !== false;

  const categories = [
    'Semua',
    'Undang-Undang',
    'Permendikbudristek',
    'SN-Dikti',
    'SK Rektor',
    'Pedoman SPMI'
  ];

  const filteredRegs = regulations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      reg.title.toLowerCase().includes(q) ||
      reg.regulation_number.toLowerCase().includes(q) ||
      reg.category.toLowerCase().includes(q) ||
      reg.issued_by.toLowerCase().includes(q) ||
      (reg.description && reg.description.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'Semua' || reg.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-200">
      
      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
        
        {/* Left Side: Category Select */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase">Kategori:</span>
            <div className="w-48 sm:w-56">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-xs bg-white border-2 border-slate-900 text-slate-900 rounded-lg shadow-2xs font-extrabold">
                  <SelectValue placeholder="Kategori Regulasi" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs font-medium">
                      {cat === 'Semua' ? 'Semua Kategori' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filter Button */}
          {categoryFilter !== 'Semua' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoryFilter('Semua')}
              className="text-[11px] font-bold text-slate-600 hover:text-black h-7 px-2 rounded-md"
            >
              Reset
            </Button>
          )}
        </div>

        {/* Right Side: Search, Refresh, and Add Button */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          
          {/* Search Input */}
          <div className="relative w-44 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <Input
              placeholder="Cari regulasi / nomor SK..."
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

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="h-8 w-8 border-2 border-slate-900 bg-white text-slate-900 hover:text-black hover:bg-yellow-100 rounded-lg shadow-2xs shrink-0"
            title="Segarkan data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>

          {/* Add Button */}
          {canCreate && (
            <Button 
              onClick={onOpenAdd} 
              size="sm" 
              className="h-8 font-extrabold gap-1.5 px-3 rounded-xl shadow-md text-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Peraturan</span>
            </Button>
          )}

        </div>

      </div>

      {/* Main Table Card with 3D border */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-slate-900 bg-slate-100">
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[40%] min-w-[260px]">Nama / Tentang Regulasi</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[15%] min-w-[130px]">Kategori</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[18%] min-w-[150px]">Nomor Peraturan</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[13%] min-w-[120px]">Penerbit</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[7%] min-w-[70px]">Tahun</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[7%] min-w-[80px]">Berkas</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-right w-[6%] min-w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-xs text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold">
                      <FileQuestion className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">Tidak ada regulasi yang sesuai</p>
                    <p className="text-xs text-slate-600">Coba ubah kata kunci pencarian atau sesuaikan filter kategori.</p>
                    <Button onClick={onOpenAdd} size="sm" className="mt-2 text-xs font-extrabold">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Tambah Regulasi Baru
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRegs.map((reg) => (
                <TableRow key={reg.id} className="border-b border-slate-200 hover:bg-yellow-50/40 transition-colors group">
                  
                  {/* Title */}
                  <TableCell className="py-3.5 px-4">
                    <div className="min-w-0">
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                        {reg.title}
                      </div>
                      {reg.description && (
                        <div className="text-xs text-slate-600 truncate max-w-xs mt-0.5 font-medium">
                          {reg.description}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                      {reg.category}
                    </span>
                  </TableCell>

                  {/* Regulation Number */}
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-900 bg-yellow-50 px-2.5 py-1 rounded-lg border border-slate-900 shadow-2xs inline-block font-extrabold">
                      {reg.regulation_number}
                    </span>
                  </TableCell>

                  {/* Issuer */}
                  <TableCell className="py-3.5 px-4">
                    <span className="text-xs text-slate-800 truncate inline-block max-w-[150px] font-bold">
                      {reg.issued_by}
                    </span>
                  </TableCell>

                  {/* Year */}
                  <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="text-xs font-black text-slate-900 font-mono">{reg.year}</span>
                  </TableCell>

                  {/* File Download / View */}
                  <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                    {reg.file_url && reg.file_url !== '#' ? (
                      <a
                        href={reg.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white text-slate-900 border-2 border-slate-900 hover:bg-yellow-400 transition-all shadow-2xs mx-auto font-bold"
                        title="Lihat / Unduh Salinan PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">-</span>
                    )}
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
                        <DropdownMenuLabel>Aksi Regulasi</DropdownMenuLabel>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onOpenEdit(reg)}>
                            <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-700" />
                            <span>Edit Regulasi</span>
                          </DropdownMenuItem>
                        )}
                        {reg.file_url && reg.file_url !== '#' && (
                          <DropdownMenuItem asChild>
                            <a href={reg.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="w-3.5 h-3.5 mr-2 text-white" />
                              <span>Unduh Berkas</span>
                            </a>
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              variant="destructive"
                              onClick={() => onDelete(reg.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              <span>Hapus Regulasi</span>
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
