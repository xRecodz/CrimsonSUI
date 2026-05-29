import deployed from './deployed-sui.json';

export const CRIMSON_PACKAGE_ID =
  process.env.NEXT_PUBLIC_CRIMSON_PACKAGE_ID ?? deployed.packageId;

export const FAUCET_OBJECT_ID =
  process.env.NEXT_PUBLIC_FAUCET_OBJECT_ID ?? deployed.faucetId;

export const BADGE_REGISTRY_ID =
  process.env.NEXT_PUBLIC_BADGE_REGISTRY_ID ?? deployed.badgeRegistryId;

export const STAKING_POOL_ID =
  process.env.NEXT_PUBLIC_STAKING_POOL_ID ?? deployed.stakingPoolId;

export const CRIMSON_COIN_TYPE = `${CRIMSON_PACKAGE_ID}::crimson::CRIMSON`;

/** 9 decimals — matches Move constants */
export const DFQ_DECIMALS = 9;
export const DFQ_FAUCET_AMOUNT = 1_000n * 10n ** 9n;
/** 12 hours — matches Move FAUCET_COOLDOWN_MS */
export const DFQ_FAUCET_COOLDOWN_MS = 43_200_000;
export const DFQ_MINT_FEE = 50n * 10n ** 9n;
export const DFQ_MIN_STAKE = 10n * 10n ** 9n;

export function suiContractsConfigured(): boolean {
  return Boolean(
    CRIMSON_PACKAGE_ID &&
      FAUCET_OBJECT_ID &&
      BADGE_REGISTRY_ID &&
      STAKING_POOL_ID &&
      !CRIMSON_PACKAGE_ID.startsWith('0x000'),
  );
}

export function toDfqUnits(amountHuman: number): bigint {
  return BigInt(Math.floor(amountHuman * 10 ** DFQ_DECIMALS));
}

export function fromDfqUnits(amount: bigint): string {
  const whole = amount / 10n ** BigInt(DFQ_DECIMALS);
  const frac = amount % 10n ** BigInt(DFQ_DECIMALS);
  if (frac === 0n) return whole.toString();
  return `${whole}.${frac.toString().padStart(DFQ_DECIMALS, '0').replace(/0+$/, '')}`;
}
