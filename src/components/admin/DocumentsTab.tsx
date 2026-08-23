'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
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
import { SpmiDocument, SpmiStandardAspect } from '@/lib/types';
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
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DocumentDetailModal } from '@/components/admin/modals/DocumentDetailModal';
import { DocumentAccessTab } from '@/components/admin/DocumentAccessTab';
import { dataService } from '@/lib/supabase';
import { AdminUser, DocumentAccessKey } from '@/lib/types';
import { KeyRound } from 'lucide-react';

interface DocumentsTabProps {
  documents: SpmiDocument[];
  onOpenAdd: () => void;
  onOpenEdit: (doc: SpmiDocument) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
  accessKeys?: DocumentAccessKey[];
  onOpenGenerateAccessKey?: () => void;
  onToggleAccessKeyStatus?: (id: string, is_active: boolean) => void;
  onDeleteAccessKey?: (id: string) => void;
  onRefreshAccessKeys?: () => void;
}

export function DocumentsTab({
  documents,
  onOpenAdd,
  onOpenEdit,
  onDelete,
  searchQuery,
  setSearchQuery,
  onRefresh,
  accessKeys = [],
  onOpenGenerateAccessKey = () => {},
  onToggleAccessKeyStatus = () => {},
  onDeleteAccessKey = () => {},
  onRefreshAccessKeys = () => {}
}: DocumentsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'access_keys'>('catalog');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [aspectFilter, setAspectFilter] = useState<string>('Semua');
  const [viewingDoc, setViewingDoc] = useState<SpmiDocument | null>(null);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const canCreate = currentUser?.role === 'superadmin' || currentUser?.permissions?.documents?.create !== false;
  const canEdit = currentUser?.role === 'superadmin' || currentUser?.permissions?.documents?.edit !== false;
  const canDelete = currentUser?.role === 'superadmin' || currentUser?.permissions?.documents?.delete !== false;

  const categories = [
    'Semua',
    'Kebijakan SPMI',
    'Manual Mutu',
    'Standar SPMI',
    'Formulir Mutu',
    'Laporan AMI',
    'Dokumen RTM'
  ];

  const aspects = [
    'Semua',
    'Non-Aspek',
    'Pendidikan',
    'Penelitian',
    'Pengabdian pada Masyarakat',
    'Organisasi',
    'Kemahasiswaan',
    'Sumber Daya Manusia',
    'Sarana Prasarana',
    'Keuangan',
    'Kerja Sama',
    'Kesejahteraan'
  ];

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(q) ||
      doc.document_code.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      (doc.standard_aspect && doc.standard_aspect.toLowerCase().includes(q)) ||
      (doc.description && doc.description.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === 'Semua' || doc.category === categoryFilter;
    const matchesAspect =
      aspectFilter === 'Semua'
        ? true
        : aspectFilter === 'Non-Aspek'
        ? !doc.standard_aspect || doc.standard_aspect.trim() === ''
        : doc.standard_aspect === aspectFilter;

    return matchesSearch && matchesCategory && matchesAspect;
  });

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-200">
      
      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 border-2 border-slate-900 rounded-2xl w-fit shadow-[3px_3px_0_0_#000000]">
        <button
          type="button"
          onClick={() => setActiveSubTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'catalog'
              ? 'bg-yellow-400 text-slate-900 border-2 border-slate-900 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60 font-extrabold border-2 border-transparent'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Katalog Dokumen SPMI</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeSubTab === 'catalog' ? 'bg-slate-900 text-yellow-400' : 'bg-slate-300 text-slate-700'}`}>
            {documents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('access_keys')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'access_keys'
              ? 'bg-yellow-400 text-slate-900 border-2 border-slate-900 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60 font-extrabold border-2 border-transparent'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Kode & Link Akses Publik</span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${activeSubTab === 'access_keys' ? 'bg-slate-900 text-yellow-400' : 'bg-slate-300 text-slate-700'}`}>
            {accessKeys.length}
          </span>
        </button>
      </div>

      {activeSubTab === 'access_keys' ? (
        <DocumentAccessTab
          accessKeys={accessKeys}
          onOpenGenerate={onOpenGenerateAccessKey}
          onToggleStatus={onToggleAccessKeyStatus}
          onDelete={onDeleteAccessKey}
          onRefresh={onRefreshAccessKeys}
          currentUser={currentUser}
        />
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
        
        {/* Left Side: Select Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase">Kategori:</span>
            <div className="w-36 sm:w-44">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-xs bg-white border-2 border-slate-900 text-slate-900 rounded-lg shadow-2xs font-extrabold">
                  <SelectValue placeholder="Kategori Dokumen" />
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

          {/* Standard Aspect Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase">Aspek:</span>
            <div className="w-40 sm:w-48">
              <Select value={aspectFilter} onValueChange={setAspectFilter}>
                <SelectTrigger className="h-8 text-xs bg-white border-2 border-slate-900 text-slate-900 rounded-lg shadow-2xs font-extrabold">
                  <SelectValue placeholder="Aspek Standar" />
                </SelectTrigger>
                <SelectContent>
                  {aspects.map((aspect) => (
                    <SelectItem key={aspect} value={aspect} className="text-xs font-medium">
                      {aspect === 'Semua' ? 'Semua Aspek Standar' : aspect === 'Non-Aspek' ? 'Non-Aspek / Umum' : `Aspek ${aspect}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filter Button */}
          {(categoryFilter !== 'Semua' || aspectFilter !== 'Semua') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategoryFilter('Semua');
                setAspectFilter('Semua');
              }}
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
              placeholder="Cari dokumen mutu..."
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

          {/* Add Document Button */}
          {canCreate && (
            <Button 
              onClick={onOpenAdd} 
              size="sm" 
              className="h-8 font-extrabold gap-1.5 px-3 rounded-xl shadow-md text-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Dokumen</span>
            </Button>
          )}

        </div>

      </div>

      {/* Main Table Card with 3D border */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-slate-900 bg-slate-100">
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[30%] min-w-[220px]">Nama / Judul Dokumen</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[16%] min-w-[140px]">Aspek Standar</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[14%] min-w-[130px]">Kategori</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[16%] min-w-[140px]">Kode Dokumen</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[8%] min-w-[70px]">Tahun</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[8%] min-w-[80px]">Berkas</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-right w-[6%] min-w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-xs text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold">
                      <FileQuestion className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">Tidak ada dokumen SPMI yang sesuai</p>
                    <p className="text-xs text-slate-600">Coba sesuaikan filter kategori atau masukkan dokumen baru.</p>
                    <Button onClick={onOpenAdd} size="sm" className="mt-2 text-xs font-extrabold">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Tambah Dokumen Baru
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocs.map((doc) => (
                <TableRow key={doc.id} className="border-b border-slate-200 hover:bg-yellow-50/40 transition-colors group">
                  
                  {/* Document Title */}
                  <TableCell className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                      {doc.title}
                    </div>
                  </TableCell>

                  {/* Standard Aspect */}
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    {doc.standard_aspect ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                        Aspek {doc.standard_aspect}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">-</span>
                    )}
                  </TableCell>

                  {/* Category Badge */}
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                      {doc.category}
                    </span>
                  </TableCell>

                  {/* Document Code */}
                  <TableCell className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs text-slate-900 bg-yellow-50 px-2.5 py-1 rounded-lg border border-slate-900 shadow-2xs inline-block font-extrabold">
                      {doc.document_code}
                    </span>
                  </TableCell>

                  {/* Year */}
                  <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="text-xs text-slate-900 font-black font-mono">{doc.year}</span>
                  </TableCell>

                  {/* View Document Details Modal Trigger Button */}
                  <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setViewingDoc(doc)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white text-slate-900 border-2 border-slate-900 hover:bg-yellow-400 transition-all shadow-2xs mx-auto font-bold"
                      title="Lihat Detail & Berkas Dokumen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
                        <DropdownMenuLabel>Aksi Dokumen</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setViewingDoc(doc)}>
                          <Eye className="w-3.5 h-3.5 mr-2 text-slate-700" />
                          <span>Lihat Detail</span>
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onOpenEdit(doc)}>
                            <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-700" />
                            <span>Edit Dokumen</span>
                          </DropdownMenuItem>
                        )}
                        {doc.file_url && doc.file_url !== '#' && (
                          <DropdownMenuItem asChild>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
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
                              onClick={() => onDelete(doc.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              <span>Hapus Dokumen</span>
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
      </>
      )}

      {/* Detail Document Modal */}
      <DocumentDetailModal
        document={viewingDoc}
        isOpen={Boolean(viewingDoc)}
        onClose={() => setViewingDoc(null)}
      />

    </div>
  );
}
