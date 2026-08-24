'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { dataService } from '@/lib/supabase';

import { Component as BackgroundComponent } from '@/components/ui/background-components';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await dataService.authenticate(email, password);
      if (user) {
        router.push('/admin/dashboard');
      } else {
        setError('Email atau kata sandi tidak cocok, atau akun Anda sedang dinonaktifkan.');
        setLoading(false);
      }
    } catch {
      setError('Terjadi kesalahan saat memproses login.');
      setLoading(false);
    }
  };

  return (
    <BackgroundComponent className="min-h-screen">
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md space-y-4">
          
          {/* Back Link */}
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Utama</span>
            </Link>
          </div>

        {/* Login Card */}
        <Card className="rounded-3xl border-2 border-slate-900 bg-white p-8 sm:p-10 shadow-[6px_6px_0_0_#000000] space-y-6 text-slate-900">
          
          {/* Header */}
          <CardHeader className="text-center space-y-2 p-0">
            <div className="w-16 h-16 relative flex items-center justify-center mx-auto mb-2 p-1.5 rounded-2xl bg-yellow-100 border-2 border-slate-900 shadow-2xs">
              <Image 
                src="/unpal.avif" 
                alt="Logo Universitas Palembang" 
                width={56} 
                height={56} 
                className="object-contain w-full h-full"
                priority 
              />
            </div>
            <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
              Portal Admin SPMI
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              Universitas Palembang • Autentikasi Pengelola Dokumen & Audit Mutu
            </CardDescription>
          </CardHeader>

          {/* Form */}
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-4">
              
              {error && (
                <div className="p-3 bg-red-50 border-2 border-red-400 rounded-xl text-red-900 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">Email Staf / Administrator</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    required
                    placeholder="nama@unpal.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-white border-2 border-slate-900 text-slate-900 placeholder-slate-400 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-white border-2 border-slate-900 text-slate-900 placeholder-slate-400 rounded-xl text-xs font-bold focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer focus:outline-none"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-black text-xs rounded-xl gap-2 transition-all mt-2 cursor-pointer shadow-[3px_3px_0_0_#000000]"
              >
                {loading ? (
                  <span>Memverifikasi Akun...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

            </form>
          </CardContent>

        </Card>

        </div>
      </div>
    </BackgroundComponent>
  );
}
