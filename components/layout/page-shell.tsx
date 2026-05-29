'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SiteHeader } from './site-header';
import { PremiumSectionHeader } from '@/components/landing/premium-card';
import { Footer } from '@/components/footer';

type PageShellProps = {
  children: ReactNode;
  title: string;
  description?: string;
  maxWidth?: 'md' | 'lg' | 'xl';
  showFooter?: boolean;
};

const widthClass = {
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
};

export function PageShell({
  children,
  title,
  description,
  maxWidth = 'lg',
  showFooter = true,
}: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main className={`mx-auto ${widthClass[maxWidth]} px-4 pb-16 pt-24 sm:px-6`}>
        <PremiumSectionHeader
          title={<h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>}
          description={description ?? ''}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>
      {showFooter && <Footer />}
    </>
  );
}
