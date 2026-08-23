'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  FileText, 
  BarChart3, 
  Award, 
  BookOpen, 
  Info, 
  Phone, 
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [spmiDropdownOpen, setSpmiDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80' 
        : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 relative flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Image 
                src="/unpal.avif" 
                alt="Logo Universitas Palembang" 
                width={44} 
                height={44} 
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  SPMI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Universitas Palembang
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            <Link 
              href="/" 
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 select-none cursor-pointer flex items-center justify-center ${
                isActive('/') 
                  ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0 hover:bg-yellow-300' 
                  : 'text-slate-700 hover:text-black hover:bg-yellow-100/50 border-b-2 border-transparent hover:border-yellow-400 active:translate-y-0.5'
              }`}
            >
              Beranda
            </Link>

            <Link 
              href="/tentang-kami" 
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 select-none cursor-pointer flex items-center justify-center ${
                isActive('/tentang-kami') 
                  ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0 hover:bg-yellow-300' 
                  : 'text-slate-700 hover:text-black hover:bg-yellow-100/50 border-b-2 border-transparent hover:border-yellow-400 active:translate-y-0.5'
              }`}
            >
              Tentang Kami
            </Link>

            <Link 
              href="/akreditasi" 
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 select-none cursor-pointer flex items-center justify-center ${
                isActive('/akreditasi') 
                  ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0 hover:bg-yellow-300' 
                  : 'text-slate-700 hover:text-black hover:bg-yellow-100/50 border-b-2 border-transparent hover:border-yellow-400 active:translate-y-0.5'
              }`}
            >
              Akreditasi
            </Link>

            {/* SPMI Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSpmiDropdownOpen(true)}
              onMouseLeave={() => setSpmiDropdownOpen(false)}
            >
              <button 
                type="button"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 select-none cursor-pointer ${
                  pathname.startsWith('/spmi') 
                    ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0 hover:bg-yellow-300' 
                    : 'text-slate-700 hover:text-black hover:bg-yellow-100/50 border-b-2 border-transparent hover:border-yellow-400 active:translate-y-0.5'
                }`}
                onClick={() => setSpmiDropdownOpen(!spmiDropdownOpen)}
              >
                <span>Layanan SPMI</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${spmiDropdownOpen ? 'rotate-180 text-black' : ''}`} />
              </button>

              {spmiDropdownOpen && (
                <div className="absolute top-full left-0 w-52 pt-2 z-50 animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl shadow-[4px_4px_0_0_#000000] border-2 border-slate-900 p-1.5 space-y-1">
                    <Link
                      href="/spmi/pemantauan"
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-100 ${
                        pathname === '/spmi/pemantauan' 
                          ? 'bg-yellow-400 text-black font-black border border-slate-900 shadow-2xs' 
                          : 'hover:bg-yellow-100 text-slate-800 font-bold'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-yellow-100 text-black flex items-center justify-center shrink-0 border border-slate-900 shadow-2xs">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold">Pemantauan SPMI</span>
                    </Link>

                    <Link
                      href="/spmi/dokumen"
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-100 ${
                        pathname === '/spmi/dokumen' 
                          ? 'bg-yellow-400 text-black font-black border border-slate-900 shadow-2xs' 
                          : 'hover:bg-yellow-100 text-slate-800 font-bold'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-yellow-100 text-black flex items-center justify-center shrink-0 border border-slate-900 shadow-2xs">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold">Dokumen SPMI</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/peraturan" 
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 select-none cursor-pointer flex items-center justify-center ${
                isActive('/peraturan') 
                  ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0 hover:bg-yellow-300' 
                  : 'text-slate-700 hover:text-black hover:bg-yellow-100/50 border-b-2 border-transparent hover:border-yellow-400 active:translate-y-0.5'
              }`}
            >
              Peraturan
            </Link>

            <Link 
              href="/kontak" 
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-100 select-none cursor-pointer flex items-center justify-center ${
                isActive('/kontak') 
                  ? 'bg-yellow-400 text-black border-b-4 border-yellow-600 shadow-sm active:translate-y-1 active:border-b-0 hover:bg-yellow-300' 
                  : 'text-slate-700 hover:text-black hover:bg-yellow-100/50 border-b-2 border-transparent hover:border-yellow-400 active:translate-y-0.5'
              }`}
            >
              Kontak
            </Link>
          </nav>

          {/* Right Action Button: Admin Portal */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/admin/dashboard">
              <Button size="sm" className="gap-2 font-semibold shadow-xs">
                <UserCheck className="w-4 h-4" />
                <span>Portal Admin</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/admin/login"
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Portal Admin"
            >
              <UserCheck className="w-5 h-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/tentang-kami"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/tentang-kami') ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tentang Kami
          </Link>
          <Link
            href="/akreditasi"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/akreditasi') ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Akreditasi
          </Link>
          
          <div className="pt-1 pb-1 border-y border-slate-100 my-1">
            <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              SPMI & Dokumen
            </div>
            <Link
              href="/spmi/pemantauan"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                pathname === '/spmi/pemantauan' ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <span>Pemantauan SPMI</span>
            </Link>
            <Link
              href="/spmi/dokumen"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                pathname === '/spmi/dokumen' ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Dokumen SPMI</span>
            </Link>
          </div>

          <Link
            href="/peraturan"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/peraturan') ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Peraturan
          </Link>

          <Link
            href="/kontak"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/kontak') ? 'text-brand-600 bg-brand-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Kontak
          </Link>

          <div className="pt-3">
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Masuk Portal Admin</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
