export type SpmiStandardAspect = 
  | 'Non-Aspek'
  | 'Pendidikan'
  | 'Penelitian'
  | 'Pengabdian pada Masyarakat'
  | 'Organisasi'
  | 'Kemahasiswaan'
  | 'Sumber Daya Manusia'
  | 'Sarana Prasarana'
  | 'Keuangan'
  | 'Kerja Sama'
  | 'Kesejahteraan';

export interface Accreditation {
  id: string;
  institution_or_program: string;
  level: 'D3' | 'S1' | 'S2' | 'S3' | 'Profesi' | 'Institusi';
  faculty?: string;
  rating: 'Unggul' | 'Baik Sekali' | 'Baik' | 'A' | 'B' | 'C' | 'Terakreditasi';
  sk_number: string;
  decree_date?: string; // Tanggal Penetapan SK
  expiry_date: string;
  status: 'Aktif' | 'Proses Reakreditasi' | 'Kedaluwarsa';
  accreditation_agency: 'BAN-PT' | 'LAMEMBA' | 'LAM-INFOKOM' | 'LAM-PTKes' | 'LAM-TEKNIK' | 'LAMDIK';
  certificate_url?: string;
}

export interface SpmiDocument {
  id: string;
  title: string;
  category: 'Kebijakan SPMI' | 'Manual Mutu' | 'Standar SPMI' | 'Formulir Mutu' | 'Laporan AMI' | 'Dokumen RTM';
  standard_aspect?: SpmiStandardAspect;
  document_code: string;
  year: number;
  description: string;
  file_url: string;
  file_size?: string;
  download_count?: number;
  updated_at: string;
}

export interface DocumentAccessKey {
  id: string;
  code: string;
  label: string;
  created_at: string;
  expires_at: string | null; // ISO string or null for never expires
  max_uses: number | null; // null = unlimited
  used_count: number;
  is_active: boolean;
  created_by?: string;
  note?: string;
}

export interface MonitoringData {
  id: string;
  standard_name: string;
  category: SpmiStandardAspect;
  faculty: string;
  study_program?: string;
  target_score: number;
  actual_score: number;
  achievement_rate: number; // percentage
  status: 'Tercapai' | 'Melampaui' | 'Belum Tercapai';
  audit_period: string; // e.g. "2023/2024 Genap"
  findings_count: number;
  resolved_findings: number;
}

export interface Regulation {
  id: string;
  title: string;
  regulation_number: string;
  category: 'Undang-Undang' | 'Permendikbudristek' | 'SN-Dikti' | 'SK Rektor' | 'Pedoman SPMI';
  year: number;
  description: string;
  file_url: string;
  issued_by: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  category: 'Pertanyaan Umum' | 'Konsultasi Mutu' | 'Pengaduan Layanan' | 'Permohonan Dokumen' | 'Lainnya';
  subject: string;
  message: string;
  created_at: string;
  status: 'Baru' | 'Diproses' | 'Selesai';
  reply_note?: string;
}

export interface PageContent {
  id: string;
  slug: 'visi-misi' | 'struktur-organisasi' | 'tupoksi' | 'layanan' | 'tentang-kami';
  title: string;
  subtitle?: string;
  content: any;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  division: string;
  email?: string;
  photo_url: string;
  nip?: string;
  order: number;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image_url: string;
  read_time: string;
}

export interface AboutPageContent {
  visi: string;
  misi: string[];
  tujuan: string[];
  tupoksi: { title: string; points: string[] }[];
  maklumat_pelayanan: string;
  budaya_mutu: { title: string; desc: string }[];
}

export interface HomeStatCard {
  id: number;
  title: string;
  value: string;
  description: string;
  icon_name: 'Award' | 'FileText' | 'Users' | 'BarChart3';
  bgColor: string;
}

export interface HomePageContent {
  hero_badge: string;
  hero_title: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_cta_primary_text: string;
  hero_cta_secondary_text: string;
  slider_images?: string[];
  stats: HomeStatCard[];
  cta_banner_title: string;
  cta_banner_desc: string;
}

