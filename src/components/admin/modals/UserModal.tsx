'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Upload, 
  Loader2,
  CheckCircle2,
  Sliders,
  CheckSquare,
  Square,
  Zap,
  Eye,
  EyeOff,
  FileText,
  Search,
  RotateCcw
} from 'lucide-react';
import { 
  AdminUser, 
  AdminModuleKey, 
  UserPermissions, 
  ALL_MODULE_KEYS, 
  getDefaultPermissions 
} from '@/lib/types';
import { dataService } from '@/lib/supabase';

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  onSave: (user: AdminUser) => void;
  onShowToast?: (msg: string, type: 'success' | 'error') => void;
}

export function UserModal({
  open,
  onOpenChange,
  user,
  onSave,
  onShowToast
}: UserModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions'>('profile');
  
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    password: '',
    nip: '',
    avatar_url: '',
    is_active: true
  });

  const [permissions, setPermissions] = useState<UserPermissions>(getDefaultPermissions('admin_spmi'));
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setActiveTab('profile');
    if (user) {
      setFormData({
        ...user,
        password: '' // Keep empty unless updating
      });
      setPermissions(user.permissions || getDefaultPermissions('admin_spmi'));
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        nip: '',
        avatar_url: '',
        is_active: true
      });
      setPermissions(getDefaultPermissions('admin_spmi'));
    }
  }, [user, open]);

  // Permission Matrix Handlers
  const handleTogglePerm = (moduleKey: AdminModuleKey, action: 'view' | 'create' | 'edit' | 'delete') => {
    setPermissions(prev => {
      const currentMod = prev[moduleKey] || { view: false, create: false, edit: false, delete: false };
      const nextVal = !currentMod[action];
      const nextMod = { ...currentMod, [action]: nextVal };
      
      // If create/edit/delete is turned true, ensure view is also true
      if ((action === 'create' || action === 'edit' || action === 'delete') && nextVal) {
        nextMod.view = true;
      }
      // If view is turned false, turn off create/edit/delete as well
      if (action === 'view' && !nextVal) {
        nextMod.create = false;
        nextMod.edit = false;
        nextMod.delete = false;
      }

      return {
        ...prev,
        [moduleKey]: nextMod
      };
    });
  };

  const handleApplyPreset = (preset: 'all' | 'readonly' | 'docs' | 'auditor' | 'clear') => {
    if (preset === 'all') {
      setPermissions(getDefaultPermissions('superadmin'));
      onShowToast?.('Template Akses Penuh (Semua Menu & CRUD) diterapkan!', 'success');
    } else if (preset === 'readonly') {
      setPermissions(getDefaultPermissions('pimpinan'));
      onShowToast?.('Template Hanya Lihat (Read-Only) diterapkan!', 'success');
    } else if (preset === 'docs') {
      setPermissions(getDefaultPermissions('admin_spmi'));
      onShowToast?.('Template Dokumen & Akreditasi diterapkan!', 'success');
    } else if (preset === 'auditor') {
      setPermissions(getDefaultPermissions('auditor'));
      onShowToast?.('Template Pemantauan Mutu (AMI) diterapkan!', 'success');
    } else {
      // Clear all
      const cleared = {} as UserPermissions;
      ALL_MODULE_KEYS.forEach(m => {
        cleared[m.id] = { view: false, create: false, edit: false, delete: false };
      });
      setPermissions(cleared);
      onShowToast?.('Semua hak akses dikosongkan!', 'success');
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true);
    const result = await dataService.uploadFile(file, 'documents');
    setUploadingAvatar(false);
    if (result?.url) {
      setFormData(prev => ({ ...prev, avatar_url: result.url }));
      onShowToast?.('Foto profil berhasil diunggah!', 'success');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      onShowToast?.('Nama dan email wajib diisi!', 'error');
      return;
    }

    const emailTrimmed = formData.email.trim().toLowerCase();
    const enteredPassword = formData.password?.trim() || (user?.password || 'admin*unpal2025');

    if (!user && !formData.password?.trim()) {
      onShowToast?.('Kata sandi wajib diisi untuk pengguna baru!', 'error');
      return;
    }

    setSaving(true);
    const allUsers = await dataService.getUsers();

    // 1. VALIDASI KEUNIKAN EMAIL
    const emailExists = allUsers.some(
      u => u.id !== user?.id && u.email.toLowerCase().trim() === emailTrimmed
    );
    if (emailExists) {
      onShowToast?.('Email ini sudah digunakan oleh akun lain! Gunakan email yang berbeda.', 'error');
      setSaving(false);
      return;
    }

    // Hitung menu aktif untuk label dinamis
    const activeMenuCount = Object.values(permissions).filter(p => p.view).length;
    const isFullAccess = activeMenuCount === ALL_MODULE_KEYS.length && Object.values(permissions).every(p => p.create && p.edit && p.delete);
    const roleLabel = isFullAccess ? 'Akses Penuh (Super Admin)' : `${activeMenuCount} Menu Aktif`;

    const generateId = () => {
      if (user?.id) return user.id;
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };

    const now = new Date();
    const finalUser: AdminUser = {
      id: generateId(),
      name: formData.name.trim(),
      email: emailTrimmed,
      password: enteredPassword,
      role: isFullAccess ? 'superadmin' : 'admin_spmi',
      role_label: roleLabel,
      nip: formData.nip?.trim() || undefined,
      avatar_url: formData.avatar_url?.trim() || undefined,
      is_active: formData.is_active ?? true,
      permissions: permissions,
      last_login: user?.last_login,
      created_at: user?.created_at || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    };

    onSave(finalUser);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white p-6 sm:p-7 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-zinc-300" />
            <span>{user ? 'Edit Akun & Hak Akses Pengguna' : 'Tambah Pengguna Admin Baru'}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Atur informasi identitas login, hak akses menu sidebar, dan izin operasi CRUD pengguna
          </DialogDescription>
        </DialogHeader>

        {/* Modal Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pt-2 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-100 cursor-pointer flex items-center gap-1.5 select-none ${
              activeTab === 'profile'
                ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-b-2 border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Profil & Akun Login</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-100 cursor-pointer flex items-center gap-1.5 select-none ${
              activeTab === 'permissions'
                ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-b-2 border-transparent'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>2. Matriks Hak Akses (Menu & CRUD)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          
          {/* ======================================================== */}
          {/* TAB 1: PROFIL & AKUN LOGIN */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Nama Lengkap & NIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300">Nama Lengkap & Gelar *</Label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      required
                      placeholder="Dr. Nama, M.Kom."
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 text-xs h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300">NIP / NIDN (Opsional)</Label>
                  <Input
                    placeholder="198001012005011001"
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 text-xs h-9 font-mono"
                  />
                </div>
              </div>

              {/* Email & Kata Sandi (Unik) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300">Email Login Resmi * (Unik)</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      type="email"
                      required
                      placeholder="nama@unpal.ac.id"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 text-xs h-9"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">Email tidak boleh sama dengan pengguna lain</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-300">
                    Kata Sandi {user ? '(Kosongkan jika tidak diubah)' : '*'} (Unik)
                  </Label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={user ? '••••••••' : 'Minimal 6 karakter unik'}
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-9 pr-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 text-xs h-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-md cursor-pointer focus:outline-none"
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono">Kata sandi tidak boleh sama dengan akun lain</p>
                </div>
              </div>

              {/* Foto Profil URL / Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-300">Foto Profil (URL / Upload)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="https://... atau klik Upload"
                    value={formData.avatar_url || ''}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-700 text-xs h-9 flex-1"
                  />
                  <label className="cursor-pointer shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={uploadingAvatar}
                      className="h-9 px-3 text-xs bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-200 gap-1.5 cursor-pointer"
                      asChild
                    >
                      <span>
                        {uploadingAvatar ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                        <span>Upload</span>
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Next Step Banner */}
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-white">Langkah Selanjutnya: Atur Hak Akses</div>
                  <div className="text-[11px] text-zinc-400">Tentukan menu dan aksi apa saja yang boleh diakses pengguna ini.</div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab('permissions')}
                  className="h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white shrink-0 cursor-pointer"
                >
                  Atur Matriks Izin &rarr;
                </Button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MATRIKS HAK AKSES (MENU & CRUD) */}
          {/* ======================================================== */}
          {activeTab === 'permissions' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Presets Bar */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-300">Pilih Template Izin Cepat:</Label>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyPreset('all')}
                    className="h-7 text-[11px] bg-zinc-900 border-zinc-800 text-amber-300 hover:bg-zinc-800 gap-1 rounded-lg cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Akses Penuh (Semua Menu)</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyPreset('readonly')}
                    className="h-7 text-[11px] bg-zinc-900 border-zinc-800 text-purple-300 hover:bg-zinc-800 gap-1 rounded-lg cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Hanya Lihat</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyPreset('docs')}
                    className="h-7 text-[11px] bg-zinc-900 border-zinc-800 text-sky-300 hover:bg-zinc-800 gap-1 rounded-lg cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Dokumen & Akreditasi</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyPreset('auditor')}
                    className="h-7 text-[11px] bg-zinc-900 border-zinc-800 text-emerald-300 hover:bg-zinc-800 gap-1 rounded-lg cursor-pointer"
                  >
                    <Search className="w-3 h-3" />
                    <span>Pemantauan AMI</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyPreset('clear')}
                    className="h-7 text-[11px] bg-zinc-900 border-zinc-800 text-red-300 hover:bg-zinc-800 gap-1 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Kosongkan</span>
                  </Button>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-black/80 text-zinc-400 font-mono">
                      <th className="py-2.5 px-3 font-bold text-white w-[40%]">Nama Modul / Menu Sidebar</th>
                      <th className="py-2.5 px-2 font-bold text-center w-[15%]">Lihat (Menu)</th>
                      <th className="py-2.5 px-2 font-bold text-center w-[15%]">Tambah</th>
                      <th className="py-2.5 px-2 font-bold text-center w-[15%]">Ubah</th>
                      <th className="py-2.5 px-2 font-bold text-center w-[15%]">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {ALL_MODULE_KEYS.map((mod) => {
                      const perm = permissions[mod.id] || { view: false, create: false, edit: false, delete: false };
                      return (
                        <tr key={mod.id} className="hover:bg-zinc-900/80 transition-colors">
                          <td className="py-2 px-3">
                            <div className="font-bold text-white text-xs">{mod.label}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{mod.desc}</div>
                          </td>

                          {/* View */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePerm(mod.id, 'view')}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                perm.view 
                                  ? 'text-sky-400 bg-sky-500/15 hover:bg-sky-500/25' 
                                  : 'text-zinc-600 hover:text-zinc-400 bg-zinc-900'
                              }`}
                              title={perm.view ? 'Menu diizinkan tampil di sidebar' : 'Menu disembunyikan'}
                            >
                              {perm.view ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>

                          {/* Create */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePerm(mod.id, 'create')}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                perm.create 
                                  ? 'text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25' 
                                  : 'text-zinc-600 hover:text-zinc-400 bg-zinc-900'
                              }`}
                              title={perm.create ? 'Izin tambah data aktif' : 'Tidak boleh tambah data'}
                            >
                              {perm.create ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>

                          {/* Edit */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePerm(mod.id, 'edit')}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                perm.edit 
                                  ? 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25' 
                                  : 'text-zinc-600 hover:text-zinc-400 bg-zinc-900'
                              }`}
                              title={perm.edit ? 'Izin edit data aktif' : 'Tidak boleh edit data'}
                            >
                              {perm.edit ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>

                          {/* Delete */}
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePerm(mod.id, 'delete')}
                              className={`p-1 rounded-md transition-colors cursor-pointer ${
                                perm.delete 
                                  ? 'text-red-400 bg-red-500/15 hover:bg-red-500/25' 
                                  : 'text-zinc-600 hover:text-zinc-400 bg-zinc-900'
                              }`}
                              title={perm.delete ? 'Izin hapus data aktif' : 'Tidak boleh hapus data'}
                            >
                              {perm.delete ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-zinc-500 italic">
                * Menu sidebar pengguna akan otomatis menyesuaikan hanya dengan modul yang dicentang &quot;Lihat (Menu)&quot;.
              </p>
            </div>
          )}

          <DialogFooter className="pt-3 gap-2 sm:gap-0 border-t border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 h-9 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="text-xs font-extrabold gap-1.5 h-9 px-4 rounded-xl shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Memvalidasi & Menyimpan...' : user ? 'Perbarui Akun & Izin' : 'Simpan Akun Baru'}</span>
            </Button>
          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}
