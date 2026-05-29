'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FadeContentProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
};

export default function FadeContent({
  children,
  className = '',
  delay = 0,
  blur = true,
}: FadeContentProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        y: 32,
        filter: blur ? 'blur(12px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