export interface ContactPageContent {
  office_name: string;
  institution_name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  whatsapp: string;
  operational_hours: string;
  google_maps_url: string;
  social_facebook?: string;
  social_instagram?: string;
  social_youtube?: string;
}

export type AdminRole = 'superadmin' | 'admin_spmi' | 'auditor' | 'pimpinan';

export type AdminModuleKey = 
  | 'overview' 
  | 'documents' 
  | 'accreditations' 
  | 'monitoring' 
  | 'regulations' 
  | 'messages' 
  | 'content' 
  | 'users';

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export type UserPermissions = Record<AdminModuleKey, ModulePermission>;

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  role_label: string;
  nip?: string;
  unit_fakultas?: string;
  avatar_url?: string;
  is_active: boolean;
  permissions?: UserPermissions;
  last_login?: string;
  created_at: string;
}

export const ALL_MODULE_KEYS: { id: AdminModuleKey; label: string; desc: string }[] = [
  { id: 'overview', label: 'Ringkasan Eksekutif', desc: 'Dashboard analitik & performa mutu' },
  { id: 'documents', label: 'Dokumen SPMI', desc: 'Repositori 10 Standar & Dokumen Mutu' },
  { id: 'accreditations', label: 'Akreditasi BAN/LAM', desc: 'Status peringkat & masa berlaku akreditasi' },
  { id: 'monitoring', label: 'Pemantauan Mutu (AMI)', desc: 'Audit mutu internal & skor PPEPP' },
  { id: 'regulations', label: 'Peraturan & Regulasi', desc: 'Direktori payung hukum & regulasi Dikti' },
  { id: 'messages', label: 'Kotak Masuk Publik', desc: 'Pesan, pertanyaan & aduan layanan' },
  { id: 'content', label: 'Konten Publik (CMS)', desc: 'CMS Tentang Kami, Beranda, Kontak' },
  { id: 'users', label: 'Manajemen Pengguna', desc: 'Pengelolaan akun staf & hak akses' }
];

export function getDefaultPermissions(role: AdminRole): UserPermissions {
  if (role === 'superadmin') {
    return {
      overview: { view: true, create: true, edit: true, delete: true },
      documents: { view: true, create: true, edit: true, delete: true },
      accreditations: { view: true, create: true, edit: true, delete: true },
      monitoring: { view: true, create: true, edit: true, delete: true },
      regulations: { view: true, create: true, edit: true, delete: true },
      messages: { view: true, create: true, edit: true, delete: true },
      content: { view: true, create: true, edit: true, delete: true },
      users: { view: true, create: true, edit: true, delete: true }
    };
  }

  if (role === 'admin_spmi') {
    return {
      overview: { view: true, create: false, edit: false, delete: false },
      documents: { view: true, create: true, edit: true, delete: true },
      accreditations: { view: true, create: true, edit: true, delete: true },
      monitoring: { view: true, create: true, edit: true, delete: false },
      regulations: { view: true, create: true, edit: true, delete: true },
      messages: { view: true, create: false, edit: true, delete: true },
      content: { view: true, create: true, edit: true, delete: false },
      users: { view: false, create: false, edit: false, delete: false }
    };
  }

  if (role === 'auditor') {
    return {
      overview: { view: true, create: false, edit: false, delete: false },
      documents: { view: true, create: false, edit: false, delete: false },
      accreditations: { view: true, create: false, edit: false, delete: false },
      monitoring: { view: true, create: true, edit: true, delete: false },
      regulations: { view: true, create: false, edit: false, delete: false },
      messages: { view: false, create: false, edit: false, delete: false },
      content: { view: false, create: false, edit: false, delete: false },
      users: { view: false, create: false, edit: false, delete: false }
    };
  }

  // pimpinan (read-only view for reports)
  return {
    overview: { view: true, create: false, edit: false, delete: false },
    documents: { view: true, create: false, edit: false, delete: false },
    accreditations: { view: true, create: false, edit: false, delete: false },
    monitoring: { view: true, create: false, edit: false, delete: false },
    regulations: { view: true, create: false, edit: false, delete: false },
    messages: { view: false, create: false, edit: false, delete: false },
    content: { view: false, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false }
  };
}
