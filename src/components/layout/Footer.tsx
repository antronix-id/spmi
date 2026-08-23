'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  ExternalLink, 
  ChevronRight,
  Award,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { initialContactContent } from '@/lib/mock-data';
import { ContactPageContent } from '@/lib/types';

export default function Footer() {
  const [contact, setContact] = useState<ContactPageContent>(initialContactContent);

  useEffect(() => {
    async function load() {
      try {
        const data = await dataService.getContactContent();
        if (data) setContact(data);
      } catch (e) {
        console.warn('Failed to load footer contact info', e);
      }
    }
    load();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-white via-yellow-50/60 to-yellow-100/90 text-slate-800 pt-16 pb-10 border-t-2 border-slate-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b-2 border-slate-900/10">
          
          {/* Col 1: About SPMI */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 relative flex items-center justify-center shrink-0 rounded-2xl bg-yellow-100 border-2 border-slate-900 p-1.5 shadow-[2px_2px_0_0_#000000]">
                <Image 
                  src="/unpal.avif" 
                  alt="Logo Universitas Palembang" 
                  width={40} 
                  height={40} 
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 leading-none block">
                  SPMI UNPAL
                </span>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  {contact.institution_name || 'Universitas Palembang'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Lembaga Penjaminan Mutu Internal Universitas Palembang berkomitmen mengawal tercapainya mutu pendidikan tinggi yang unggul, berdaya saing, dan berkelanjutan melalui siklus PPEPP.
            </p>
          </div>

          {/* Col 2: Navigasi Cepat */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-slate-900"></span>
              Navigasi Utama
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Beranda SPMI</span>
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Visi, Misi & Struktur</span>
                </Link>
              </li>
              <li>
                <Link href="/akreditasi" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Status Akreditasi Prodi</span>
                </Link>
              </li>
              <li>
                <Link href="/spmi/pemantauan" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Dashboard Pemantauan AMI</span>
                </Link>
              </li>
              <li>
                <Link href="/spmi/dokumen" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Repositori Dokumen Mutu</span>
                </Link>
              </li>
              <li>
                <Link href="/peraturan" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Direktori Regulasi SN-Dikti</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dokumen & Regulasi Penting */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-slate-900"></span>
              Dokumen Mutu Kunci
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/spmi/dokumen" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Buku Kebijakan SPMI 2023</span>
                </Link>
              </li>
              <li>
                <Link href="/spmi/dokumen" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Manual Mutu Standar PPEPP</span>
                </Link>
              </li>
              <li>
                <Link href="/spmi/dokumen" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Standar Pendidikan & Riset</span>
                </Link>
              </li>
              <li>
                <Link href="/spmi/dokumen" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Instrumen Formulir AMI 2024</span>
                </Link>
              </li>
              <li>
                <Link href="/peraturan" className="font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1.5 group hover:translate-x-0.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-black transition-colors" />
                  <span>Permendikbudristek No. 53/2023</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi Kontak */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-slate-900"></span>
              Kontak & Layanan
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <span>{contact.address}, {contact.city}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700 font-medium">
                <Mail className="w-4 h-4 text-slate-900 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-black font-bold transition-colors">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700 font-medium">
                <Phone className="w-4 h-4 text-slate-900 shrink-0" />
                <span>{contact.phone} {contact.whatsapp ? `• WA: ${contact.whatsapp}` : ''}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-slate-900 shrink-0" />
                <span>{contact.operational_hours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} Sistem Penjaminan Mutu Internal (SPMI) {contact.institution_name || 'Universitas Palembang'}. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kontak" className="hover:text-black font-bold transition-colors">
              Pusat Bantuan & Pengaduan
            </Link>
            <Link 
              href="/admin/login" 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-400 text-black font-black border-2 border-slate-900 hover:bg-yellow-300 transition-all shadow-[2px_2px_0_0_#000000] active:translate-y-0.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Staf Admin</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
