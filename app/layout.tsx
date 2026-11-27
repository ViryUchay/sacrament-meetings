
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NavLinks from '@/components/NavLinks';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sacrament Meeting Planner',
  description: 'Plan and view sacrament meeting programs for Lagos Ward.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-amber-50/30">
        <Header />

        
<Suspense
  fallback={
    <nav
      aria-label="Main navigation"
      className="border-b border-slate-200 bg-slate-50"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 py-3">
        <span className="rounded-md px-4 py-2 text-sm font-medium text-slate-700">
          Home
        </span>
      </div>
    </nav>
  }
>
  <NavLinks />
</Suspense>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
