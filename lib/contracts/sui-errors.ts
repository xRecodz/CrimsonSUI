/** Map common Move abort codes from crimson_quest::crimson to user-facing text. */
export function formatCrimsonMoveError(error: unknown): string {
  const text =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : String(error);

  if (
    text.includes('abort code: 1') &&
    text.includes('claim_faucet')
  ) {
    return 'Faucet cooldown active — you can claim 1000 DFQ again 12 hours after your last claim.';
  }
  if (text.includes('abort code: 2') && text.includes('mint_badge')) {
    return 'Not enough DFQ to mint the badge (50 DFQ fee required).';
  }
  if (text.includes('abort code: 3') && text.includes('stake')) {
    return 'Stake amount is below the minimum (10 DFQ).';
  }
  if (text.includes('abort code: 4') && text.includes('unstake')) {
    return 'You do not have enough DFQ staked to unstake that amount.';
  }

  if (text.includes('MoveAbort') || text.includes('Transaction resolution failed')) {
    return 'On-chain transaction failed. Check your DFQ balance, cooldown, or try again.';
  }

  return text;
}

export function formatCooldownRemaining(ms: number): string {
  if (ms <= 0) return '';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
