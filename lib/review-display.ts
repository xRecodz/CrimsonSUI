const SUI_ADDRESS_RE = /^0x[a-f0-9]{40,64}$/i;

/** Shorten Sui wallet for UI (0xabcd…1234). */
export function truncateWallet(address: string): string {
  const a = address.trim();
  if (a.length <= 14) return a;
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function isWalletLike(value: string): boolean {
  return SUI_ADDRESS_RE.test(value.trim());
}

/** Label shown on review cards — never a full 66-char address. */
export function formatReviewAuthor(
  displayName: string,
  wallet?: string,
): { label: string; title?: string; mono: boolean } {
  const name = displayName.trim() || 'Anonymous';

  if (isWalletLike(name)) {
    return { label: truncateWallet(name), title: name, mono: true };
  }

  if (name.length > 28) {
    return { label: `${name.slice(0, 25)}…`, title: name, mono: false };
  }

  if ((!name || name === 'Anonymous') && wallet) {
    return { label: truncateWallet(wallet), title: wallet, mono: true };
  }

  return { label: name, title: undefined, mono: false };
}
