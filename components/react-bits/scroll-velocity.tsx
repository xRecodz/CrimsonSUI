'use client';

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import './scroll-velocity.css';
import { cn } from '@/lib/utils';

function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const updateWidth = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [ref]);
  return width;
}

type VelocityTextProps = {
  children: string;
  baseVelocity?: number;
  className?: string;
};

function VelocityText({
  children,
  baseVelocity = 100,
  className = '',
}: VelocityTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const directionFactor = useRef(1);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return '0px';
    const range = copyWidth;
    const mod = (((v - -range) % range) + range) % range;
    return `${mod - range}px`;
  });

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const spans = [];
  for (let i = 0; i < 6; i++) {
    spans.push(
      <span key={i} ref={i === 0 ? copyRef : undefined}>
        {children}&nbsp;
      </span>,
    );
  }

  return (
    <div className={cn('parallax', className)}>
      <motion.div className="scroller" style={{ x }}>
        {spans}
      </motion.div>
    </div>
  );
}

type ScrollVelocityProps = {
  texts?: string[];
  velocity?: number;
  className?: string;
};

export default function ScrollVelocity({
  texts = [],
  velocity = 100,
  className = '',
}: ScrollVelocityProps) {
  return (
    <div className={className}>
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          baseVelocity={index % 2 === 0 ? velocity : -velocity}
        >
          {text}
        </VelocityText>
      ))}
    </div>
  );
}
