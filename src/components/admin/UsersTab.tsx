'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Mail,
  Zap,
  Sliders,
  Check
} from 'lucide-react';
import { AdminUser, ALL_MODULE_KEYS } from '@/lib/types';
import { dataService } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UserModal } from './modals/UserModal';

interface UsersTabProps {
  initialUsers: AdminUser[];
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export function UsersTab({
  initialUsers,
  onShowToast
}: UsersTabProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccessType, setSelectedAccessType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Sync users state with parent initialUsers
  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Stats calculation
  const totalUsers = users.length;
  const fullAccessCount = users.filter(u => {
    if (!u.permissions) return u.role === 'superadmin';
    return Object.values(u.permissions).filter(p => p.view).length === ALL_MODULE_KEYS.length;
  }).length;
  const customAccessCount = totalUsers - fullAccessCount;
  const activeCount = users.filter(u => u.is_active).length;

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.nip && u.nip.includes(searchQuery));

      const activeMenuCount = u.permissions 
        ? Object.values(u.permissions).filter(p => p.view).length 
        : (u.role === 'superadmin' ? 8 : 4);

      const isFull = activeMenuCount === ALL_MODULE_KEYS.length;

      const matchAccess = selectedAccessType === 'all' || 
        (selectedAccessType === 'full' && isFull) || 
        (selectedAccessType === 'custom' && !isFull);

      const matchStatus = selectedStatus === 'all' || 
        (selectedStatus === 'active' && u.is_active) || 
        (selectedStatus === 'inactive' && !u.is_active);

      return matchSearch && matchAccess && matchStatus;
    });
  }, [users, searchQuery, selectedAccessType, selectedStatus]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSaveUser = async (userToSave: AdminUser) => {
    const success = await dataService.saveUser(userToSave);
    if (success) {
      const updatedList = await dataService.getUsers();
      setUsers(updatedList);
      onShowToast(editingUser ? 'Data pengguna berhasil diperbarui!' : 'Pengguna baru berhasil ditambahkan!', 'success');
    } else {
      onShowToast('Gagal menyimpan data pengguna.', 'error');
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const updated = { ...user, is_active: !user.is_active };
    const success = await dataService.saveUser(updated);
    if (success) {
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
      onShowToast(`Akun ${user.name} ${updated.is_active ? 'diaktifkan' : 'dinonaktifkan'}!`, 'success');
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (users.length <= 1) {
      onShowToast('Tidak dapat menghapus satu-satunya akun administrator!', 'error');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${name}"?`)) {
      const success = await dataService.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== id));
        onShowToast(`Akun "${name}" berhasil dihapus.`, 'success');
      } else {
        onShowToast('Gagal menghapus akun pengguna.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-600">Total Pengguna Terdaftar</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalUsers}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-600">Akses Penuh (Semua Menu)</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{fullAccessCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-slate-900 flex items-center justify-center text-amber-700 font-bold">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-600">Akses Kustom / Khusus</p>
              <h3 className="text-2xl font-black text-purple-600 mt-1">{customAccessCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-slate-900 flex items-center justify-center text-purple-700 font-bold">
              <Sliders className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-600">Akun Aktif (Bisa Login)</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-slate-900 flex items-center justify-center text-emerald-700 font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        
        {/* Card Header with Filters & Actions */}
        <div className="p-5 border-b-2 border-slate-900 space-y-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Daftar Akun Pengguna & Hak Akses</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Kelola identitas login dan matriks hak akses menu untuk setiap pengguna</p>
            </div>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="font-extrabold gap-2 h-9 px-4 rounded-xl shadow-md cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <Input
                placeholder="Cari nama, email login, atau NIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-500 text-xs h-9 font-bold focus-visible:ring-1 focus-visible:ring-black"
              />
            </div>

            {/* Filter Access Type */}
            <div className="sm:col-span-3">
              <Select value={selectedAccessType} onValueChange={setSelectedAccessType}>
                <SelectTrigger className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 font-extrabold">
                  <SelectValue placeholder="Semua Hak Akses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-medium">Semua Hak Akses</SelectItem>
                  <SelectItem value="full" className="text-xs font-medium">⚡ Akses Penuh (8 Menu)</SelectItem>
                  <SelectItem value="custom" className="text-xs font-medium">🛡️ Akses Kustom / Terbatas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Status */}
            <div className="sm:col-span-3">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 font-extrabold">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-medium">Semua Status</SelectItem>
                  <SelectItem value="active" className="text-xs font-medium">● Aktif</SelectItem>
                  <SelectItem value="inactive" className="text-xs font-medium">● Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-slate-900 bg-slate-100">
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[35%]">Identitas Pengguna & Email Login</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs w-[35%]">Menu Sidebar & Aksi Yang Diberikan</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-center w-[15%]">Status Login</TableHead>
              <TableHead className="py-3.5 px-4 font-black text-slate-900 text-xs text-right w-[15%]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-xs text-slate-500 font-medium">
                  Tidak ditemukan akun pengguna yang sesuai dengan pencarian.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const activePerms = user.permissions 
                  ? Object.entries(user.permissions).filter(([, p]) => p.view)
                  : [];
                const activeCount = user.permissions ? activePerms.length : (user.role === 'superadmin' ? 8 : 4);
                const isFull = activeCount === ALL_MODULE_KEYS.length;

                return (
                  <TableRow key={user.id} className="border-b border-slate-200 hover:bg-yellow-50/40 transition-colors">
                    
                    {/* User Avatar, Name, Email, NIP, Last Login */}
                    <TableCell className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-slate-900 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                          {user.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-black text-xs text-slate-900">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">{user.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono font-medium flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.last_login && (
                            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Login terakhir: {user.last_login}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Active Permissions / Menus */}
                    <TableCell className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black font-mono border-2 border-slate-900 ${
                            isFull 
                              ? 'bg-yellow-400 text-black shadow-2xs' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            <Zap className="w-3 h-3" />
                            <span>{activeCount} dari {ALL_MODULE_KEYS.length} Menu Diizinkan</span>
                          </span>
                        </div>

                        {/* Chips of active modules */}
                        <div className="flex flex-wrap gap-1">
                          {ALL_MODULE_KEYS.map((mod) => {
                            const isAllowed = user.permissions ? user.permissions[mod.id]?.view : (user.role === 'superadmin');
                            if (!isAllowed) return null;
                            return (
                              <span 
                                key={mod.id} 
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800 font-mono font-bold"
                              >
                                {mod.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>

                    {/* Status Badge Toggle */}
                    <TableCell className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border-2 border-slate-900 cursor-pointer transition-all hover:scale-105 shadow-2xs ${
                          user.is_active 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                        title="Klik untuk mengaktifkan/menonaktifkan akun"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`}></span>
                        <span>{user.is_active ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(user)}
                          className="h-8 px-2.5 text-xs font-bold text-slate-700 hover:text-black hover:bg-yellow-100 rounded-lg gap-1 cursor-pointer"
                          title="Atur Hak Akses & Kata Sandi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Atur Izin</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Hapus Akun Pengguna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

      </Card>

      {/* User Modal Component */}
      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={editingUser}
        onSave={handleSaveUser}
        onShowToast={onShowToast}
      />

    </div>
  );
}
