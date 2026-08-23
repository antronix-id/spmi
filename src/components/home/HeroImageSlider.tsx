'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { dataService } from '@/lib/supabase';
import { initialHomeContent } from '@/lib/mock-data';

const DEFAULT_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000'
];

export function HeroImageSlider() {
  const [images, setImages] = useState<string[]>(initialHomeContent.slider_images || DEFAULT_IMAGE_URLS);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const home = await dataService.getHomeContent();
        if (home?.slider_images && home.slider_images.length > 0) {
          setImages(home.slider_images);
        }
      } catch (e) {
        console.warn('Failed to load slide images', e);
      }
    }
    load();
  }, []);

  const nextSlide = useCallback(() => {
    setImages((prevImages) => {
      if (prevImages.length === 0) return prevImages;
      setCurrent((prev) => (prev + 1) % prevImages.length);
      return prevImages;
    });
  }, []);

  const prevSlide = useCallback(() => {
    setImages((prevImages) => {
      if (prevImages.length === 0) return prevImages;
      setCurrent((prev) => (prev - 1 + prevImages.length) % prevImages.length);
      return prevImages;
    });
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, images.length, nextSlide]);

  if (images.length === 0) return null;

  return (
    <div 
      className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-white/70 bg-slate-900 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {images.map((url, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
          } transition-transform duration-1000`}
        >
          {/* Image */}
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}

      {/* Navigation Buttons (Left & Right) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide Sebelumnya"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide Selanjutnya"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Pindah ke slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current 
                    ? 'w-6 bg-white shadow-md' 
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
