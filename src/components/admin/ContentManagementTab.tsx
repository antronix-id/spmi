'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Home, 
  Phone, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Info,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Target,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  Clock,
  Mail, 
  Compass,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { 
  AboutPageContent, 
  HomePageContent, 
  ContactPageContent, 
  OrganizationMember,
  AdminUser
} from '@/lib/types';
import { dataService } from '@/lib/supabase';
import { initialAboutContent, initialHomeContent, initialContactContent, initialOrgMembers } from '@/lib/mock-data';
import { OrgMemberModal } from './modals/OrgMemberModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';

interface ContentManagementTabProps {
  initialAbout: AboutPageContent;
  initialHome: HomePageContent;
  initialContact: ContactPageContent;
  initialMembers: OrganizationMember[];
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export function ContentManagementTab({
  initialAbout,
  initialHome,
  initialContact,
  initialMembers,
  onShowToast
}: ContentManagementTabProps) {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  React.useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  const canEdit = currentUser?.role === 'superadmin' || currentUser?.permissions?.content?.edit !== false;
  const canCreate = currentUser?.role === 'superadmin' || currentUser?.permissions?.content?.create !== false;
  const canDelete = currentUser?.role === 'superadmin' || currentUser?.permissions?.content?.delete !== false;

  // State for sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<string>('tentang-kami');

  // Form states
  const [aboutForm, setAboutForm] = useState<AboutPageContent>(initialAbout || initialAboutContent);
  const [homeForm, setHomeForm] = useState<HomePageContent>(initialHome || initialHomeContent);
  const [contactForm, setContactForm] = useState<ContactPageContent>(initialContact || initialContactContent);
  const [members, setMembers] = useState<OrganizationMember[]>(initialMembers || initialOrgMembers);

  // Saving states
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingHome, setSavingHome] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  // Modal State for Org Members
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganizationMember | null>(null);
  const [memberForm, setMemberForm] = useState<{
    name: string;
    position: string;
    division: string;
    email: string;
    nip: string;
    photo_url: string;
    order: number;
  }>({
    name: '',
    position: '',
    division: 'Pimpinan Utama SPMI',
    email: '',
    nip: '',
    photo_url: '',
    order: 1
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null);

  // ========================================================
  // SAVE HANDLERS
  // ========================================================
  const handleSaveAbout = async () => {
    setSavingAbout(true);
    const success = await dataService.saveAboutContent(aboutForm);
    setSavingAbout(false);
    if (success) {
      onShowToast('Konten Halaman Tentang Kami berhasil diperbarui!', 'success');
    } else {
      onShowToast('Gagal menyimpan konten Tentang Kami', 'error');
    }
  };

  const handleSaveHome = async () => {
    setSavingHome(true);
    const success = await dataService.saveHomeContent(homeForm);
    setSavingHome(false);
    if (success) {
      onShowToast('Konten Halaman Beranda berhasil diperbarui!', 'success');
    } else {
      onShowToast('Gagal menyimpan konten Beranda', 'error');
    }
  };

  const handleSaveContact = async () => {
    setSavingContact(true);
    const success = await dataService.saveContactContent(contactForm);
    setSavingContact(false);
    if (success) {
      onShowToast('Informasi Kontak & Identitas berhasil diperbarui!', 'success');
    } else {
      onShowToast('Gagal menyimpan informasi kontak', 'error');
    }
  };

  // ========================================================
  // ORG MEMBER HANDLERS
  // ========================================================
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: '',
      position: '',
      division: 'Pimpinan Utama SPMI',
      email: '',
      nip: '',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      order: members.length + 1
    });
    setOrgModalOpen(true);
  };

  const handleOpenEditMember = (member: OrganizationMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      position: member.position,
      division: member.division || 'Pimpinan Utama SPMI',
      email: member.email || '',
      nip: member.nip || '',
      photo_url: member.photo_url || '',
      order: member.order || 1
    });
    setOrgModalOpen(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengurus ini dari struktur organisasi?')) {
      const success = await dataService.deleteOrgMember(id);
      if (success) {
        setMembers(members.filter(m => m.id !== id));
        onShowToast('Pengurus berhasil dihapus dari struktur organisasi', 'success');
      }
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: OrganizationMember = {
      id: editingMember ? editingMember.id : `org-${Date.now()}`,
      name: memberForm.name,
      position: memberForm.position,
      division: memberForm.division,
      email: memberForm.email || undefined,
      nip: memberForm.nip || undefined,
      photo_url: memberForm.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      order: memberForm.order || 1
    };

    const success = await dataService.saveOrgMember(newMember);
    if (success) {
      if (editingMember) {
        setMembers(members.map(m => m.id === newMember.id ? newMember : m).sort((a, b) => a.order - b.order));
        onShowToast('Data pengurus berhasil diperbarui!', 'success');
      } else {
        setMembers([...members, newMember].sort((a, b) => a.order - b.order));
        onShowToast('Pengurus baru berhasil ditambahkan!', 'success');
      }
      setOrgModalOpen(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const result = await dataService.uploadFile(file, 'documents');
    setUploadingPhoto(false);
    if (result?.url) {
      setMemberForm(prev => ({ ...prev, photo_url: result.url }));
      onShowToast('Foto profil berhasil diunggah!', 'success');
    } else {
      onShowToast('Gagal mengunggah foto profil. Pastikan file valid.', 'error');
    }
  };

  // ========================================================
  // ABOUT PAGE DYNAMIC LIST HELPERS
  // ========================================================
  const handleAddMisi = () => {
    setAboutForm(prev => ({ ...prev, misi: [...prev.misi, ''] }));
  };
  const handleRemoveMisi = (index: number) => {
    setAboutForm(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }));
  };
  const handleMisiChange = (index: number, val: string) => {
    const next = [...aboutForm.misi];
    next[index] = val;
    setAboutForm(prev => ({ ...prev, misi: next }));
  };

  const handleAddTujuan = () => {
    setAboutForm(prev => ({ ...prev, tujuan: [...prev.tujuan, ''] }));
  };
  const handleRemoveTujuan = (index: number) => {
    setAboutForm(prev => ({ ...prev, tujuan: prev.tujuan.filter((_, i) => i !== index) }));
  };
  const handleTujuanChange = (index: number, val: string) => {
    const next = [...aboutForm.tujuan];
    next[index] = val;
    setAboutForm(prev => ({ ...prev, tujuan: next }));
  };

  // ========================================================
  // HOME PAGE SLIDER IMAGE HELPERS
  // ========================================================
  const handleAddSlideImage = () => {
    setHomeForm(prev => ({
      ...prev,
      slider_images: [
        ...(prev.slider_images || []),
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000'
      ]
    }));
  };

  const handleResetSlideImages = () => {
    setHomeForm(prev => ({
      ...prev,
      slider_images: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000'
      ]
    }));
    onShowToast('Slide foto banner direset ke gambar standar kampus!', 'success');
  };

  const handleRemoveSlideImage = (index: number) => {
    setHomeForm(prev => ({
      ...prev,
      slider_images: (prev.slider_images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSlideImageChange = (index: number, val: string) => {
    const next = [...(homeForm.slider_images || [])];
    next[index] = val;
    setHomeForm(prev => ({ ...prev, slider_images: next }));
  };

  const handleSlideImageUpload = async (index: number, file: File) => {
    setUploadingSlideIndex(index);
    const result = await dataService.uploadFile(file, 'documents');
    setUploadingSlideIndex(null);
    if (result?.url) {
      handleSlideImageChange(index, result.url);
      onShowToast('Foto slide berhasil diunggah!', 'success');
    } else {
      onShowToast('Gagal mengunggah foto slide. Pastikan berkas berupa gambar.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Sub Tabs Header */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
          <TabsList className="bg-transparent border-0 p-0 gap-2 h-auto flex flex-wrap">
            <TabsTrigger 
              value="tentang-kami" 
              className="text-xs px-3.5 py-2 font-extrabold gap-2 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0_0_#000000] data-[state=active]:bg-yellow-400 data-[state=active]:border-slate-900 data-[state=active]:shadow-[4px_4px_0_0_#000000] cursor-pointer select-none active:translate-y-0.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tentang Kami</span>
            </TabsTrigger>
            <TabsTrigger 
              value="struktur" 
              className="text-xs px-3.5 py-2 font-extrabold gap-2 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0_0_#000000] data-[state=active]:bg-yellow-400 data-[state=active]:border-slate-900 data-[state=active]:shadow-[4px_4px_0_0_#000000] cursor-pointer select-none active:translate-y-0.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Struktur Organisasi</span>
            </TabsTrigger>
            <TabsTrigger 
              value="beranda" 
              className="text-xs px-3.5 py-2 font-extrabold gap-2 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0_0_#000000] data-[state=active]:bg-yellow-400 data-[state=active]:border-slate-900 data-[state=active]:shadow-[4px_4px_0_0_#000000] cursor-pointer select-none active:translate-y-0.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Halaman Beranda</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kontak" 
              className="text-xs px-3.5 py-2 font-extrabold gap-2 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0_0_#000000] data-[state=active]:bg-yellow-400 data-[state=active]:border-slate-900 data-[state=active]:shadow-[4px_4px_0_0_#000000] cursor-pointer select-none active:translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Kontak & Lokasi</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: TENTANG KAMI */}
        {/* ======================================================== */}
        <TabsContent value="tentang-kami" className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Editor Konten Halaman Tentang Kami</h3>
              <p className="text-xs text-slate-500 font-medium">Kelola Visi, Misi, Tujuan, Maklumat Pelayanan, dan Budaya Mutu</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
                className="text-xs border-2 border-slate-900 bg-white hover:bg-yellow-100 text-slate-900 font-extrabold gap-1.5 h-8 shadow-2xs"
              >
                <a href="/tentang-kami" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Halaman</span>
                </a>
              </Button>
              {canEdit && (
                <Button
                  onClick={handleSaveAbout}
                  disabled={savingAbout}
                  size="sm"
                  className="font-extrabold gap-2 h-8 px-4 rounded-xl shadow-md cursor-pointer text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingAbout ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            
            {/* Visi SPMI Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-black" />
                  Visi Lembaga Penjaminan Mutu Internal (SPMI)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">
                  Pernyataan arah dan cita-cita jangka panjang SPMI UNPAL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={3}
                  value={aboutForm.visi}
                  onChange={(e) => setAboutForm({ ...aboutForm, visi: e.target.value })}
                  placeholder="Masukkan pernyataan visi..."
                  className="bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 font-medium text-xs leading-relaxed rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Misi SPMI Card (Dynamic List) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-black" />
                    Misi SPMI Universitas Palembang
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">
                    Daftar misi strategis penjaminan mutu yang dapat ditambah/dikurangi
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={handleAddMisi}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-white border-2 border-slate-900 text-slate-900 hover:bg-yellow-100 gap-1 rounded-lg font-bold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Misi</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {aboutForm.misi.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-yellow-100 border-2 border-slate-900 text-slate-900 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      {idx + 1}
                    </span>
                    <Textarea
                      rows={2}
                      value={m}
                      onChange={(e) => handleMisiChange(idx, e.target.value)}
                      placeholder={`Poin misi ke-${idx + 1}...`}
                      className="bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 font-medium text-xs flex-1 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMisi(idx)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 mt-1 rounded-lg"
                      title="Hapus butir misi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tujuan Mutu Card (Dynamic List) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-black" />
                    Tujuan Strategis Penjaminan Mutu
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">
                    Target pencapaian kepatuhan standar mutu dan akreditasi
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={handleAddTujuan}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-white border-2 border-slate-900 text-slate-900 hover:bg-yellow-100 gap-1 rounded-lg font-bold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah Tujuan</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {aboutForm.tujuan.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-lg bg-yellow-100 border-2 border-slate-900 text-slate-900 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      {idx + 1}
                    </span>
                    <Input
                      value={t}
                      onChange={(e) => handleTujuanChange(idx, e.target.value)}
                      placeholder={`Poin tujuan ke-${idx + 1}...`}
                      className="bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 font-medium text-xs flex-1 h-9 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTujuan(idx)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 rounded-lg"
                      title="Hapus butir tujuan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Maklumat Pelayanan Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-black" />
                  Maklumat Pelayanan Penjaminan Mutu
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">
                  Janji layanan dan standar komitmen pelayanan LPM kepada stakeholder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={3}
                  value={aboutForm.maklumat_pelayanan}
                  onChange={(e) => setAboutForm({ ...aboutForm, maklumat_pelayanan: e.target.value })}
                  placeholder="Masukkan teks maklumat pelayanan..."
                  className="bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-400 font-medium text-xs leading-relaxed rounded-lg"
                />
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 2: STRUKTUR ORGANISASI (CRUD TABLE) */}
        {/* ======================================================== */}
        <TabsContent value="struktur" className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Daftar Pengurus Struktur Organisasi LPM</h3>
              <p className="text-xs text-slate-500 font-medium">Kelola personil pimpinan, koordinator pusat, dan staf pengelola mutu</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
                className="text-xs border-2 border-slate-900 bg-white hover:bg-yellow-100 text-slate-900 font-extrabold gap-1.5 h-8 shadow-2xs"
              >
                <a href="/tentang-kami" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Tab Struktur</span>
                </a>
              </Button>
              {canCreate && (
                <Button
                  onClick={handleOpenAddMember}
                  size="sm"
                  className="font-extrabold gap-1.5 h-8 px-3.5 rounded-xl shadow-md cursor-pointer text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengurus</span>
                </Button>
              )}
            </div>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-slate-900 bg-slate-100">
                  <TableHead className="py-3 px-4 font-black text-slate-900 text-xs text-center w-[8%]">Urutan</TableHead>
                  <TableHead className="py-3 px-4 font-black text-slate-900 text-xs w-[32%]">Nama Lengkap & NIP</TableHead>
                  <TableHead className="py-3 px-4 font-black text-slate-900 text-xs w-[28%]">Jabatan</TableHead>
                  <TableHead className="py-3 px-4 font-black text-slate-900 text-xs w-[20%]">Divisi / Unit</TableHead>
                  <TableHead className="py-3 px-4 font-black text-slate-900 text-xs text-right w-[12%]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-xs text-slate-500 font-medium">
                      Belum ada data struktur organisasi. Klik &quot;Tambah Pengurus&quot; di atas.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => (
                    <TableRow key={member.id} className="border-b border-slate-200 hover:bg-yellow-50/40 transition-colors">
                      <TableCell className="py-3 px-4 text-center">
                        <span className="font-mono text-xs font-black text-slate-900 bg-yellow-50 px-2 py-0.5 rounded-lg border border-slate-900 shadow-2xs">
                          #{member.order}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{member.name}</div>
                        {member.nip && (
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5 font-medium">NIP/NIDN: {member.nip}</div>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-xs font-bold text-slate-800">
                        {member.position}
                      </TableCell>
                      <TableCell className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          {member.division}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditMember(member)}
                              className="h-8 w-8 text-slate-700 hover:text-black hover:bg-yellow-100 rounded-lg cursor-pointer"
                              title="Edit Pengurus"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMember(member.id)}
                              className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Hapus Pengurus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 3: HALAMAN BERANDA */}
        {/* ======================================================== */}
        <TabsContent value="beranda" className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Editor Konten Halaman Beranda (Home)</h3>
              <p className="text-xs text-slate-500 font-medium">Kelola teks banner utama (Hero), 4 kartu statistik capaian, dan banner ajakan</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
                className="text-xs border-2 border-slate-900 bg-white hover:bg-yellow-100 text-slate-900 font-extrabold gap-1.5 h-8 shadow-2xs"
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Beranda</span>
                </a>
              </Button>
              {canEdit && (
                <Button
                  onClick={handleSaveHome}
                  disabled={savingHome}
                  size="sm"
                  className="font-extrabold gap-2 h-8 px-4 rounded-xl shadow-md cursor-pointer text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingHome ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            
            {/* Hero Section Editor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black" />
                  Hero Banner Utama (Atas Beranda)
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 font-semibold">
                  Judul utama dan kalimat pembuka ketika pengunjung pertama kali membuka website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Teks Badge Atas</Label>
                  <Input
                    value={homeForm.hero_badge}
                    onChange={(e) => setHomeForm({ ...homeForm, hero_badge: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 font-medium text-xs h-9 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Judul Baris 1</Label>
                    <Input
                      value={homeForm.hero_title}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_title: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 font-medium text-xs h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Judul Highlight</Label>
                    <Input
                      value={homeForm.hero_title_highlight}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_title_highlight: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 font-medium text-xs h-9 rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Subjudul / Deskripsi Pembuka</Label>
                  <Textarea
                    rows={3}
                    value={homeForm.hero_subtitle}
                    onChange={(e) => setHomeForm({ ...homeForm, hero_subtitle: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 font-medium text-xs leading-relaxed rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Teks Tombol Utama</Label>
                    <Input
                      value={homeForm.hero_cta_primary_text}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_cta_primary_text: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 font-medium text-xs h-9 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Teks Tombol Sekunder</Label>
                    <Input
                      value={homeForm.hero_cta_secondary_text}
                      onChange={(e) => setHomeForm({ ...homeForm, hero_cta_secondary_text: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 font-medium text-xs h-9 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Slide Foto Hero Banner (Image Slider) Editor */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3">
                <div>
                  <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-black" />
                    Slide Foto Banner Beranda (Image Slider)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 font-medium">
                    Kelola foto-foto yang berputar otomatis pada slider hero di halaman depan
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleResetSlideImages}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-slate-100 border-2 border-slate-900 text-slate-700 hover:bg-slate-200 gap-1 rounded-lg font-bold"
                    title="Kembalikan foto slide ke gambar standar bawaan"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset ke Default</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddSlideImage}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs bg-white border-2 border-slate-900 text-slate-900 hover:bg-yellow-100 gap-1 rounded-lg font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Foto Slide</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(homeForm.slider_images && homeForm.slider_images.length > 0 
                  ? homeForm.slider_images 
                  : [
                      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
                      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000'
                    ]
                ).map((imgUrl, idx) => {
                  const isBlobUrl = imgUrl && imgUrl.startsWith('blob:');
                  return (
                    <div key={idx} className={`p-3.5 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-2xs ${isBlobUrl ? 'bg-amber-50/70 border-amber-500' : 'bg-slate-50 border-slate-900'}`}>
                      {/* Thumbnail preview */}
                      <div className="w-20 h-14 rounded-lg overflow-hidden border-2 border-slate-900 shrink-0 bg-slate-200 flex items-center justify-center relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={imgUrl} 
                          alt={`Preview Slide ${idx + 1}`} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=300';
                          }}
                        />
                      </div>

                      <div className="flex-1 space-y-1 min-w-0 w-full">
                        <div className="flex items-center justify-between">
                          <Label className="text-[11px] font-black text-slate-800 font-mono flex items-center gap-2">
                            Slide #{idx + 1}
                            {isBlobUrl && (
                              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-sans font-semibold">
                                ⚠️ URL Sementara (Silakan Upload Ulang atau Simpan)
                              </span>
                            )}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={imgUrl}
                            onChange={(e) => handleSlideImageChange(idx, e.target.value)}
                            placeholder="https://... atau klik Upload"
                            className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-8 flex-1 rounded-lg font-medium"
                          />
                          <label className="cursor-pointer shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleSlideImageUpload(idx, file);
                              }}
                              className="hidden"
                              disabled={uploadingSlideIndex === idx}
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={uploadingSlideIndex === idx}
                              className="h-8 px-2.5 text-xs bg-white border-2 border-slate-900 hover:bg-yellow-100 text-slate-900 gap-1 font-bold rounded-lg"
                              asChild
                            >
                              <span>
                                {uploadingSlideIndex === idx ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5 text-black" />
                                )}
                                <span className="hidden sm:inline">Upload</span>
                              </span>
                            </Button>
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSlideImage(idx)}
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 shrink-0 rounded-lg"
                            title="Hapus foto slide"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* 4 Kartu Statistik Mutu */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-black" />
                  4 Kartu Metrik / Statistik Mutu
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">
                  Angka counter dan penjelasan singkat pada baris statistik beranda
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {homeForm.stats.map((stat, idx) => (
                  <div key={stat.id} className="p-3.5 rounded-xl bg-slate-50 border-2 border-slate-900 space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-800 font-mono">Kartu #{idx + 1}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-100 border border-slate-900 text-slate-900 font-mono font-bold">Ikon: {stat.icon_name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[10px] font-bold text-slate-800">Nilai / Angka</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...homeForm.stats];
                            next[idx].value = e.target.value;
                            setHomeForm({ ...homeForm, stats: next });
                          }}
                          className="bg-white border-2 border-slate-900 text-slate-900 h-8 text-xs font-black font-mono mt-1 rounded-lg"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] font-bold text-slate-800">Judul Metrik</Label>
                        <Input
                          value={stat.title}
                          onChange={(e) => {
                            const next = [...homeForm.stats];
                            next[idx].title = e.target.value;
                            setHomeForm({ ...homeForm, stats: next });
                          }}
                          className="bg-white border-2 border-slate-900 text-slate-900 h-8 text-xs font-black mt-1 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold text-slate-800">Keterangan Singkat</Label>
                      <Input
                        value={stat.description}
                        onChange={(e) => {
                          const next = [...homeForm.stats];
                          next[idx].description = e.target.value;
                          setHomeForm({ ...homeForm, stats: next });
                        }}
                        className="bg-white border-2 border-slate-900 text-slate-900 h-8 text-xs font-medium mt-1 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bottom CTA Banner */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-black" />
                  Banner Bawah (Ajakan Konsultasi Mutu)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Judul Banner</Label>
                  <Input
                    value={homeForm.cta_banner_title}
                    onChange={(e) => setHomeForm({ ...homeForm, cta_banner_title: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Deskripsi Banner</Label>
                  <Textarea
                    rows={2}
                    value={homeForm.cta_banner_desc}
                    onChange={(e) => setHomeForm({ ...homeForm, cta_banner_desc: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs leading-relaxed rounded-lg font-medium"
                  />
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ======================================================== */}
        {/* TAB 4: KONTAK & LOKASI */}
        {/* ======================================================== */}
        <TabsContent value="kontak" className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900">Editor Informasi Kontak & Identitas Kampus</h3>
              <p className="text-xs text-slate-600 font-medium">Kelola alamat kantor LPM, email resmi, nomor telepon/WA, jam kerja, dan Google Maps</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
                className="text-xs border-2 border-slate-900 bg-white hover:bg-yellow-100 text-slate-900 font-extrabold gap-1.5 h-8 shadow-2xs"
              >
                <a href="/kontak" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Preview Kontak</span>
                </a>
              </Button>
              {canEdit && (
                <Button
                  onClick={handleSaveContact}
                  disabled={savingContact}
                  size="sm"
                  className="font-extrabold gap-2 h-8 px-4 rounded-xl shadow-md cursor-pointer text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingContact ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Alamat & Kantor */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-black" />
                  Nama Unit & Alamat Kantor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Nama Lembaga / Kantor</Label>
                  <Input
                    value={contactForm.office_name}
                    onChange={(e) => setContactForm({ ...contactForm, office_name: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Nama Universitas</Label>
                  <Input
                    value={contactForm.institution_name}
                    onChange={(e) => setContactForm({ ...contactForm, institution_name: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Alamat Lengkap</Label>
                  <Textarea
                    rows={2}
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs rounded-lg font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Kota / Kode Pos</Label>
                  <Input
                    value={contactForm.city}
                    onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Kanal Komunikasi & Jam Operasional */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-black" />
                  Kanal Komunikasi & Jam Kerja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Email Resmi</Label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Nomor Telepon Kantor</Label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Nomor WhatsApp Layanan</Label>
                    <Input
                      value={contactForm.whatsapp}
                      onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">Jam Operasional Pelayanan</Label>
                    <Input
                      value={contactForm.operational_hours}
                      onChange={(e) => setContactForm({ ...contactForm, operational_hours: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 rounded-lg font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">Google Maps Embed URL (Iframe)</Label>
                  <Input
                    value={contactForm.google_maps_url}
                    onChange={(e) => setContactForm({ ...contactForm, google_maps_url: e.target.value })}
                    className="bg-white border-2 border-slate-900 text-slate-900 text-xs h-9 font-mono rounded-lg font-medium"
                  />
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>

      {/* Organization Member Add / Edit Modal */}
      <OrgMemberModal
        isOpen={orgModalOpen}
        onClose={() => setOrgModalOpen(false)}
        isEditing={Boolean(editingMember)}
        form={memberForm}
        setForm={setMemberForm}
        onSave={handleSaveMember}
        uploading={uploadingPhoto}
        onPhotoUpload={handlePhotoUpload}
      />

    </div>
  );
}
