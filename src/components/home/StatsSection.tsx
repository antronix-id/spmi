'use client';

import React, { useState, useEffect } from 'react';
import { Award, FileText, Users, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { dataService } from '@/lib/supabase';
import { initialHomeContent } from '@/lib/mock-data';
import { HomeStatCard } from '@/lib/types';

const ICON_MAP = {
  Award,
  FileText,
  Users,
  BarChart3
};

export default function StatsSection() {
  const [stats, setStats] = useState<HomeStatCard[]>(initialHomeContent.stats);

  useEffect(() => {
    async function load() {
      try {
        const home = await dataService.getHomeContent();
        if (home?.stats && home.stats.length > 0) {
          setStats(home.stats);
        }
      } catch (e) {
        console.warn('Failed to load stats', e);
      }
    }
    load();
  }, []);

  return (
    <section className="py-16 bg-transparent border-y border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Komitmen Nyata Mutu Pendidikan Tinggi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = ICON_MAP[item.icon_name] || Award;
            return (
              <Card 
                key={item.id}
                className="p-6 transition-all duration-200 group hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000]"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${item.bgColor || 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {item.value}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
