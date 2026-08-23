'use client';

import React, { useState } from 'react';
import { MonitoringData, SpmiStandardAspect } from '@/lib/types';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Award,
  Layers
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MonitoringChartsProps {
  data: MonitoringData[];
}

export default function MonitoringCharts({ data }: MonitoringChartsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('2023/2024 Genap');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories: (string | SpmiStandardAspect)[] = [
    'Semua',
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

  const filteredData = activeCategory === 'Semua' 
    ? data 
    : data.filter(d => d.category === activeCategory);

  // Aggregations
  const totalFindings = data.reduce((acc, curr) => acc + curr.findings_count, 0);
  const resolvedFindings = data.reduce((acc, curr) => acc + curr.resolved_findings, 0);
  const averageAchievement = (data.reduce((acc, curr) => acc + curr.achievement_rate, 0) / data.length).toFixed(1);

  // 10 SPMI Standard Aspects defined by Universitas Palembang
  const categoryStats = [
    { name: 'Standar di Aspek Pendidikan', score: 95.2, target: 90, color: 'bg-blue-500' },
    { name: 'Standar di Aspek Penelitian', score: 86.5, target: 80, color: 'bg-indigo-500' },
    { name: 'Standar di Aspek Pengabdian pada Masyarakat', score: 88.0, target: 85, color: 'bg-emerald-500' },
    { name: 'Organisasi & Tata Kelola', score: 89.0, target: 85, color: 'bg-cyan-500' },
    { name: 'Aspek Kemahasiswaan', score: 91.4, target: 85, color: 'bg-rose-500' },
    { name: 'Aspek Sumber Daya Manusia', score: 89.5, target: 85, color: 'bg-amber-500' },
    { name: 'Aspek Sarana Prasarana', score: 87.0, target: 85, color: 'bg-violet-500' },
    { name: 'Aspek Keuangan', score: 90.0, target: 85, color: 'bg-teal-500' },
    { name: 'Aspek Kerja Sama', score: 83.5, target: 80, color: 'bg-sky-500' },
    { name: 'Aspek Kesejahteraan', score: 88.5, target: 85, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Filter Bar with shadcn Card */}
      <Card className="p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">10 Aspek Standar Mutu SPMI</div>
              <div className="text-sm font-extrabold text-slate-800">Evaluasi Siklus AMI ({selectedPeriod})</div>
            </div>
          </div>
          <Badge variant="brand" className="w-fit">
            10 Aspek Standar Terpenuhi
          </Badge>
        </div>

        {/* Filter Pills for all 10 standard aspects */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="text-xs h-7 px-3"
            >
              {cat}
            </Button>
          ))}
        </div>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Card 1: Rata-rata Ketercapaian */}
        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Ketercapaian 10 Standar
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {averageAchievement}%
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Target 10 aspek mutu terlampaui (+4.8% dari target minimum)
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(Number(averageAchievement), 100)}%` }}></div>
          </div>
        </Card>

        {/* Card 2: Temuan AMI Selesai */}
        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tindak Lanjut Temuan AMI
            </span>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {resolvedFindings} / {totalFindings}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {((resolvedFindings / totalFindings) * 100).toFixed(0)}% temuan telah diverifikasi closed oleh auditor
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(resolvedFindings / totalFindings) * 100}%` }}></div>
          </div>
        </Card>

        {/* Card 3: Status Siklus SPMI */}
        <Card className="p-6 shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status Siklus SPMI UNPAL
            </span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 tracking-tight">
            Tahap RTM Disahkan
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Rekomendasi 10 aspek telah disetujui Senat & Rektor
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </Card>

      </div>

      {/* Main Charts & Visual Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Bar Graph of all 10 Standard Aspects */}
        <Card className="lg:col-span-7 p-6 sm:p-7 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Skor Ketercapaian 10 Aspek Standar Mutu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nilai Riil vs Target Baseline Berdasarkan Dokumen SPMI UNPAL
              </p>
            </div>
            <Badge variant="secondary">
              10 Aspek Standar
            </Badge>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3.5">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-normal text-[11px]">Target: {item.target}</span>
                    <span className="text-slate-900 font-bold">{item.score} / 100</span>
                  </div>
                </div>
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex items-center">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900/80 z-10"
                    style={{ left: `${item.target}%` }}
                    title={`Target: ${item.target}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Skor Capaian Riil</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1 h-3 bg-slate-900"></span>
              <span>Garis Target Minimum</span>
            </div>
          </div>
        </Card>

        {/* Right: Detailed Standard List Table */}
        <Card className="lg:col-span-5 p-6 sm:p-7 shadow-soft flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Detail Indikator per Aspek Mutu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hasil Audit Mutu Internal (AMI) Terkini
              </p>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredData.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-2">
                      {item.standard_name}
                    </span>
                    <Badge 
                      variant={
                        item.status === 'Melampaui' 
                          ? 'emerald' 
                          : item.status === 'Tercapai'
                          ? 'brand'
                          : 'gold'
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-brand-700">{item.category}</span>
                    <span className="font-semibold text-slate-700">
                      Skor: {item.actual_score} ({item.achievement_rate}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-medium">
              Data terverifikasi oleh Sistem AMI 10 Aspek Universitas Palembang
            </span>
          </div>
        </Card>

      </div>

    </div>
  );
}
