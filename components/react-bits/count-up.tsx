'use client';

import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  separator?: string;
};

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  className = '',
  suffix = '',
  separator = ',',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(from);
  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const formatValue = useCallback(
    (latest: number) => {
      const formatted = Intl.NumberFormat('en-US', {
        useGrouping: !!separator,
        maximumFractionDigits: 1,
      }).format(latest);
      return separator
        ? `${formatted.replace(/,/g, separator)}${suffix}`
        : `${formatted}${suffix}`;
    },
    [separator, suffix],
  );

  useEffect(() => {
    if (ref.current) ref.current.textContent = formatValue(from);
  }, [from, formatValue]);

  useEffect(() => {
    if (!isInView) return;
    const timeoutId = setTimeout(() => motionValue.set(to), delay * 1000);
    return () => clearTimeout(timeoutId);
  }, [isInView, motionValue, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span ref={ref} className={cn('inline-block tabular-nums', className)} />;
}
