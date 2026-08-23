'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { initialRegulations } from '@/lib/mock-data';
import { dataService } from '@/lib/supabase';
import { Regulation } from '@/lib/types';
import { 
  Search, 
  FileText, 
  Download, 
  Calendar, 
  Building
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PeraturanPage() {
  const [regulations, setRegulations] = useState<Regulation[]>(initialRegulations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetched = await dataService.getRegulations();
        setRegulations(fetched);
      } catch (err) {
        console.error('Error fetching regulations', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(regulations.map((r) => r.category)));
    return ['Semua', ...cats];
  }, [regulations]);

  const availableYears = useMemo(() => {
    const yrs = Array.from(new Set(regulations.map((r) => r.year.toString()))).sort((a, b) => Number(b) - Number(a));
    return ['Semua', ...yrs];
  }, [regulations]);

  const filteredRegulations = useMemo(() => {
    return regulations.filter((reg) => {
      const matchesSearch =
        reg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.regulation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.issued_by.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Semua' || reg.category === selectedCategory;

      const matchesYear =
        selectedYear === 'Semua' || reg.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [regulations, searchTerm, selectedCategory, selectedYear]);

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Direktori <span className="gradient-text">Peraturan & Kebijakan</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed font-medium">
            Kumpulan dasar hukum penjaminan mutu pendidikan tinggi dari tingkat perundang-undangan nasional, kementerian, hingga Surat Keputusan (SK) Rektor Universitas Palembang.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
              <Input
                type="text"
                placeholder="Cari judul, nomor regulasi, atau penerbit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-sm bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-500 rounded-xl font-medium focus:ring-4 focus:ring-yellow-300"
              />
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-black text-slate-600 uppercase">Tahun:</span>
              <div className="flex flex-wrap gap-1.5">
                {availableYears.map((yr) => (
                  <Button
                    key={yr}
                    variant={selectedYear === yr ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedYear(yr)}
                    className="text-xs h-7 px-3"
                  >
                    {yr}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="text-xs h-7 px-3"
              >
                {cat}
              </Button>
            ))}
          </div>
        </Card>

        {/* Regulations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRegulations.length === 0 ? (
            <Card className="col-span-full py-16 text-center text-slate-500 font-medium">
              Tidak ditemukan regulasi yang sesuai dengan pencarian Anda.
            </Card>
          ) : (
            filteredRegulations.map((reg) => (
              <Card 
                key={reg.id} 
                className="p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000] transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="gold" className="font-extrabold text-xs bg-yellow-400 text-black border border-slate-900 shadow-xs">
                      {reg.category}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-black" />
                      {reg.year}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">
                      {reg.title}
                    </h3>
                    <div className="text-xs font-mono font-bold text-slate-700 mt-1">
                      {reg.regulation_number}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                    {reg.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate">
                    <Building className="w-3.5 h-3.5 shrink-0 text-slate-800" />
                    <span className="truncate">{reg.issued_by}</span>
                  </div>

                  <a 
                    href={reg.file_url || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="shrink-0"
                  >
                    <Button 
                      size="sm" 
                      className="gap-1.5 text-xs h-8 font-extrabold shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh PDF</span>
                    </Button>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
