/** Shared motion tokens for landing feature cards (Quest Types + NFT Badges) */
export const CARD_EASE = [0.22, 1, 0.36, 1] as const;

export const CARD_STAGGER = 0.09;
export const CARD_DURATION = 0.55;

export const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: CARD_STAGGER,
      delayChildren: 0.06,
    },
  },
};

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: CARD_DURATION,
      ease: CARD_EASE,
    },
  },
};

export const headerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: CARD_EASE },
  },
};
