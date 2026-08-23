import {
  accreditationsSeed,
  documentsSeed,
  monitoringDataSeed,
  regulationsSeed,
  contactMessagesSeed,
  orgMembersSeed,
  newsItemsSeed,
  pageContentSeed,
  aboutPageContentSeed,
  homePageContentSeed,
  contactPageContentSeed,
  adminUsersSeed
} from './seeds/seed-data';

export const initialAccreditations = accreditationsSeed;
export const initialDocuments = documentsSeed;
export const initialMonitoringData = monitoringDataSeed;
export const initialRegulations = regulationsSeed;
export const initialMessages = contactMessagesSeed;
export const initialOrgMembers = orgMembersSeed;
export const initialNews = newsItemsSeed;
export const initialPageContent = pageContentSeed;
export const initialAboutContent = aboutPageContentSeed;
export const initialHomeContent = homePageContentSeed;
export const initialContactContent = contactPageContentSeed;
export const initialAdminUsers = adminUsersSeed;

export const initialDocumentAccessKeys = [
  {
    id: 'key_1',
    code: 'SPMI-UNPAL-2024',
    label: 'Akses Standar Universitas (Umum)',
    created_at: new Date().toISOString(),
    expires_at: null, // Tanpa batas waktu
    max_uses: null, // Unlimited
    used_count: 5,
    is_active: true,
    created_by: 'Super Admin',
    note: 'Kode akses utama universitas untuk pengujian dan sivitas akademika'
  },
  {
    id: 'key_2',
    code: 'SPMI-ASESOR-2024',
    label: 'Asesor Akreditasi BAN-PT & LAM',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari ke depan
    max_uses: 50,
    used_count: 12,
    is_active: true,
    created_by: 'Super Admin',
    note: 'Diberikan khusus untuk tim Asesor dan Auditor Eksternal'
  }
];
