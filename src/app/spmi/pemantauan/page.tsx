'use client';

import React, { useState, useEffect } from 'react';
import MonitoringCharts from '@/components/spmi/MonitoringCharts';
import { initialMonitoringData } from '@/lib/mock-data';
import { dataService } from '@/lib/supabase';
import { MonitoringData } from '@/lib/types';

export default function PemantauanSpmiPage() {
  const [data, setData] = useState<MonitoringData[]>(initialMonitoringData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetched = await dataService.getMonitoringData();
        setData(fetched);
      } catch (err) {
        console.error('Error fetching monitoring data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Monitoring & Evaluasi <span className="gradient-text">10 Aspek Standar Mutu</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            Visualisasi ketercapaian 10 Aspek Standar Mutu SPMI Universitas Palembang: Pendidikan, Penelitian, Pengabdian pada Masyarakat, Organisasi, Kemahasiswaan, SDM, Sarana Prasarana, Keuangan, Kerja Sama, dan Kesejahteraan.
          </p>
        </div>

        {/* Monitoring Charts Component */}
        <MonitoringCharts data={data} />

      </div>
    </div>
  );
}
