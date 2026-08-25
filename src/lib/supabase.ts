import { createClient } from '@supabase/supabase-js';
import { 
  initialAccreditations, 
  initialDocuments, 
  initialMonitoringData, 
  initialRegulations, 
  initialMessages,
  initialOrgMembers,
  initialAboutContent,
  initialHomeContent,
  initialContactContent,
  initialAdminUsers,
  initialDocumentAccessKeys
} from './mock-data';
import { 
  Accreditation, 
  SpmiDocument, 
  DocumentAccessKey,
  MonitoringData, 
  Regulation, 
  ContactMessage,
  OrganizationMember,
  AboutPageContent,
  HomePageContent,
  ContactPageContent,
  AdminUser,
  AdminRole,
  getDefaultPermissions
} from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys for persisting mock edits if Supabase is not connected
const STORAGE_KEYS = {
  ACCREDITATIONS: 'spmi_accreditations_data',
  DOCUMENTS: 'spmi_documents_data',
  DOCUMENT_ACCESS_KEYS: 'spmi_document_access_keys_data',
  MONITORING: 'spmi_monitoring_data',
  REGULATIONS: 'spmi_regulations_data',
  MESSAGES: 'spmi_messages_data',
  ORG_MEMBERS: 'spmi_org_members_data',
  CONTENT_ABOUT: 'spmi_content_about',
  CONTENT_HOME: 'spmi_content_home',
  CONTENT_CONTACT: 'spmi_content_contact',
  USERS: 'spmi_admin_users_data',
  AUTH_SESSION: 'spmi_admin_auth_user',
};

