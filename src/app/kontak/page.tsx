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
  ChevronDown
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { initialContactContent } from '@/lib/mock-data';
import { ContactPageContent } from '@/lib/types';

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

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Tim <span className="gradient-text">SPMI UNPAL</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Sampaikan pertanyaan, permohonan konsultasi akreditasi, atau pengaduan layanan penjaminan mutu internal Universitas Palembang.
          </p>
        </div>

        {/* Main Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Form with shadcn Card */}
          <Card className="lg:col-span-7 p-6 sm:p-10 shadow-soft space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                Kirim Pesan / Konsultasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pesan akan langsung tercatat pada basis data admin SPMI untuk ditindaklanjuti.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-base text-emerald-900">
                  Pesan Berhasil Terkirim!
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Terima kasih telah menghubungi kami. Tim penjaminan mutu akan merespons pesan Anda melalui email sesegera mungkin.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
                    <label className="text-xs font-bold text-slate-700">
                      Nama Lengkap *
                    </label>
                    <Input
                      type="text"
                      required
                      placeholder="Contoh: Dr. Ahmad Fauzi / Mhs. Rian"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Alamat Email *
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Nomor Telepon / WhatsApp
                    </label>
                    <Input
                      type="tel"
                      placeholder="0812xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Kategori Pesan *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
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
                  <label className="text-xs font-bold text-slate-700">
                    Subjek / Judul Pesan *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Contoh: Permohonan Pendampingan LED Akreditasi"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                {/* Pesan with shadcn Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Isi Pesan / Pertanyaan *
                  </label>
                  <Textarea
                    rows={4}
                    required
                    placeholder="Tuliskan secara rinci pesan, kebutuhan, atau aduan Anda..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Send className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  <span>{submitting ? 'Mengirim...' : 'Kirim Pesan Sekarang'}</span>
                </Button>

              </form>
            )}
          </Card>

          {/* Right Column: Office Location & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Box with shadcn Card */}
            <Card className="p-6 sm:p-8 shadow-soft space-y-5">
              <h3 className="font-extrabold text-lg text-slate-900">
                {contactData.office_name || 'Kantor SPMI Universitas Palembang'}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Alamat Kampus:</span>
                    <span>{contactData.address}, {contactData.city}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Email Resmi:</span>
                    <a href={`mailto:${contactData.email}`} className="text-brand-600 hover:underline">
                      {contactData.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Telepon / WhatsApp:</span>
                    <span>{contactData.phone} {contactData.whatsapp ? `• WA: ${contactData.whatsapp}` : ''}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Jam Operasional Layanan:</span>
                    <span>{contactData.operational_hours}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map Simulation */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white text-center space-y-3 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-sky-400">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white">Lokasi Kampus UNPAL</h4>
              <p className="text-xs text-slate-300">
                {contactData.address}, {contactData.city}
              </p>
              <div className="pt-2">
                <a
                  href={contactData.google_maps_url || 'https://maps.google.com/?q=Universitas+Palembang'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <span>Buka di Google Maps</span>
                  </Button>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* FAQ Accordion Section */}
        <Card className="p-6 sm:p-10 shadow-soft space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                >
                  <Button
                    variant="ghost"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 h-auto text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 bg-slate-50/50 hover:bg-slate-100/60 transition-colors rounded-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                  </Button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}
