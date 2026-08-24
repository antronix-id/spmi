'use client';

import React, { useState, useEffect } from 'react';
import { dataService } from '@/lib/supabase';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown,
  ExternalLink,
  Building2,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { initialContactContent } from '@/lib/mock-data';
import { ContactPageContent } from '@/lib/types';

const UNPAL_PIN_EMBED_URL = 'https://maps.google.com/maps?q=-2.992631,104.725786+(Universitas+Palembang)&t=&z=17&ie=UTF8&iwloc=B&output=embed';

const UNPAL_GOOGLE_MAPS_LINK = 'https://www.google.com/maps/place/Universitas+Palembang/@-2.9926311,104.7257862,17z/data=!3m1!4b1!4m6!3m5!1s0x2e3b75e7a9187311:0x6b772c57849e774f!8m2!3d-2.9926311!4d104.7257862!16s%2Fg%2F11b6d05y1m?entry=ttu';

function getMapEmbedUrl(contact: ContactPageContent): string {
  const url = (contact.google_maps_url || '').trim();
  // If user pasted full iframe tag: <iframe src="..." ...>
  if (url.includes('<iframe') && url.includes('src=')) {
    const match = url.match(/src=["']([^"']+)["']/i);
    if (match && match[1]) return match[1];
  }
  // If user explicitly configured a custom map embed URL with pin
  if (url && (url.includes('q=') || url.includes('/maps/embed')) && !url.includes('Dharma+Wanita') && url !== 'https://maps.google.com') {
    if (url.includes('output=embed') && !url.includes('iwloc=')) {
      return `${url}&iwloc=B`;
    }
    return url;
  }
  // Default: Guaranteed drop-pin marker on Universitas Palembang
  return UNPAL_PIN_EMBED_URL;
}

const faqs = [
  {
    q: 'Bagaimana alur pengajuan pendampingan akreditasi untuk program studi?',
    a: 'Ketua Program Studi atau Gugus Kendali Mutu (GKM) Fakultas dapat mengajukan surat permohonan pendampingan ke Lembaga Penjaminan Mutu SPMI minimal 6 bulan sebelum masa berlaku akreditasi berakhir. Tim SPMI akan menugaskan fasilitator akreditasi untuk review LKPS & LED.'
  },
  {
    q: 'Kapan jadwal rutin pelaksanaan Audit Mutu Internal (AMI) Universitas Palembang?',
    a: 'Siklus AMI dilaksanakan secara berkala 1 kali setiap tahun akademik (biasanya pada akhir semester genap, bulan Juni - Juli). Pengumuman jadwal dan unggah instrumen evaluasi diri dilakukan melalui portal SPMI.'
  },
  {
    q: 'Bagaimana mahasiswa atau dosen dapat mengajukan laporan ketidaksesuaian standar mutu?',
    a: 'Sivitas akademika dapat memanfaatkan formulir pengaduan mutu pada halaman ini dengan memilih kategori "Pengaduan Layanan / Konsultasi Mutu". Tim SPMI menjamin kerahasiaan identitas pelapor sesuai SOP penanganan aduan.'
  },
  {
    q: 'Apakah salinan sertifikat dan SK akreditasi legalisir dapat diunduh langsung?',
    a: 'Ya, Anda dapat mengunduh dokumen SK akreditasi pada menu Akreditasi. Untuk legalisir fisik/digital bertanda tangan basah atau barcode resmi, silakan mengajukan permohonan melalui form kontak ini.'
  }
];