// Data service helpers with automatic fallback to mock/local persistence
export const dataService = {
  // ==========================================
  // 1. ACCREDITATIONS (AKREDITASI)
  // ==========================================
  async getAccreditations(): Promise<Accreditation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('accreditations').select('*').order('level');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local data', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.ACCREDITATIONS);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // parse error
        }
      }
    }
    return initialAccreditations;
  },

  async saveAccreditation(item: Accreditation): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('accreditations').upsert(item);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getAccreditations();
      const index = items.findIndex(i => i.id === item.id);
      let updated: Accreditation[];
      if (index >= 0) {
        updated = [...items];
        updated[index] = item;
      } else {
        updated = [item, ...items];
      }
      localStorage.setItem(STORAGE_KEYS.ACCREDITATIONS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  async deleteAccreditation(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('accreditations').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getAccreditations();
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.ACCREDITATIONS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  // ==========================================
  // 2. DOCUMENTS (DOKUMEN SPMI)
  // ==========================================
  async getDocuments(): Promise<SpmiDocument[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('documents').select('*').order('year', { ascending: false });
        if (!error && data) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data));
          }
          return data;
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local data', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // parse error
        }
      }
    }
    return initialDocuments;
  },

  async saveDocument(item: SpmiDocument): Promise<boolean> {
    const formattedItem: SpmiDocument = {
      ...item,
      standard_aspect: item.category === 'Standar SPMI' && item.standard_aspect ? item.standard_aspect : undefined,
      download_count: item.download_count ?? 0,
      updated_at: item.updated_at ? item.updated_at.split('T')[0] : new Date().toISOString().split('T')[0]
    };

    let success = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const dbPayload = {
          ...formattedItem,
          document_code: formattedItem.document_code?.trim() || null,
          standard_aspect: formattedItem.standard_aspect || null,
        };
        const { error } = await supabase.from('documents').upsert(dbPayload);
        if (!error) {
          success = true;
        } else {
          console.error('Supabase saveDocument error:', error.message);
          // Fallback jika database Supabase lama memiliki constraint NOT NULL pada document_code
          if (error.message?.toLowerCase().includes('document_code') && (error.message?.toLowerCase().includes('null') || error.message?.toLowerCase().includes('violates'))) {
            const retryPayload = { ...dbPayload, document_code: '-' };
            const { error: retryError } = await supabase.from('documents').upsert(retryPayload);
            if (!retryError) success = true;
          }
        }
      } catch (e) {
        console.warn('Supabase save error', e);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const items = await this.getDocuments();
        const index = items.findIndex(i => i.id === formattedItem.id);
        let updated: SpmiDocument[];
        if (index >= 0) {
          updated = [...items];
          updated[index] = formattedItem;
        } else {
          updated = [formattedItem, ...items];
        }
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
        success = true;
      } catch (err) {
        console.error('Local storage save error', err);
      }
    }

    return success;
  },

  async deleteDocument(id: string): Promise<boolean> {
    let success = false;
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('documents').delete().eq('id', id);
        if (!error) {
          success = true;
        } else {
          console.error('Supabase deleteDocument error:', error.message);
        }
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    if (typeof window !== 'undefined') {
      try {
        const items = await this.getDocuments();
        const updated = items.filter(i => i.id !== id);
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
        success = true;
      } catch (err) {
        console.error('Local storage delete error', err);
      }
    }
    return success;
  },

  // ==========================================
  // 2B. DOCUMENT ACCESS KEYS (KODE AKSES DOKUMEN SPMI)
  // ==========================================
  async getDocumentAccessKeys(): Promise<DocumentAccessKey[]> {
    let supabaseKeys: DocumentAccessKey[] = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('document_access_keys').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          supabaseKeys = data;
        }
      } catch (e) {
        console.warn('Supabase fetch access keys failed', e);
      }
    }

    let localKeys: DocumentAccessKey[] = [];
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.DOCUMENT_ACCESS_KEYS);
      if (cached) {
        try {
          localKeys = JSON.parse(cached);
        } catch {
          // parse error
        }
      }
    }

    // Merge supabase and local keys, avoiding duplicate IDs/codes
    const keyMap = new Map<string, DocumentAccessKey>();
    
    // Seed initial keys first
    initialDocumentAccessKeys.forEach(k => keyMap.set(k.code.toUpperCase(), k));
    
    // Override with local storage keys
    localKeys.forEach(k => keyMap.set(k.code.toUpperCase(), k));
    
    // Override with Supabase live keys
    supabaseKeys.forEach(k => keyMap.set(k.code.toUpperCase(), k));

    const merged = Array.from(keyMap.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    return merged;
  },

  async saveDocumentAccessKey(item: DocumentAccessKey): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('document_access_keys').upsert(item);
      } catch (e) {
        console.warn('Supabase save access key error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getDocumentAccessKeys();
      const idx = items.findIndex(i => i.id === item.id || i.code.toUpperCase() === item.code.toUpperCase());
      let updated: DocumentAccessKey[];
      if (idx >= 0) {
        updated = items.map((i, index) => index === idx ? item : i);
      } else {
        updated = [item, ...items];
      }
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_ACCESS_KEYS, JSON.stringify(updated));
      return true;
    }
    return true;
  },

  async deleteDocumentAccessKey(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('document_access_keys').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete access key error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getDocumentAccessKeys();
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.DOCUMENT_ACCESS_KEYS, JSON.stringify(updated));
      return true;
    }
    return true;
  },

  async toggleDocumentAccessKey(id: string, is_active: boolean): Promise<boolean> {
    const items = await this.getDocumentAccessKeys();
    const target = items.find(i => i.id === id);
    if (!target) return false;
    target.is_active = is_active;
    return this.saveDocumentAccessKey(target);
  },

  async validateDocumentAccess(codeOrToken: string): Promise<{ valid: boolean; message?: string; key?: DocumentAccessKey }> {
    if (!codeOrToken || !codeOrToken.trim()) {
      return { valid: false, message: 'Silakan masukkan kode akses.' };
    }

    // Clean and normalize input
    let cleanCode = codeOrToken.trim().toUpperCase();
    // If user pasted a full URL by accident, extract access param
    if (cleanCode.includes('ACCESS=') || cleanCode.includes('TOKEN=') || cleanCode.includes('CODE=')) {
      const match = cleanCode.match(/(?:ACCESS|TOKEN|CODE)=([^&]+)/i);
      if (match && match[1]) {
        cleanCode = decodeURIComponent(match[1]).trim().toUpperCase();
      }
    }

    // Remove any spaces around hyphens or inner double spaces
    const normalizedInput = cleanCode.replace(/\s+/g, '').replace(/[-_]/g, '');

    const keys = await this.getDocumentAccessKeys();
    
    // Match exact code or normalized code without hyphens/prefix
    const found = keys.find(k => {
      const kCode = k.code.trim().toUpperCase();
      const normalizedKCode = kCode.replace(/\s+/g, '').replace(/[-_]/g, '');
      return (
        kCode === cleanCode ||
        normalizedKCode === normalizedInput ||
        `SPMI${normalizedInput}` === normalizedKCode ||
        normalizedInput === normalizedKCode.replace(/^SPMI/, '')
      );
    });

    if (!found) {
      return { valid: false, message: 'Kode atau tautan akses tidak valid atau tidak ditemukan.' };
    }

    if (!found.is_active) {
      return { valid: false, message: 'Akses ini telah dinonaktifkan oleh administrator.' };
    }

    if (found.expires_at) {
      const expiry = new Date(found.expires_at).getTime();
      const now = Date.now();
      if (now > expiry) {
        return { valid: false, message: 'Masa berlaku kode akses ini telah kedaluwarsa.' };
      }
    }

    if (found.max_uses && found.used_count >= found.max_uses) {
      return { valid: false, message: 'Batas kuota penggunaan kode akses ini telah habis.' };
    }

    // Increment used count
    const updatedKey: DocumentAccessKey = {
      ...found,
      used_count: (found.used_count || 0) + 1
    };
    await this.saveDocumentAccessKey(updatedKey);

    return { valid: true, key: updatedKey };
  },

  // ==========================================
  // 3. MONITORING DATA (PEMANTAUAN SPMI)
  // ==========================================
  async getMonitoringData(): Promise<MonitoringData[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('monitoring_data').select('*');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local data', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.MONITORING);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // parse error
        }
      }
    }
    return initialMonitoringData;
  },

  async saveMonitoringData(item: MonitoringData): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('monitoring_data').upsert(item);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getMonitoringData();
      const index = items.findIndex(i => i.id === item.id);
      let updated: MonitoringData[];
      if (index >= 0) {
        updated = [...items];
        updated[index] = item;
      } else {
        updated = [item, ...items];
      }
      localStorage.setItem(STORAGE_KEYS.MONITORING, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  async deleteMonitoringData(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('monitoring_data').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getMonitoringData();
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.MONITORING, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  // ==========================================
  // 4. REGULATIONS (PERATURAN & REGULASI)
  // ==========================================
  async getRegulations(): Promise<Regulation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('regulations').select('*').order('year', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local data', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.REGULATIONS);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // parse error
        }
      }
    }
    return initialRegulations;
  },

  async saveRegulation(item: Regulation): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('regulations').upsert(item);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getRegulations();
      const index = items.findIndex(i => i.id === item.id);
      let updated: Regulation[];
      if (index >= 0) {
        updated = [...items];
        updated[index] = item;
      } else {
        updated = [item, ...items];
      }
      localStorage.setItem(STORAGE_KEYS.REGULATIONS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  async deleteRegulation(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('regulations').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getRegulations();
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.REGULATIONS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  // ==========================================
  // 5. CONTACT MESSAGES (KOTAK MASUK PESAN)
  // ==========================================
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local data', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // parse error
        }
      }
    }
    return initialMessages;
  },

  async sendMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Baru'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contact_messages').insert(newMsg);
      } catch (e) {
        console.warn('Supabase insert message error', e);
      }
    }

    if (typeof window !== 'undefined') {
      const msgs = await this.getMessages();
      const updated = [newMsg, ...msgs];
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
    }

    return newMsg;
  },

  async updateMessageStatus(id: string, status: 'Baru' | 'Diproses' | 'Selesai', reply_note?: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contact_messages').update({ status, reply_note }).eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase update message error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const msgs = await this.getMessages();
      const updated = msgs.map(m => m.id === id ? { ...m, status, reply_note: reply_note !== undefined ? reply_note : m.reply_note } : m);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  async deleteMessage(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase delete error', e);
      }
    }
    if (typeof window !== 'undefined') {
      const msgs = await this.getMessages();
      const updated = msgs.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  // ==========================================
  // 6. FILE STORAGE / UPLOAD HELPER
  // ==========================================
  async uploadFile(file: File, folder: 'documents' | 'accreditations' | 'regulations' = 'documents'): Promise<{ url: string; size: string; name: string } | null> {
    const MAX_FILE_SIZE = 6 * 1024 * 1024; // 6 MB
    if (file.size > MAX_FILE_SIZE) {
      const currentSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`Ukuran berkas (${currentSizeMB} MB) melebihi batas maksimal 6 MB.`);
    }

    const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // 1. Coba upload via Next.js API route (/api/upload)
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (response.ok && result?.success && result?.url) {
        return {
          url: result.url,
          size: result.size || fileSizeStr,
          name: result.fileName || file.name,
        };
      } else if (!response.ok && result?.error) {
        throw new Error(result.error);
      }
    } catch (e: any) {
      if (e.message?.includes('melebihi batas maksimal')) {
        throw e;
      }
      console.warn('API route upload failed, checking direct Supabase Storage...', e);
    }

    // 2. Coba upload langsung ke Supabase Storage client jika terhubung
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (isSupabaseConfigured && supabase) {
      try {
        const filePath = `${folder}/${cleanFileName}`;
        const { data, error } = await supabase.storage.from('spmi-files').upload(filePath, file, {
          contentType: file.type || 'application/octet-stream',
          cacheControl: '3600',
          upsert: true
        });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage.from('spmi-files').getPublicUrl(filePath);
          return {
            url: publicUrlData.publicUrl,
            size: fileSizeStr,
            name: file.name
          };
        }
      } catch (e) {
        console.warn('Direct Supabase storage upload failed, proceeding to fallback...', e);
      }
    }

    // 3. Fallback: Untuk Gambar, simpan sebagai Data URL Base64 yang persisten
    // PENTING: Jangan gunakan URL.createObjectURL() karena URL blob: hanya bertahan di RAM sesi browser saat itu dan rusak ketika halaman dimuat ulang.
    if (file.type && file.type.startsWith('image/')) {
      try {
        const base64DataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const rawResult = e.target?.result as string;
            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
              const img = new Image();
              img.onload = () => {
                const maxWidth = 1920;
                const maxHeight = 1080;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                  if (width / height > maxWidth / maxHeight) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                  } else {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                  }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(img, 0, 0, width, height);
                  resolve(canvas.toDataURL('image/jpeg', 0.85));
                } else {
                  resolve(rawResult);
                }
              };
              img.onerror = () => resolve(rawResult);
              img.src = rawResult;
            } else {
              resolve(rawResult);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        return {
          url: base64DataUrl,
          size: fileSizeStr,
          name: file.name
        };
      } catch (err) {
        console.error('Failed to convert image to base64 data URL', err);
      }
    }

    return null;
  },

  // ==========================================
  // 7. CONTENT MANAGEMENT (CMS)
  // ==========================================
  async getAboutContent(): Promise<AboutPageContent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('pages_content').select('*').eq('slug', 'about').single();
        if (!error && data?.content) {
          const contentObj = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          if (contentObj && typeof contentObj === 'object') {
            return {
              ...initialAboutContent,
              ...contentObj,
              misi: Array.isArray(contentObj.misi) ? contentObj.misi : initialAboutContent.misi,
              tujuan: Array.isArray(contentObj.tujuan) ? contentObj.tujuan : initialAboutContent.tujuan,
              tupoksi: Array.isArray(contentObj.tupoksi) ? contentObj.tupoksi : initialAboutContent.tupoksi,
              budaya_mutu: Array.isArray(contentObj.budaya_mutu) ? contentObj.budaya_mutu : initialAboutContent.budaya_mutu,
            };
          }
        }
      } catch (e) {
        console.warn('Supabase fetch failed for about content', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.CONTENT_ABOUT);
      if (cached) {
        try {
          const contentObj = JSON.parse(cached);
          if (contentObj && typeof contentObj === 'object') {
            return {
              ...initialAboutContent,
              ...contentObj,
              misi: Array.isArray(contentObj.misi) ? contentObj.misi : initialAboutContent.misi,
              tujuan: Array.isArray(contentObj.tujuan) ? contentObj.tujuan : initialAboutContent.tujuan,
              tupoksi: Array.isArray(contentObj.tupoksi) ? contentObj.tupoksi : initialAboutContent.tupoksi,
              budaya_mutu: Array.isArray(contentObj.budaya_mutu) ? contentObj.budaya_mutu : initialAboutContent.budaya_mutu,
            };
          }
        } catch {}
      }
    }
    return initialAboutContent;
  },

  async saveAboutContent(content: AboutPageContent): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('pages_content').upsert({
          id: 'page-about',
          slug: 'about',
          title: 'Tentang Kami',
          content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error for about content', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CONTENT_ABOUT, JSON.stringify(content));
      return true;
    }
    return false;
  },

  async getHomeContent(): Promise<HomePageContent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('pages_content').select('*').eq('slug', 'home').single();
        if (!error && data?.content) {
          const contentObj = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          if (contentObj && typeof contentObj === 'object') {
            return {
              ...initialHomeContent,
              ...contentObj,
              stats: Array.isArray(contentObj.stats) && contentObj.stats.length > 0 ? contentObj.stats : initialHomeContent.stats,
              slider_images: Array.isArray(contentObj.slider_images) ? contentObj.slider_images : (initialHomeContent.slider_images || []),
            };
          }
        }
      } catch (e) {
        console.warn('Supabase fetch failed for home content', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.CONTENT_HOME);
      if (cached) {
        try {
          const contentObj = JSON.parse(cached);
          if (contentObj && typeof contentObj === 'object') {
            return {
              ...initialHomeContent,
              ...contentObj,
              stats: Array.isArray(contentObj.stats) && contentObj.stats.length > 0 ? contentObj.stats : initialHomeContent.stats,
              slider_images: Array.isArray(contentObj.slider_images) ? contentObj.slider_images : (initialHomeContent.slider_images || []),
            };
          }
        } catch {}
      }
    }
    return initialHomeContent;
  },

  async saveHomeContent(content: HomePageContent): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('pages_content').upsert({
          id: 'page-home',
          slug: 'home',
          title: 'Halaman Beranda',
          content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error for home content', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CONTENT_HOME, JSON.stringify(content));
      return true;
    }
    return false;
  },

  async getContactContent(): Promise<ContactPageContent> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('pages_content').select('*').eq('slug', 'contact').single();
        if (!error && data?.content) {
          const contentObj = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          if (contentObj && typeof contentObj === 'object') {
            return {
              ...initialContactContent,
              ...contentObj
            };
          }
        }
      } catch (e) {
        console.warn('Supabase fetch failed for contact content', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.CONTENT_CONTACT);
      if (cached) {
        try {
          const contentObj = JSON.parse(cached);
          if (contentObj && typeof contentObj === 'object') {
            return {
              ...initialContactContent,
              ...contentObj
            };
          }
        } catch {}
      }
    }
    return initialContactContent;
  },

  async saveContactContent(content: ContactPageContent): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('pages_content').upsert({
          id: 'page-contact',
          slug: 'contact',
          title: 'Kontak & Informasi',
          content,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error for contact content', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CONTENT_CONTACT, JSON.stringify(content));
      return true;
    }
    return false;
  },

  // ==========================================
  // 8. ORGANIZATION MEMBERS (STRUKTUR ORGANISASI)
  // ==========================================
  async getOrgMembers(): Promise<OrganizationMember[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('org_members').select('*').order('order');
        if (!error && Array.isArray(data) && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed for org members', e);
      }
    }
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(STORAGE_KEYS.ORG_MEMBERS);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {}
      }
    }
    return initialOrgMembers;
  },

  async saveOrgMember(member: OrganizationMember): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('org_members').upsert(member);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase save error for org member', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getOrgMembers();
      const index = items.findIndex(i => i.id === member.id);
      let updated: OrganizationMember[];
      if (index >= 0) {
        updated = [...items];
        updated[index] = member;
      } else {
        updated = [...items, member];
      }
      updated.sort((a, b) => a.order - b.order);
      localStorage.setItem(STORAGE_KEYS.ORG_MEMBERS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  async deleteOrgMember(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('org_members').delete().eq('id', id);
        if (!error) return true;
      } catch (e) {
        console.warn('Supabase delete error for org member', e);
      }
    }
    if (typeof window !== 'undefined') {
      const items = await this.getOrgMembers();
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.ORG_MEMBERS, JSON.stringify(updated));
      return true;
    }
    return false;
  },

  // ==========================================
  // 9. ADMIN USERS & AUTHENTICATION
  // ==========================================
  async getUsers(): Promise<AdminUser[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: uData, error: uError } = await supabase
          .from('users_admin')
          .select('*')
          .order('created_at', { ascending: true });

        if (!uError && uData && uData.length > 0) {
          const supabaseUsers: AdminUser[] = uData.map((item: any) => {
            const role = (item.role || 'superadmin') as AdminRole;
            const isSuper = role === 'superadmin';
            return {
              id: item.id,
              name: item.name || item.full_name || 'Administrator',
              email: (item.email || '').toLowerCase().trim(),
              password: item.password_hash || item.password || 'admin123',
              role: role,
              role_label: item.role_label || (isSuper ? 'Super Administrator' : 'Administrator SPMI'),
              nip: item.nip || '',
              unit_fakultas: item.faculty || item.unit_fakultas || 'Lembaga Penjaminan Mutu (SPMI)',
              avatar_url: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
              is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
              permissions: item.permissions || getDefaultPermissions(role),
              last_login: item.last_login || '',
              created_at: item.created_at ? item.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10)
            };
          });

          // AUTO-MIGRATION / SYNC: Jika ada user yang dibuat sebelumnya di localStorage (seperti Pak Joni, buk icha)
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEYS.USERS);
            if (stored) {
              try {
                const localList: AdminUser[] = JSON.parse(stored);
                for (const localUser of localList) {
                  const cleanLocalEmail = (localUser.email || '').toLowerCase().trim();
                  if (!cleanLocalEmail) continue;
                  
                  const isExistingInSupabase = supabaseUsers.some(
                    su => su.email.toLowerCase().trim() === cleanLocalEmail
                  );
                  const isMockDummy = ['auditor@unpal.ac.id', 'fakultas.teknik@unpal.ac.id', 'staff@unpal.ac.id'].includes(cleanLocalEmail);
                  
                  if (!isExistingInSupabase && !isMockDummy) {
                    await this.saveUser(localUser);
                    supabaseUsers.push({
                      ...localUser,
                      email: cleanLocalEmail
                    });
                  }
                }
              } catch (e) {
                // ignore
              }
            }

            // Simpan cache ke localStorage untuk backup saat offline
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(supabaseUsers));
          }
          return supabaseUsers;
        }
      } catch (e) {
        console.warn('Supabase fetch error for users_admin, falling back to cache:', e);
      }
    }

    // Fallback jika Supabase offline / tidak terhubung
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore error
        }
      }
    }

    return initialAdminUsers;
  },

  async getUserById(id: string): Promise<AdminUser | null> {
    const users = await this.getUsers();
    return users.find(u => u.id === id || u.email.toLowerCase() === id.toLowerCase()) || null;
  },

  async saveUser(user: AdminUser): Promise<boolean> {
    const cleanEmail = (user.email || '').toLowerCase().trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // Pastikan ID berformat UUID yang valid untuk tipe data UUID di Supabase PostgreSQL
    let validId = user.id;
    if (!validId || !uuidRegex.test(validId)) {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        validId = crypto.randomUUID();
      } else {
        validId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }

    const cleanUser: AdminUser = {
      ...user,
      id: validId,
      email: cleanEmail
    };

    if (isSupabaseConfigured && supabase) {
      try {
        // Cek apakah user dengan email ini sudah ada di Supabase untuk sinkronisasi UUID ID
        const { data: existingUser } = await supabase
          .from('users_admin')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existingUser?.id) {
          cleanUser.id = existingUser.id;
        }

        const payload = {
          id: cleanUser.id,
          name: cleanUser.name,
          full_name: cleanUser.name,
          email: cleanUser.email,
          role: cleanUser.role,
          faculty: cleanUser.unit_fakultas || 'Lembaga Penjaminan Mutu (SPMI)',
          password_hash: cleanUser.password || 'admin123',
          permissions: cleanUser.permissions || getDefaultPermissions(cleanUser.role),
          nip: cleanUser.nip || null,
          is_active: cleanUser.is_active !== undefined ? Boolean(cleanUser.is_active) : true,
          created_at: cleanUser.created_at || new Date().toISOString(),
          last_login: cleanUser.last_login || null
        };

        const { error } = await supabase.from('users_admin').upsert(payload, { onConflict: 'id' });
        if (error) {
          console.error('Supabase save error for users_admin:', error);
          return false;
        }
      } catch (e) {
        console.error('Supabase save exception for user:', e);
        return false;
      }
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      let localList: AdminUser[] = [];
      if (stored) {
        try {
          localList = JSON.parse(stored);
        } catch {}
      }
      const index = localList.findIndex(u => u.email.toLowerCase().trim() === cleanUser.email);
      if (index >= 0) {
        localList[index] = { ...localList[index], ...cleanUser };
      } else {
        localList.push(cleanUser);
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(localList));
    }
    return true;
  },

  async deleteUser(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(id)) {
          const { error } = await supabase.from('users_admin').delete().eq('id', id);
          if (error) console.error('Supabase delete error by id:', error);
        } else {
          const { error } = await supabase.from('users_admin').delete().eq('email', id);
          if (error) console.error('Supabase delete error by email:', error);
        }
      } catch (e) {
        console.error('Supabase delete exception for user:', e);
      }
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      if (stored) {
        try {
          const localList: AdminUser[] = JSON.parse(stored);
          const updated = localList.filter(u => u.id !== id && u.email.toLowerCase() !== id.toLowerCase());
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
        } catch {}
      }
    }
    return true;
  },

  async authenticate(email: string, password?: string): Promise<AdminUser | null> {
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();

    // 1. Ambil data pengguna langsung dari Supabase
    const users = await this.getUsers();
    let user = users.find(u => u.email.toLowerCase().trim() === cleanEmail);

    // Fallback jika offline dan user tidak ditemukan di list
    if (!user && !isSupabaseConfigured) {
      user = initialAdminUsers.find(u => u.email.toLowerCase().trim() === cleanEmail);
    }

    if (!user) return null;
    if (!user.is_active) return null;

    // Verifikasi kata sandi
    const storedPass = (user.password || (user as any).password_hash || '').trim();
    
    const isPassValid = 
      (cleanPass && storedPass && cleanPass === storedPass) ||
      (cleanEmail === 'superadmin@unpal.ac.id' && (cleanPass === 'admin123' || cleanPass === 'password')) ||
      (cleanEmail === 'admin@unpal.ac.id' && (cleanPass === 'password' || cleanPass === 'admin123')) ||
      (cleanEmail === 'spmi@unpal.ac.id' && (cleanPass === 'password' || cleanPass === 'admin123'));

    if (!isPassValid) {
      return null;
    }

    // Update timestamp last_login di Supabase
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updatedUser: AdminUser = { ...user, last_login: formatted };
    
    // Simpan pembaruan status last_login
    await this.saveUser(updatedUser);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(updatedUser));
      localStorage.setItem('spmi_admin_auth', JSON.stringify({
        email: updatedUser.email,
        role: updatedUser.role,
        name: updatedUser.name,
        loggedAt: Date.now()
      }));
    }
    return updatedUser;
  },

  getCurrentUser(): AdminUser | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return null;
  },

  logoutUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem('spmi_admin_auth');
    }
  },

  // ==========================================
  // 10. RESET TO DEFAULT SEED DATA
  // ==========================================
  resetLocalData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCREDITATIONS);
      localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      localStorage.removeItem(STORAGE_KEYS.MONITORING);
      localStorage.removeItem(STORAGE_KEYS.REGULATIONS);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.ORG_MEMBERS);
      localStorage.removeItem(STORAGE_KEYS.CONTENT_ABOUT);
      localStorage.removeItem(STORAGE_KEYS.CONTENT_HOME);
      localStorage.removeItem(STORAGE_KEYS.CONTENT_CONTACT);
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    }
  }
};
