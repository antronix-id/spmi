'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import PpeppCycle from '@/components/home/PpeppCycle';
import Link from 'next/link';
import { 
  Award, 
  HelpCircle, 
  ArrowRight
} from 'lucide-react';
import { initialAccreditations, initialHomeContent } from '@/lib/mock-data';
import { dataService } from '@/lib/supabase';
import { Accreditation, HomePageContent } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [accreditations, setAccreditations] = useState<Accreditation[]>(initialAccreditations);
  const [homeContent, setHomeContent] = useState<HomePageContent>(initialHomeContent);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [accreds, home] = await Promise.all([
          dataService.getAccreditations(),
          dataService.getHomeContent()
        ]);
        if (accreds && accreds.length > 0) setAccreditations(accreds);
        if (home) setHomeContent(home);
      } catch (err) {
        console.warn('Failed to load dynamic data for home page', err);
      }
    }
    loadLiveData();
  }, []);

  const featuredAccred = accreditations.slice(0, 4);

  return (
    <div className="space-y-0">
      
      {/* Hero Section with Image Slider */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* PPEPP SPMI Interactive Cycle */}
      <PpeppCycle />

      {/* Accreditation Preview Banner */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>Akreditasi BAN-PT & LAM</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Status Akreditasi Universitas Palembang
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Universitas Palembang berkomitmen menjaga mutu berkelanjutan melalui akreditasi berkala oleh BAN-PT dan Lembaga Akreditasi Mandiri (LAM).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/akreditasi">
                    <Button className="gap-2 cursor-pointer">
                      <Award className="w-4 h-4" />
                      <span>Daftar Akreditasi Lengkap ({accreditations.length})</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/kontak">
                    <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 cursor-pointer">
                      <span>Permohonan Sertifikat</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mini accreditation table preview */}
              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-2 border-b border-white/10 flex justify-between items-center">
                  <span>Program Studi Unggulan</span>
                  <span className="text-emerald-400 font-mono">Peringkat</span>
                </div>
                {featuredAccred.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 text-xs">
                    <div>
                      <div className="font-bold text-white">{item.institution_or_program}</div>
                      <div className="text-[11px] text-slate-400">{item.level} - {item.accreditation_agency}</div>
                    </div>
                    <Badge 
                      variant={item.rating === 'Unggul' ? 'emerald' : 'brand'}
                      className="text-[10px] font-bold"
                    >
                      {item.rating}
                    </Badge>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-transparent border-t border-slate-200/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white mx-auto flex items-center justify-center shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {homeContent.cta_banner_title || 'Butuh Bantuan atau Konsultasi Penjaminan Mutu?'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            {homeContent.cta_banner_desc || 'Tim SPMI Universitas Palembang siap mendampingi program studi dan unit kerja dalam persiapan akreditasi, audit internal, maupun penyusunan dokumen mutu.'}
          </p>
          <div className="pt-2">
            <Link href="/kontak">
              <Button size="lg" className="gap-2 cursor-pointer">
                <span>Hubungi Tim SPMI</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
