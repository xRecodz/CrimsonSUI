import { getActiveNetwork } from './network';

type ExplorerKind = 'tx' | 'account' | 'object' | 'package';

const SUISCAN_BASE: Record<'testnet' | 'mainnet', string> = {
  testnet: 'https://suiscan.xyz/testnet',
  mainnet: 'https://suiscan.xyz/mainnet',
};

function baseUrl(network = getActiveNetwork()): string {
  return SUISCAN_BASE[network];
}

export function suiscanUrl(
  kind: ExplorerKind,
  id: string,
  network = getActiveNetwork(),
): string {
  const base = baseUrl(network);
  switch (kind) {
    case 'tx':
      return `${base}/tx/${id}`;
    case 'account':
      return `${base}/account/${id}`;
    case 'object':
      return `${base}/object/${id}`;
    case 'package':
      return `${base}/package/${id}`;
  }
}

export function suiscanTxUrl(digest: string, network = getActiveNetwork()): string {
  return suiscanUrl('tx', digest, network);
}

export function suiscanAccountUrl(address: string, network = getActiveNetwork()): string {
  return suiscanUrl('account', address, network);
}
