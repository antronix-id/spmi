'use client';

import React from 'react';
import { 
  FileText, 
  Award, 
  Activity, 
  Scale, 
  ArrowUpRight
} from 'lucide-react';
import { 
  SpmiDocument, 
  Accreditation, 
  MonitoringData, 
  Regulation, 
  ContactMessage,
  SpmiStandardAspect
} from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AdminTab } from './AdminSidebar';

interface AdminOverviewTabProps {
  documents: SpmiDocument[];
  accreditations: Accreditation[];
  monitoring: MonitoringData[];
  regulations: Regulation[];
  messages: ContactMessage[];
  usersCount?: number;
  membersCount?: number;
  setActiveTab: (tab: AdminTab) => void;
  onOpenAddDoc: () => void;
  onOpenAddAccred: () => void;
  onOpenAddMon: () => void;
  onOpenAddReg: () => void;
}

export function AdminOverviewTab({
  documents,
  accreditations,
  monitoring,
  regulations,
  messages,
  usersCount = 4,
  membersCount = 6,
  setActiveTab,
  onOpenAddDoc,
  onOpenAddAccred,
  onOpenAddMon,
  onOpenAddReg
}: AdminOverviewTabProps) {
  
  // Calculate Key Statistics
  const totalDocs = documents.length;
  const standardDocsCount = documents.filter(d => d.category === 'Standar SPMI').length;
  
  const unggulAccreds = accreditations.filter(a => a.rating === 'Unggul' || a.rating === 'A').length;
  const baikSekaliAccreds = accreditations.filter(a => a.rating === 'Baik Sekali').length;
  
  const avgAchievement = monitoring.length > 0
    ? Math.round(monitoring.reduce((acc, curr) => acc + curr.achievement_rate, 0) / monitoring.length)
    : 92;

  const melampauiCount = monitoring.filter(m => m.status === 'Melampaui').length;
  const tercapaiCount = monitoring.filter(m => m.status === 'Tercapai').length;

  const totalFindings = monitoring.reduce((a, c) => a + (c.findings_count || 0), 0);
  const resolvedFindings = monitoring.reduce((a, c) => a + (c.resolved_findings || 0), 0);

  const standardAspects: SpmiStandardAspect[] = [
    'Pendidikan',
    'Penelitian',
    'Pengabdian pada Masyarakat',
    'Organisasi',
    'Kemahasiswaan',
    'Sumber Daya Manusia',
    'Sarana Prasarana',
    'Keuangan',
    'Kerja Sama',
    'Kesejahteraan'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Dokumen SPMI */}
        <Card 
          className="p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all cursor-pointer group"
          onClick={() => setActiveTab('documents')}
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-black group-hover:scale-105 transition-transform font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 tracking-tight">{totalDocs}</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Total Dokumen SPMI</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <span>{standardDocsCount} Standar SPMI</span>
              <span>•</span>
              <span>{totalDocs - standardDocsCount} SOP/Laporan</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Akreditasi */}
        <Card 
          className="p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all cursor-pointer group"
          onClick={() => setActiveTab('accreditations')}
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-black group-hover:scale-105 transition-transform font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 tracking-tight">100%</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Terakreditasi BAN/LAM</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-extrabold">{unggulAccreds} Unggul/A</span>
              <span>•</span>
              <span>{baikSekaliAccreds} Baik Sekali</span>
            </div>
          </div>
        </Card>

        {/* Card 3: Evaluasi Mutu (AMI) */}
        <Card 
          className="p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all cursor-pointer group"
          onClick={() => setActiveTab('monitoring')}
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-black group-hover:scale-105 transition-transform font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 tracking-tight">{avgAchievement}%</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Rata-rata Skor Capaian</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <span>{melampauiCount} Melampaui</span>
              <span>•</span>
              <span>{tercapaiCount} Tercapai</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Regulasi */}
        <Card 
          className="p-5 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all cursor-pointer group"
          onClick={() => setActiveTab('regulations')}
        >
          <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-slate-900 flex items-center justify-center text-black group-hover:scale-105 transition-transform font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 tracking-tight">{regulations.length}</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">Peraturan & Payung Hukum</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1">
              <span>UU, Permendikbud & SK Rektor</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Progress Capaian 10 Standar SPMI (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-700" />
                  Capaian Realisasi 10 Standar Mutu SPMI
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">
                  Evaluasi kinerja audit internal berbasis indikator SPMI Universitas Palembang
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('monitoring')}
                className="text-xs font-bold text-slate-700 hover:text-black hover:bg-yellow-100 gap-1 h-7"
              >
                <span>Kelola</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {standardAspects.map((aspect) => {
                  const monData = monitoring.filter(m => m.category === aspect);
                  const score = monData.length > 0 
                    ? Number((monData.reduce((a, c) => a + c.achievement_rate, 0) / monData.length).toFixed(1))
                    : 90.0;

                  return (
                    <div key={aspect} className="p-3 rounded-xl bg-slate-50 border-2 border-slate-900 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-800 truncate pr-2">{aspect}</span>
                        <span className="font-mono font-black text-slate-900">{score}%</span>
                      </div>
                      <Progress value={Math.min(score, 100)} indicatorClassName="bg-yellow-400 border-r border-slate-900" className="h-2 bg-slate-200 border border-slate-900" />
                    </div>
                  );
                })}
              </div>

              {/* Status AMI Summary Bar */}
              <div className="mt-4 p-3.5 rounded-xl bg-yellow-50/60 border-2 border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-bold">Temuan Audit (RTM):</span>
                  <span className="px-2 py-0.5 rounded-lg text-slate-900 border border-slate-900 bg-white font-mono text-xs font-black shadow-2xs">
                    {totalFindings} Temuan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-bold">Terselesaikan:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-yellow-400 text-black border border-slate-900 font-mono text-xs font-black shadow-2xs">
                    {resolvedFindings} dari {totalFindings} ({totalFindings > 0 ? Math.round((resolvedFindings/totalFindings)*100) : 100}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Status Akreditasi & Quick Management (1 col) */}
        <div className="space-y-6">
          
          {/* Akreditasi Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-700" />
                  Status Akreditasi BAN/LAM
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Institusi & Program Studi
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('accreditations')}
                className="text-xs font-bold text-slate-700 hover:text-black hover:bg-yellow-100 gap-1 h-7"
              >
                <span>Lihat</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-1">
              {accreditations.slice(0, 6).map((acc) => (
                <div 
                  key={acc.id}
                  className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-900 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-slate-900 truncate">{acc.institution_or_program}</div>
                    <div className="text-[10px] text-slate-500 font-mono font-medium mt-0.5">
                      {acc.accreditation_agency} • Exp: {acc.expiry_date}
                    </div>
                  </div>
                  <span className="text-[10px] shrink-0 font-black px-2 py-0.5 rounded-lg bg-yellow-400 text-black border border-slate-900 font-mono shadow-2xs">
                    {acc.rating}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
