'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  FileText, 
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dataService } from '@/lib/supabase';
import { initialHomeContent } from '@/lib/mock-data';
import { HomePageContent } from '@/lib/types';
import { HeroImageSlider } from './HeroImageSlider';

export default function HeroSection() {
  const [content, setContent] = useState<HomePageContent>(initialHomeContent);

  useEffect(() => {
    async function load() {
      try {
        const home = await dataService.getHomeContent();
        if (home) setContent(home);
      } catch (e) {
        console.warn('Failed to load hero content', e);
      }
    }
    load();
  }, []);

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-transparent">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              {content.hero_title}{' '}
              <span className="gradient-text">{content.hero_title_highlight}</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {content.hero_subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/spmi/dokumen">
                <Button size="lg" className="gap-2 group">
                  <FileText className="w-4 h-4" />
                  <span>{content.hero_cta_primary_text || 'Unduh Dokumen Mutu'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/akreditasi">
                <Button variant="outline" size="lg" className="gap-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>{content.hero_cta_secondary_text || 'Cek Status Akreditasi'}</span>
                </Button>
              </Link>
            </div>

          </div>

          {/* Right Column: Hero Image Slider */}
          <div className="lg:col-span-5 relative">
            <HeroImageSlider />
          </div>

        </div>
      </div>
    </section>
  );
}
