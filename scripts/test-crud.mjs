import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('Missing Supabase URL or Anon Key!');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function runTests() {
  console.log('🚀 TESTING FULL CRUD ON ALL SUPABASE TABLES WITH CLIENT KEY 🚀\n');
  let passCount = 0;
  let totalCount = 0;

  async function test(name, fn) {
    totalCount++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passCount++;
    } catch (e) {
      console.error(`❌ [FAIL] ${name}:`, e.message || e);
    }
  }

  // 1. Accreditations
  await test('Accreditations CRUD', async () => {
    const id = 'test-accred-' + Date.now();
    const { error: insErr } = await supabase.from('accreditations').upsert({
      id,
      institution_or_program: 'Test Program',
      level: 'S1',
      faculty: 'Fakultas Teknik',
      rating: 'Unggul',
      sk_number: 'SK/TEST/2026',
      decree_date: '2026-01-01',
      expiry_date: '2031-01-01',
      status: 'Aktif',
      accreditation_agency: 'LAM-INFOKOM'
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('accreditations').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read accreditations');

    const { error: delErr } = await supabase.from('accreditations').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 2. Documents
  await test('Documents CRUD', async () => {
    const id = 'test-doc-' + Date.now();
    const { error: insErr } = await supabase.from('documents').upsert({
      id,
      title: 'Test Dokumen Mutu',
      category: 'Standar SPMI',
      document_code: 'STD-TEST-' + Date.now(),
      year: 2026,
      file_url: 'https://example.com/test.pdf'
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('documents').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read documents');

    const { error: delErr } = await supabase.from('documents').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 3. Document Access Keys
  await test('Document Access Keys CRUD', async () => {
    const id = 'test-key-' + Date.now();
    const code = 'TEST-KEY-' + Date.now();
    const { error: insErr } = await supabase.from('document_access_keys').upsert({
      id,
      code,
      label: 'Kunci Pengujian',
      is_active: true
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('document_access_keys').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read access key');

    const { error: delErr } = await supabase.from('document_access_keys').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 4. Monitoring Data
  await test('Monitoring Data CRUD', async () => {
    const id = 'test-mon-' + Date.now();
    const { error: insErr } = await supabase.from('monitoring_data').upsert({
      id,
      standard_name: 'Standar Pengujian Mutu',
      category: 'Pendidikan',
      faculty: 'Fakultas Teknik',
      target_score: 85,
      actual_score: 90,
      achievement_rate: 105.8,
      status: 'Melampaui',
      audit_period: '2025/2026'
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('monitoring_data').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read monitoring data');

    const { error: delErr } = await supabase.from('monitoring_data').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 5. Regulations
  await test('Regulations CRUD', async () => {
    const id = 'test-reg-' + Date.now();
    const { error: insErr } = await supabase.from('regulations').upsert({
      id,
      title: 'Peraturan Pengujian Mutu',
      regulation_number: 'SK/TEST/REG/2026',
      category: 'SK Rektor',
      year: 2026,
      file_url: 'https://example.com/reg.pdf',
      issued_by: 'Rektor'
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('regulations').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read regulations');

    const { error: delErr } = await supabase.from('regulations').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 6. Contact Messages
  await test('Contact Messages CRUD', async () => {
    const id = 'test-msg-' + Date.now();
    const { error: insErr } = await supabase.from('contact_messages').upsert({
      id,
      name: 'Pengirim Test',
      email: 'test@unpal.ac.id',
      category: 'Pertanyaan Umum',
      subject: 'Subject Test',
      message: 'Isi Pesan Test',
      status: 'Baru'
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('contact_messages').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read contact messages');

    const { error: delErr } = await supabase.from('contact_messages').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 7. Pages Content (CMS)
  await test('Pages Content (CMS) CRUD', async () => {
    const id = 'page-test-' + Date.now();
    const slug = 'test-slug-' + Date.now();
    const { error: insErr } = await supabase.from('pages_content').upsert({
      id,
      slug,
      title: 'Halaman Pengujian',
      content: { hello: 'world' }
    }, { onConflict: 'slug' });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('pages_content').select('*').eq('slug', slug).single();
    if (readErr || !readData) throw new Error('Failed to read page content');

    const { error: delErr } = await supabase.from('pages_content').delete().eq('slug', slug);
    if (delErr) throw delErr;
  });

  // 8. Organization Members
  await test('Organization Members CRUD', async () => {
    const id = 'test-org-' + Date.now();
    const { error: insErr } = await supabase.from('org_members').upsert({
      id,
      name: 'Anggota Test',
      position: 'Staf Ahli',
      division: 'Divisi Audit',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      order: 10
    });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('org_members').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read org members');

    const { error: delErr } = await supabase.from('org_members').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  // 9. Users Admin
  await test('Users Admin CRUD', async () => {
    const { randomUUID } = await import('crypto');
    const id = randomUUID();
    const testEmail = 'admin.crud.test@unpal.ac.id';
    const { error: insErr } = await supabase.from('users_admin').upsert({
      id,
      name: 'User Test CRUD',
      full_name: 'User Test CRUD',
      email: testEmail,
      role: 'superadmin',
      faculty: 'SPMI',
      password_hash: 'password123',
      is_active: true
    }, { onConflict: 'id' });
    if (insErr) throw insErr;

    const { data: readData, error: readErr } = await supabase.from('users_admin').select('*').eq('id', id).single();
    if (readErr || !readData) throw new Error('Failed to read users_admin');

    const { error: delErr } = await supabase.from('users_admin').delete().eq('id', id);
    if (delErr) throw delErr;
  });

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passCount}/${totalCount} MODULES FULLY OPERATIONAL WITH SUPABASE!`);
  console.log(`========================================\n`);
}

runTests();
