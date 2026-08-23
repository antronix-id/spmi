import React from 'react';
import Link from 'next/link';
import { initialNews } from '@/lib/mock-data';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function NewsSection() {
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Berita & Pengumuman Penjaminan Mutu
            </h2>
          </div>
          <Link href="/kontak">
            <Button variant="link" className="font-bold text-sm text-brand-600 gap-1.5 group">
              <span>Hubungi Humas SPMI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {initialNews.map((news) => (
            <Card 
              key={news.id}
              className="p-0 flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000000]"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-slate-200">
                <img 
                  src={news.image_url} 
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-700 font-bold shadow-xs">
                  {news.category}
                </Badge>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {news.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {news.author}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {news.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {news.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-brand-600">
                  <span>{news.read_time}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Baca Selengkapnya
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
