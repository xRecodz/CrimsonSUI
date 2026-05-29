export type SuiNetwork = 'testnet' | 'mainnet';

export function getActiveNetwork(): SuiNetwork {
  const net = process.env.NEXT_PUBLIC_SUI_NETWORK ?? 'testnet';
  return net === 'mainnet' ? 'mainnet' : 'testnet';
}

export function getTatumApiKey(network: SuiNetwork = getActiveNetwork()): string {
  const key =
    network === 'mainnet'
      ? process.env.TATUM_API_KEY
      : process.env.TATUM_API_KEY_TESTNET ?? process.env.TATUM_API_KEY;
  if (!key) {
    throw new Error(
      `Missing Tatum API key for ${network}. Set TATUM_API_KEY or TATUM_API_KEY_TESTNET.`,
    );
  }
  return key;
}

export function getSuiRpcUrl(network: SuiNetwork = getActiveNetwork()): string {
  if (network === 'mainnet') {
    return process.env.SUI_RPC_URL ?? 'https://sui-mainnet.gateway.tatum.io';
  }
  return (
    process.env.SUI_RPC_URL_TESTNET ?? 'https://sui-testnet.gateway.tatum.io'
  );
}

export function getNetworkLabel(network: SuiNetwork = getActiveNetwork()): string {
  return network === 'mainnet' ? 'Sui Mainnet' : 'Sui Testnet';
}

/** Public Sui fullnode — fallback when Tatum gateway rate-limits. */
export function getPublicSuiRpcUrl(network: SuiNetwork = getActiveNetwork()): string {
  if (network === 'mainnet') {
    return (
      process.env.SUI_PUBLIC_RPC_MAINNET ?? 'https://fullnode.mainnet.sui.io:443'
    );
  }
  return (
    process.env.SUI_PUBLIC_RPC_TESTNET ?? 'https://fullnode.testnet.sui.io:443'
  );
}
