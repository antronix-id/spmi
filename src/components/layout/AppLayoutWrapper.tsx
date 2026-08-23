'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { Component as BackgroundComponent } from '@/components/ui/background-components';

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <BackgroundComponent>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </BackgroundComponent>
  );
}
