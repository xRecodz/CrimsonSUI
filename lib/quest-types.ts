export type QuestCategory = 'daily' | 'weekly' | 'bonus';

export type DailyQuestType = 'vote' | 'quiz';

export type QuestOption = {
  id: string;
  label: string;
};

export type DailyQuest = {
  id: string;
  type: DailyQuestType;
  title: string;
  question: string;
  options: QuestOption[];
  correctOptionId: string;
  xpReward: number;
  dateKey: string;
  slot: number;
  walletSeed: string;
  ipfsMetadataUri: string;
};

export type WeeklyQuest = {
  id: string;
  title: string;
  description: string;
  requiredDailyCount: number;
  xpReward: number;
  badgeName: string;
  badgeTokenUri: string;
  mintFeeDfq: number;
};

export type BonusQuest = {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  requiredStakeAmount: number;
  stakeTokenSymbol: string;
};

/** Walrus blob proof for a quest completion. */
export type WalrusProofRecord = {
  blobId: string;
  questId?: string;
  label?: string;
  gatewayUrl?: string;
  storedAt: string;
};

export type UserQuestProgress = {
  wallet: string;
  totalXp: number;
  bonusXp: number;
  badgeCount: number;
  nftBadgeMinted: boolean;
  /** @deprecated use dailyCompletedQuestIds */
  dailyCompletedDates?: string[];
  /** @deprecated use dailyAttemptedQuestIds */
  dailyAttemptedDates?: string[];
  dailyCompletedQuestIds: string[];
  dailyAttemptedQuestIds: string[];
  weeklyCompleted: boolean;
  bonusCompleted: boolean;
  /** DFQ amount used when bonus quest was completed (for display / proofs). */
  bonusStakeAmount?: number;
  stakingCompleted: boolean;
  lastDailyAnswer?: {
    dateKey: string;
    correct: boolean;
    xpEarned: number;
  };
  ipfsProofCids: string[];
  /** Structured Walrus proofs (preferred). */
  walrusProofs?: WalrusProofRecord[];
  updatedAt: string;
};

export type LeaderboardEntry = {
  rank: number;
  wallet: string;
  xp: number;
  badges: number;
  isYou?: boolean;
};

export type QuestSubmitResult = {
  correct: boolean;
  xpEarned: number;
  blobId?: string;
  gatewayUrl?: string;
};
