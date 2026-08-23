'use client';

import React, { useState, useEffect } from 'react';
import { initialOrgMembers, initialAboutContent } from '@/lib/mock-data';
import { AboutPageContent, OrganizationMember } from '@/lib/types';
import { dataService } from '@/lib/supabase';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  Users, 
  Award, 
  CheckCircle2, 
  FileCheck, 
  HeartHandshake,
  Mail,
  Loader2
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TentangKamiPage() {
  const [aboutData, setAboutData] = useState<AboutPageContent>(initialAboutContent);
  const [orgMembers, setOrgMembers] = useState<OrganizationMember[]>(initialOrgMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [about, members] = await Promise.all([
          dataService.getAboutContent(),
          dataService.getOrgMembers()
        ]);
        if (about) setAboutData(about);
        if (members && members.length > 0) setOrgMembers(members);
      } catch (e) {
        console.warn('Failed to load about data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tentang <span className="gradient-text">SPMI UNPAL</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Mengenal Lembaga Penjaminan Mutu Internal Universitas Palembang, komitmen tata kelola, dan struktur organisasi pengawal standar pendidikan tinggi.
          </p>
        </div>

        {/* Tabs using separated 3D buttons */}
        <div className="mt-8">
          <Tabs defaultValue="visi-misi" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="h-auto p-0 bg-transparent border-0 gap-3 flex flex-wrap justify-center shadow-none">
                <TabsTrigger 
                  value="visi-misi" 
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border-b-4 border-slate-300 bg-white text-slate-800 shadow-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-yellow-600 data-[state=active]:shadow-md hover:bg-yellow-50 transition-all duration-100 cursor-pointer active:translate-y-1 active:border-b-0 select-none"
                >
                  Visi, Misi & Tujuan
                </TabsTrigger>
                <TabsTrigger 
                  value="tupoksi" 
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border-b-4 border-slate-300 bg-white text-slate-800 shadow-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-yellow-600 data-[state=active]:shadow-md hover:bg-yellow-50 transition-all duration-100 cursor-pointer active:translate-y-1 active:border-b-0 select-none"
                >
                  Tugas Pokok & Fungsi
                </TabsTrigger>
                <TabsTrigger 
                  value="struktur" 
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border-b-4 border-slate-300 bg-white text-slate-800 shadow-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-yellow-600 data-[state=active]:shadow-md hover:bg-yellow-50 transition-all duration-100 cursor-pointer active:translate-y-1 active:border-b-0 select-none"
                >
                  Struktur Organisasi
                </TabsTrigger>
                <TabsTrigger 
                  value="layanan" 
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border-b-4 border-slate-300 bg-white text-slate-800 shadow-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black data-[state=active]:border-yellow-600 data-[state=active]:shadow-md hover:bg-yellow-50 transition-all duration-100 cursor-pointer active:translate-y-1 active:border-b-0 select-none"
                >
                  Maklumat Pelayanan
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Visi & Misi */}
            <TabsContent value="visi-misi">
              <div className="space-y-8">
                {/* Visi Card */}
                <Card className="p-8 sm:p-12 space-y-4 bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0_0_#000000]">
                  <div className="space-y-3 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-yellow-400 text-black border-2 border-slate-900 font-extrabold text-xs shadow-xs">
                      <Target className="w-3.5 h-3.5" />
                      <span>VISI SPMI UNIVERSITAS PALEMBANG</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
                      &ldquo;{aboutData.visi}&rdquo;
                    </h2>
                  </div>
                </Card>

                {/* Misi & Tujuan Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Misi Card */}
                  <Card className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center font-bold">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Misi SPMI Universitas Palembang
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm text-slate-800">
                      {aboutData.misi.map((m, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-lg bg-yellow-400 text-black border border-slate-900 font-black flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed font-medium">{m}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Tujuan Strategis */}
                  <Card className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        Tujuan Strategis Mutu
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm text-slate-800">
                      {aboutData.tujuan.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="leading-relaxed font-medium">{t}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Tupoksi */}
            <TabsContent value="tupoksi">
              <Card className="p-8 sm:p-12 space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Tugas Pokok & Fungsi (Tupoksi)
                  </h2>
                  <p className="text-slate-600 text-sm mt-2">
                    Berdasarkan Peraturan Rektor Universitas Palembang tentang Tata Kelola Lembaga Penjaminan Mutu Internal.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aboutData.tupoksi && aboutData.tupoksi.length > 0 ? (
                    aboutData.tupoksi.map((tp, idx) => (
                      <Card key={idx} className="p-6 space-y-3 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center font-bold">
                          {idx === 0 ? <FileCheck className="w-5 h-5" /> : idx === 1 ? <Users className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">{tp.title}</h3>
                        <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                          {tp.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5">
                              <span className="text-yellow-500 font-extrabold">•</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card className="p-6 space-y-3 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center font-bold">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">Pusat Standar Mutu</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Bertugas merancang, mengkaji, dan memutakhirkan seluruh standar SPMI sesuai dengan perkembangan regulasi nasional Dikti.
                        </p>
                      </Card>
                      <Card className="p-6 space-y-3 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center font-bold">
                          <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">Pusat Audit Mutu Internal (AMI)</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Bertugas merencanakan jadwal, menyiapkan instrumen evaluasi diri, melatih auditor internal, dan melaksanakan asesmen AMI.
                        </p>
                      </Card>
                      <Card className="p-6 space-y-3 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200">
                        <div className="w-10 h-10 rounded-xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center font-bold">
                          <Award className="w-5 h-5" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">Pusat Akreditasi & Fasilitasi</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          Bertugas mendampingi tim akreditasi program studi dalam penyusunan LED dan LKPS akreditasi BAN-PT/LAM.
                        </p>
                      </Card>
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Tab 3: Struktur Organisasi */}
            <TabsContent value="struktur">
              <div className="space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Struktur Organisasi SPMI
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Pimpinan dan fungsional penjaminan mutu Universitas Palembang Periode 2023 - 2028.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orgMembers.map((member) => (
                    <Card 
                      key={member.id}
                      className="p-6 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200 flex flex-col items-center text-center space-y-4 group bg-white"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-900 shadow-md group-hover:scale-105 transition-transform bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={member.photo_url} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-600 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-brand-600">
                          {member.position}
                        </p>
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {member.division}
                        </Badge>
                      </div>

                      {member.email && (
                        <div className="pt-2 border-t border-slate-200 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{member.email}</span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: Maklumat Layanan */}
            <TabsContent value="layanan">
              <Card className="p-8 sm:p-12 space-y-8">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-black border-2 border-slate-900 flex items-center justify-center mx-auto shadow-xs">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Maklumat Pelayanan Penjaminan Mutu
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Dengan penuh integritas dan tanggung jawab, kami pimpinan dan staf Lembaga Penjaminan Mutu Internal Universitas Palembang berjanji:
                  </p>
                </div>

                <Card className="max-w-2xl mx-auto p-6 sm:p-8 space-y-4 text-sm text-slate-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{aboutData.maklumat_pelayanan}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">Melaksanakan Audit Mutu Internal dengan standar objektivitas, kerahasiaan data, dan profesionalitas tinggi.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">Merespons setiap aduan mutu, permohonan dokumen legalisir sertifikat akreditasi maksimal 1x24 jam kerja.</span>
                  </div>
                </Card>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

      </div>

    </div>
  );
}
