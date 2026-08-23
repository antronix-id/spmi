'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { initialAccreditations } from '@/lib/mock-data';
import { dataService } from '@/lib/supabase';
import { Accreditation } from '@/lib/types';
import { 
  Award, 
  Search, 
  Download, 
  Calendar, 
  Building,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function AkreditasiPage() {
  const [accreditations, setAccreditations] = useState<Accreditation[]>(initialAccreditations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');
  const [selectedRating, setSelectedRating] = useState<string>('Semua');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dataService.getAccreditations();
        setAccreditations(data);
      } catch (err) {
        console.error('Error fetching accreditations', err);
      }
    }
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return accreditations.filter((item) => {
      const matchesSearch = 
        item.institution_or_program.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sk_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.faculty && item.faculty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.accreditation_agency.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = selectedLevel === 'Semua' || item.level === selectedLevel;
      const matchesRating = selectedRating === 'Semua' || item.rating === selectedRating;

      return matchesSearch && matchesLevel && matchesRating;
    });
  }, [accreditations, searchTerm, selectedLevel, selectedRating]);

  const institutionAccreditation = accreditations.find(a => a.level === 'Institusi') || initialAccreditations[0];

  return (
    <div className="pt-28 pb-20 bg-transparent min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Status Akreditasi <span className="gradient-text">Program Studi & Institusi</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Data resmi status dan peringkat akreditasi terkini seluruh program studi di Universitas Palembang yang dikeluarkan oleh BAN-PT dan Lembaga Akreditasi Mandiri (LAM).
          </p>
        </div>

        {/* Featured Institution Accreditation Card */}
        {institutionAccreditation && (
          <Card className="p-8 sm:p-10 bg-white text-slate-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="gold" className="text-xs uppercase tracking-wider px-3 py-1 font-black bg-yellow-400 text-black border-2 border-slate-900 shadow-xs">
                    Akreditasi Perguruan Tinggi (AIPT)
                  </Badge>
                  <Badge variant="emerald" className="text-xs px-3 py-1 font-bold border-2 border-slate-900">
                    Status: {institutionAccreditation.status}
                  </Badge>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {institutionAccreditation.institution_or_program}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-slate-700 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-slate-900 flex items-center justify-center text-black shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold">Lembaga Akreditasi</div>
                      <div className="font-extrabold text-slate-900">{institutionAccreditation.accreditation_agency}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-slate-900 flex items-center justify-center text-black shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold">Nomor SK</div>
                      <div className="font-extrabold text-slate-900">{institutionAccreditation.sk_number}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-slate-900 flex items-center justify-center text-black shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold">Masa Berlaku SK</div>
                      <div className="font-extrabold text-slate-900">
                        {institutionAccreditation.decree_date ? `${institutionAccreditation.decree_date} s.d. ` : ''}
                        {institutionAccreditation.expiry_date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 border border-slate-900 flex items-center justify-center text-black shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-bold">Tingkat Penjaminan</div>
                      <div className="font-extrabold text-slate-900">Terakreditasi Nasional</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Big Badge Card */}
              <Card className="p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 bg-yellow-50/70 border-2 border-slate-900 shadow-md">
                <div className="w-14 h-14 rounded-2xl bg-yellow-400 border-2 border-slate-900 flex items-center justify-center text-black shadow-xs">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-slate-600 font-black">Peringkat Akreditasi</div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                    {institutionAccreditation.rating}
                  </div>
                </div>
                <a 
                  href={institutionAccreditation.certificate_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full mt-2 block"
                >
                  <Button 
                    size="sm" 
                    className="font-extrabold gap-2 text-xs w-full shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Salinan Sertifikat</span>
                  </Button>
                </a>
              </Card>

            </div>
          </Card>
        )}

        {/* Filter and Search Section */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
              <Input
                type="text"
                placeholder="Cari Program Studi, Fakultas, atau No. SK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-sm bg-white border-2 border-slate-900 text-slate-900 placeholder:text-slate-500 rounded-xl font-medium focus:ring-4 focus:ring-yellow-300"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Level Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-black text-slate-600 mr-1 uppercase">Jenjang:</span>
                {['Semua', 'S1'].map((lvl) => (
                  <Button
                    key={lvl}
                    variant={selectedLevel === lvl ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedLevel(lvl)}
                    className="text-xs h-7 px-3"
                  >
                    {lvl}
                  </Button>
                ))}
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs font-black text-slate-600 mr-1 uppercase">Peringkat:</span>
                {['Semua', 'Unggul', 'Baik Sekali', 'Baik'].map((rat) => (
                  <Button
                    key={rat}
                    variant={selectedRating === rat ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedRating(rat)}
                    className="text-xs h-7 px-3"
                  >
                    {rat}
                  </Button>
                ))}
              </div>

            </div>

          </div>
        </Card>

        {/* Data Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="border-b border-slate-200">
                <TableHead className="w-12 text-center font-bold text-slate-900">No</TableHead>
                <TableHead className="font-bold text-slate-900">Program Studi & Fakultas</TableHead>
                <TableHead className="font-bold text-slate-900">Jenjang</TableHead>
                <TableHead className="font-bold text-slate-900">Lembaga</TableHead>
                <TableHead className="font-bold text-slate-900">Peringkat</TableHead>
                <TableHead className="font-bold text-slate-900">Nomor SK & Masa Berlaku</TableHead>
                <TableHead className="font-bold text-slate-900 text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-900 text-center">Sertifikat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    Tidak ditemukan data akreditasi yang sesuai dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="text-center font-medium text-slate-500 text-xs">
                      {index + 1}
                    </TableCell>
                    
                    <TableCell>
                      <div className="font-bold text-slate-900 text-sm">
                        {item.institution_or_program}
                      </div>
                      {item.faculty && (
                        <div className="text-xs text-slate-500 font-medium">
                          {item.faculty}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                        {item.level}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-semibold text-slate-700">
                        {item.accreditation_agency}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge 
                        variant={item.rating === 'Unggul' ? 'emerald' : item.rating === 'Baik Sekali' ? 'brand' : 'gold'}
                        className="font-bold text-xs"
                      >
                        {item.rating}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="font-mono text-xs text-slate-800 font-semibold">{item.sk_number}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        {item.decree_date && (
                          <span>Penetapan: <strong className="font-medium text-slate-700">{item.decree_date}</strong></span>
                        )}
                        <span>• Berlaku s.d. <strong className="font-medium text-slate-700">{item.expiry_date}</strong></span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant={item.status === 'Aktif' ? 'emerald' : 'destructive'} className="text-[11px]">
                        {item.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.certificate_url && item.certificate_url !== '#' ? (
                        <a 
                          href={item.certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button 
                            variant="secondary"
                            size="sm" 
                            className="h-7 px-2.5 text-xs gap-1 font-semibold hover:bg-slate-200 border border-slate-200 shadow-xs"
                            title="Lihat Salinan Sertifikat"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

      </div>
    </div>
  );
}
