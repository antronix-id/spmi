'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Edit3, 
  Trash2, 
  Filter, 
  Plus,
  Search,
  X,
  RefreshCw,
  FileQuestion,
  MoreHorizontal
} from 'lucide-react';
import { MonitoringData, SpmiStandardAspect } from '@/lib/types';
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
import { Progress } from '@/components/ui/progress';
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

interface MonitoringTabProps {
  monitoring: MonitoringData[];
  onOpenAdd: () => void;
  onOpenEdit: (mon: MonitoringData) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}

export function MonitoringTab({
  monitoring,
  onOpenAdd,
  onOpenEdit,
  onDelete,
  searchQuery,
  setSearchQuery,
  onRefresh
}: MonitoringTabProps) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [aspectFilter, setAspectFilter] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  React.useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const canCreate = currentUser?.role === 'superadmin' || currentUser?.permissions?.monitoring?.create !== false;
  const canEdit = currentUser?.role === 'superadmin' || currentUser?.permissions?.monitoring?.edit !== false;
  const canDelete = currentUser?.role === 'superadmin' || currentUser?.permissions?.monitoring?.delete !== false;

  const aspects: (SpmiStandardAspect | 'Semua')[] = [
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

  const statuses = ['Semua', 'Melampaui', 'Tercapai', 'Belum Tercapai'];

  const filteredMons = monitoring.filter((mon) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      mon.standard_name.toLowerCase().includes(q) ||
      mon.category.toLowerCase().includes(q) ||
      (mon.study_program && mon.study_program.toLowerCase().includes(q)) ||
      (mon.faculty && mon.faculty.toLowerCase().includes(q)) ||
      mon.audit_period.toLowerCase().includes(q);

    const matchesAspect = aspectFilter === 'Semua' || mon.category === aspectFilter;
    const matchesStatus = statusFilter === 'Semua' || mon.status === statusFilter;

    return matchesSearch && matchesAspect && matchesStatus;
  });

  return (
    <div className="space-y-4 font-sans animate-in fade-in duration-200">
      
      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
        
        {/* Left Side: Select Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Aspect Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase">Aspek:</span>
            <div className="w-36 sm:w-44">
              <Select value={aspectFilter} onValueChange={setAspectFilter}>
                <SelectTrigger className="h-8 text-xs bg-white border-2 border-slate-900 text-slate-900 rounded-lg shadow-2xs font-extrabold">
                  <SelectValue placeholder="Aspek Standar" />
                </SelectTrigger>
                <SelectContent>
                  {aspects.map((aspect) => (
                    <SelectItem key={aspect} value={aspect} className="text-xs font-medium">
                      {aspect === 'Semua' ? 'Semua Aspek' : aspect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-600 uppercase">Status:</span>
            <div className="w-36 sm:w-44">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs bg-white border-2 border-slate-900 text-slate-900 rounded-lg shadow-2xs font-extrabold">
                  <SelectValue placeholder="Status Mutu" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((st) => (
                    <SelectItem key={st} value={st} className="text-xs font-medium">
                      {st === 'Semua' ? 'Semua Status' : st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filter Button */}
          {(aspectFilter !== 'Semua' || statusFilter !== 'Semua') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAspectFilter('Semua');
                setStatusFilter('Semua');
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
              placeholder="Cari standar / unit..."
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
              className="h-8 font-extrabold gap-1.5 px-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0_0_#000] text-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Evaluasi</span>
            </Button>
          )}

        </div>

      </div>

      {/* Main Table Card with 3D border */}
      <Card className="overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-slate-900 bg-slate-100">
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[36%] min-w-[260px]">Standar Mutu & Unit Kerja</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[14%] min-w-[130px]">Aspek Standar</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[12%] min-w-[100px]">Periode</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[15%] min-w-[130px]">Target vs Capaian</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[11%] min-w-[110px]">Status Mutu</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[8%] min-w-[80px]">Temuan</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-right w-[6%] min-w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-14 text-xs text-slate-500 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold">
                      <FileQuestion className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900">Tidak ada data evaluasi yang sesuai</p>
                    <p className="text-xs text-slate-600">Coba sesuaikan filter atau tambahkan data evaluasi AMI baru.</p>
                    <Button onClick={onOpenAdd} size="sm" className="mt-2 text-xs font-extrabold">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Tambah Evaluasi Baru
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMons.map((mon) => {
                return (
                  <TableRow key={mon.id} className="border-b border-slate-200 hover:bg-yellow-50/40 transition-colors group">
                    
                    {/* Standard Name & Unit */}
                    <TableCell className="py-3.5 px-4">
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                          {mon.standard_name}
                        </div>
                        <div className="text-xs text-slate-600 font-medium mt-0.5">
                          {mon.faculty} {mon.study_program ? `• ${mon.study_program}` : ''}
                        </div>
                      </div>
                    </TableCell>

                    {/* Aspect */}
                    <TableCell className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
                        {mon.category}
                      </span>
                    </TableCell>

                    {/* Period */}
                    <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-mono text-xs text-slate-900 font-black">
                        {mon.audit_period}
                      </span>
                    </TableCell>

                    {/* Score Target vs Actual */}
                    <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center leading-tight">
                        <div className="font-mono text-xs font-black text-slate-900">
                          {mon.actual_score} / {mon.target_score}
                        </div>
                        <div className="w-20 mt-1.5">
                          <Progress
                            value={Math.min(mon.achievement_rate, 100)}
                            indicatorClassName="bg-yellow-400 border-r border-slate-900"
                            className="h-1.5 bg-slate-200 border border-slate-900"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-700 mt-1 font-black">
                          {mon.achievement_rate}%
                        </span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black border border-slate-900 bg-yellow-400 text-black shadow-2xs">
                        {mon.status}
                      </span>
                    </TableCell>

                    {/* Findings / Temuan */}
                    <TableCell className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex flex-col items-center text-xs">
                        <span className="font-mono font-black text-slate-900 text-xs">
                          {mon.resolved_findings || 0}/{mon.findings_count || 0}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium mt-0.5">RTM</span>
                      </div>
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
                          <DropdownMenuLabel>Aksi Evaluasi</DropdownMenuLabel>
                          {canEdit && (
                            <DropdownMenuItem onClick={() => onOpenEdit(mon)}>
                              <Edit3 className="w-3.5 h-3.5 mr-2 text-slate-700" />
                              <span>Edit Data AMI</span>
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                variant="destructive"
                                onClick={() => onDelete(mon.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                <span>Hapus Data AMI</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
}