export default function KontakPage() {
  const [contactData, setContactData] = useState<ContactPageContent>(initialContactContent);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Pertanyaan Umum' as const,
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadContact() {
      try {
        const data = await dataService.getContactContent();
        if (data) setContactData(data);
      } catch (e) {
        console.warn('Failed to load contact info', e);
      }
    }
    loadContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    try {
      await dataService.sendMessage(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Pertanyaan Umum',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSubmitting(false);
    }
  };

  const fullMapsUrl = contactData.google_maps_url && !contactData.google_maps_url.includes('embed') && !contactData.google_maps_url.includes('<iframe') && contactData.google_maps_url.startsWith('http')
    ? contactData.google_maps_url
    : UNPAL_GOOGLE_MAPS_LINK;

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-100 border-2 border-slate-900 text-slate-900 font-extrabold text-xs shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            <span>Pusat Layanan & Konsultasi Mutu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Hubungi Tim <span className="gradient-text">SPMI UNPAL</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Sampaikan pertanyaan, permohonan konsultasi akreditasi, atau pengaduan layanan penjaminan mutu internal Universitas Palembang.
          </p>
        </div>

        {/* Single Combined Contact Info Card */}
        <Card className="bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#000000] rounded-2xl p-6 sm:p-7 space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x-2 lg:divide-slate-200">
            
            {/* Item 1: Alamat */}
            <div className="flex items-start gap-4 lg:pr-6">
              <div className="w-11 h-11 rounded-2xl bg-yellow-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-2xs shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Alamat Kantor
                </span>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                  {contactData.office_name || 'LPM Universitas Palembang'}
                </h4>
                <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                  {contactData.address}, {contactData.city}
                </p>
              </div>
            </div>

            {/* Item 2: Email */}
            <div className="flex items-start gap-4 lg:px-6">
              <div className="w-11 h-11 rounded-2xl bg-yellow-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-2xs shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Email Resmi
                </span>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                  Surat & Pengaduan
                </h4>
                <a 
                  href={`mailto:${contactData.email}`} 
                  className="text-xs font-bold text-slate-900 hover:text-yellow-600 underline block truncate"
                >
                  {contactData.email}
                </a>
              </div>
            </div>

            {/* Item 3: Telepon / WhatsApp */}
            <div className="flex items-start gap-4 lg:px-6">
              <div className="w-11 h-11 rounded-2xl bg-yellow-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-2xs shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Telepon & WhatsApp
                </span>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                  Layanan Cepat
                </h4>
                <div className="text-xs text-slate-700 font-bold space-y-0.5">
                  <div className="truncate">{contactData.phone}</div>
                  {contactData.whatsapp && (
                    <div className="text-[11px] text-slate-500 font-medium truncate">WA: {contactData.whatsapp}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Item 4: Jam Kerja */}
            <div className="flex items-start gap-4 lg:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-yellow-400 border-2 border-slate-900 text-slate-900 flex items-center justify-center font-black shadow-2xs shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Jam Kerja Kantor
                </span>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                  Operasional Pelayanan
                </h4>
                <p className="text-xs text-slate-700 font-bold leading-relaxed">
                  {contactData.operational_hours}
                </p>
              </div>
            </div>

          </div>
        </Card>

        {/* Main 2-Column Balanced Grid: Form (Left) & Google Maps (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column (6 Cols): Contact Form */}
          <Card className="lg:col-span-6 p-6 sm:p-8 bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#000000] rounded-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-slate-900 font-black shadow-2xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Kirim Pesan / Konsultasi Mutu
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Pesan akan langsung tercatat pada sistem administrator SPMI.
                    </p>
                  </div>
                </div>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border-2 border-slate-900 rounded-2xl text-center space-y-4 shadow-2xs animate-in fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-slate-900 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-base text-slate-900">
                      Pesan Berhasil Terkirim!
                    </h3>
                    <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
                      Terima kasih atas pesan Anda. Tim penjaminan mutu akan menindaklanjuti dan membalas melalui email secepatnya.
                    </p>
                  </div>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-slate-900 font-black text-xs h-9 px-4 rounded-xl shadow-2xs cursor-pointer active:translate-y-0.5"
                    size="sm"
                  >
                    Kirim Pesan Lainnya
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nama */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        required
                        placeholder="Dr. Ahmad Fauzi / Mhs. Rian"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white border-2 border-slate-900 text-slate-900 text-xs sm:text-sm h-10 rounded-xl font-medium focus-visible:ring-0"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">
                        Alamat Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white border-2 border-slate-900 text-slate-900 text-xs sm:text-sm h-10 rounded-xl font-medium focus-visible:ring-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">
                        Nomor HP / WhatsApp
                      </label>
                      <Input
                        type="tel"
                        placeholder="0812xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-white border-2 border-slate-900 text-slate-900 text-xs sm:text-sm h-10 rounded-xl font-medium focus-visible:ring-0"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900">
                        Kategori Layanan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full h-10 px-3 py-2 rounded-xl border-2 border-slate-900 text-xs sm:text-sm font-bold focus:outline-none bg-white text-slate-900 shadow-2xs"
                      >
                        <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                        <option value="Konsultasi Mutu">Konsultasi Akreditasi & Mutu</option>
                        <option value="Pengaduan Layanan">Pengaduan Layanan Akademik</option>
                        <option value="Permohonan Dokumen">Permohonan Dokumen / SK</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  {/* Subjek */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Subjek Pesan <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="Contoh: Permohonan Pendampingan LED Akreditasi"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 text-xs sm:text-sm h-10 rounded-xl font-medium focus-visible:ring-0"
                    />
                  </div>

                  {/* Pesan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Isi Pesan / Kebutuhan <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      rows={4}
                      required
                      placeholder="Tuliskan pesan, pertanyaan, atau permohonan konsultasi Anda secara jelas..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-white border-2 border-slate-900 text-slate-900 text-xs sm:text-sm rounded-xl font-medium focus-visible:ring-0 leading-relaxed"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-slate-900 font-black text-xs sm:text-sm h-11 rounded-xl shadow-[3px_3px_0_0_#000000] cursor-pointer active:translate-y-0.5 gap-2"
                    >
                      <Send className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                      <span>{submitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                    </Button>
                  </div>

                </form>
              )}
            </div>
          </Card>

          {/* Right Column (6 Cols): Interactive Google Maps Card */}
          <Card className="lg:col-span-6 bg-white border-2 border-slate-900 shadow-[6px_6px_0_0_#000000] rounded-2xl overflow-hidden flex flex-col">
            {/* Maps Header Bar */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white border-b-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black border-2 border-slate-900 flex items-center justify-center font-black shadow-2xs shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm sm:text-base text-white tracking-tight">
                    Lokasi Kampus UNPAL
                  </h3>
                  <p className="text-xs text-slate-300 font-medium truncate max-w-[240px] sm:max-w-[280px]">
                    {contactData.address}, {contactData.city}
                  </p>
                </div>
              </div>
              
              <a
                href={fullMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button
                  type="button"
                  size="sm"
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs h-9 px-3.5 rounded-xl border-2 border-slate-900 gap-1.5 shadow-2xs cursor-pointer active:translate-y-0.5"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>

            {/* Interactive Map Iframe Container (fills matching height) */}
            <div className="flex-1 min-h-[380px] sm:min-h-[420px] w-full bg-slate-100 relative">
              <iframe
                title="Peta Lokasi Kampus Universitas Palembang"
                src={getMapEmbedUrl(contactData)}
                className="w-full h-full min-h-[380px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Maps Footer Bar */}
            <div className="p-3.5 bg-slate-50 border-t-2 border-slate-900 text-xs text-slate-700 flex items-center justify-between gap-3 shrink-0">
              <span className="font-bold text-[11px] sm:text-xs text-slate-800 flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse border border-slate-900" />
                <span className="truncate">Kampus Terpadu UNPAL • Gedung Rektorat Lt. 2</span>
              </span>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-yellow-100 border border-slate-900 text-slate-900 shrink-0">
                Peta Terverifikasi
              </span>
            </div>
          </Card>

        </div>

        {/* FAQ Section (Standalone Items with Card Styling) */}
        <div className="space-y-6 max-w-4xl mx-auto pt-4">
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-100 border-2 border-slate-900 text-slate-900 font-extrabold text-xs shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Bantuan & Informasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
              Informasi umum seputar pengajuan akreditasi, jadwal AMI, dan layanan SPMI
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-slate-900 rounded-2xl overflow-hidden shadow-[4px_4px_0_0_#000000] hover:translate-y-[-1px] transition-all duration-150"
                >
                  <Button
                    variant="ghost"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 h-auto text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm text-slate-900 bg-white hover:bg-yellow-50/70 transition-colors rounded-none cursor-pointer select-none"
                  >
                    <span className="leading-snug">{faq.q}</span>
                    <div className="w-7 h-7 rounded-lg bg-yellow-100 border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-2xs">
                      <ChevronDown className={`w-4 h-4 text-slate-900 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </Button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 border-t-2 border-slate-900 font-medium animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
