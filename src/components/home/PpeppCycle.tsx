'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Layers, 
  PlayCircle, 
  Search, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    step: 'P',
    title: 'Penetapan Standar',
    subtitle: 'Tahap 1: Perumusan & Penetapan Mutu',
    description: 'Proses perumusan, penetapan kebijakan SPMI, manual mutu, dan standar mutu pendidikan tinggi oleh Senat dan Rektor Universitas Palembang.',
    points: [
      'Penyusunan standar kompetensi lulusan, riset, dan pengabdian',
      'Penyelarasan dengan SN-Dikti & BAN-PT/LAM',
      'Penetapan target Indikator Kinerja Utama (IKU)'
    ],
    icon: Layers,
  },
  {
    step: 'P',
    title: 'Pelaksanaan Standar',
    subtitle: 'Tahap 2: Implementasi & Operasionalisasi',
    description: 'Seluruh fakultas, program studi, biro, dan unit kerja melaksanakan standar mutu dalam kegiatan tridharma dan tata kelola harian.',
    points: [
      'Pelaksanaan kurikulum berbasis OBE (Outcome-Based Education)',
      'Pengelolaan riset dosen dan keterlibatan mahasiswa',
      'Penyediaan sarana, prasarana, dan layanan akademik prima'
    ],
    icon: PlayCircle,
  },
  {
    step: 'E',
    title: 'Evaluasi Standar',
    subtitle: 'Tahap 3: Audit Mutu Internal (AMI)',
    description: 'Penilaian ketercapaian dan kepatuhan standar melalui Audit Mutu Internal (AMI), evaluasi diri (LED), dan survei kepuasan berkala.',
    points: [
      'Asesmen lapangan oleh auditor internal bersertifikat',
      'Identifikasi Kesesuaian & Ketidaksesuaian (KTS/OB)',
      'Survei kepuasan mahasiswa, dosen, dan mitra industri'
    ],
    icon: Search,
  },
  {
    step: 'P',
    title: 'Pengendalian Standar',
    subtitle: 'Tahap 4: Tindak Lanjut & RTM',
    description: 'Menganalisis penyebab deviasi atau kegagalan pencapaian standar melalui Rapat Tinjauan Manajemen (RTM) bersama pimpinan.',
    points: [
      'Penyusunan Rencana Tindak Koreksi (RTK)',
      'Rapat Tinjauan Manajemen (RTM) tingkat universitas & fakultas',
      'Monitoring perbaikan temuan audit'
    ],
    icon: ShieldAlert,
  },
  {
    step: 'P',
    title: 'Peningkatan Standar',
    subtitle: 'Tahap 5: Kaizen / Peningkatan Berkelanjutan',
    description: 'Menaikkan atau meningkatkan standar mutu yang telah tercapai secara berkala (Continuous Quality Improvement) menuju standar internasional.',
    points: [
      'Benchmarking ke perguruan tinggi unggul bereputasi',
      'Peningkatan target indikator kinerja (IKU/IKT)',
      'Penyesuaian terhadap perkembangan regulasi mutakhir'
    ],
    icon: TrendingUp,
  }
];

export default function PpeppCycle() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Siklus <span className="text-brand-600">PPEPP</span> Universitas Palembang
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Menjamin siklus perbaikan mutu yang berkesinambungan (Kaizen) melalui 5 tahapan terstruktur sesuai amanat Undang-Undang Dikti & SN-Dikti.
          </p>
        </div>

        {/* Step Buttons / Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl text-left transition-all duration-100 flex flex-col justify-between items-stretch cursor-pointer select-none border-b-4 active:translate-y-1 active:border-b-0 ${
                  isSelected
                    ? 'bg-yellow-400 text-black border-yellow-600 shadow-md ring-2 ring-yellow-400/50'
                    : 'bg-white/90 hover:bg-yellow-50/50 border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                    isSelected ? 'bg-black text-yellow-400 shadow-xs' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-black font-bold' : 'text-slate-400'}`} />
                </div>
                <div>
                  <div className={`text-xs font-black uppercase tracking-wide ${isSelected ? 'text-black/70' : 'text-slate-400'}`}>Tahap {idx + 1}</div>
                  <div className={`text-sm font-black truncate ${isSelected ? 'text-black' : 'text-slate-800'}`}>
                    {item.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <Card className="p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Detail */}
            <div className="lg:col-span-7 space-y-5">
              <Badge variant="brand" className="text-xs font-bold">
                {steps[activeStep].subtitle}
              </Badge>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {steps[activeStep].title}
              </h3>

              <p className="text-slate-600 text-base leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Aktivitas & Fokus Utama:
                </div>
                {steps[activeStep].points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link href="/spmi/dokumen">
                  <Button className="gap-2">
                    <span>Lihat Dokumen Terkait</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/spmi/pemantauan">
                  <Button variant="secondary">
                    <span>Hasil Evaluasi</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Graphic Representation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-gradient-to-tr from-slate-900 to-brand-950 p-7 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-sky-300">Siklus PPEPP #{activeStep + 1}</span>
                    <Badge variant="outline" className="border-white/20 text-slate-200">
                      Standard Quality
                    </Badge>
                  </div>

                  <div className="py-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-3 shadow-inner">
                      {React.createElement(steps[activeStep].icon, { className: 'w-10 h-10 text-sky-400' })}
                    </div>
                    <div className="text-xl font-extrabold text-white">
                      {steps[activeStep].title}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Universitas Palembang
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Selalu dikaji dan dimutakhirkan secara periodik tiap tahun akademik.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Card>

      </div>
    </section>
  );
}
