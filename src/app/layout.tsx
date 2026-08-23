import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayoutWrapper from '@/components/layout/AppLayoutWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Sistem Penjaminan Mutu Internal (SPMI) - Universitas Palembang',
  description: 'Portal resmi Sistem Penjaminan Mutu Internal (SPMI) Universitas Palembang. Akses informasi akreditasi, dokumen kebijakan mutu, audit mutu internal, dan regulasi pendidikan tinggi.',
  keywords: ['SPMI', 'Universitas Palembang', 'Akreditasi', 'Penjaminan Mutu', 'AMI', 'PPEPP', 'BAN-PT', 'LAM'],
  authors: [{ name: 'SPMI Universitas Palembang' }],
  icons: {
    icon: '/unpal.avif',
    shortcut: '/unpal.avif',
    apple: '/unpal.avif',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${inter.className} scroll-smooth`}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-brand-500 selection:text-white`}>
        <AppLayoutWrapper>
          {children}
        </AppLayoutWrapper>
      </body>
    </html>
  );
}
