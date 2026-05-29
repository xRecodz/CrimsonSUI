import { JsonRpcHTTPTransport, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import {
  getActiveNetwork,
  getPublicSuiRpcUrl,
  getSuiRpcUrl,
  getTatumApiKey,
  type SuiNetwork,
} from './network';

/** Tatum-backed Sui client for server-side use (includes x-api-key). */
export function createTatumSuiClient(network?: SuiNetwork): SuiJsonRpcClient {
  const net = network ?? getActiveNetwork();
  const url = getSuiRpcUrl(net);
  const apiKey = getTatumApiKey(net);

  return new SuiJsonRpcClient({
    network: net,
    transport: new JsonRpcHTTPTransport({
      url,
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          headers: {
            ...(init?.headers ?? {}),
            'x-api-key': apiKey,
          },
        }),
    }),
  });
}

/** Browser-safe client via same-origin RPC proxy (no API key exposed). */
export function createBrowserSuiClient(): SuiJsonRpcClient {
  if (typeof window !== 'undefined') {
    return new SuiJsonRpcClient({ url: '/api/sui/rpc', network: 'testnet' });
  }
  return createTatumSuiClient();
}

export function getDeployerKeypair(): Ed25519Keypair {
  const secret = process.env.SUI_DEPLOYER_PRIVATE_KEY;
  if (!secret) {
    throw new Error('SUI_DEPLOYER_PRIVATE_KEY is not set');
  }
  return Ed25519Keypair.fromSecretKey(secret);
}

export function getDeployerAddress(): string {
  return (
    process.env.SUI_DEPLOYER_ADDRESS ??
    getDeployerKeypair().getPublicKey().toSuiAddress()
  );
}

/** @deprecated Use getPublicSuiRpcUrl from ./network */
export function getPublicSuiUrl(network: SuiNetwork = getActiveNetwork()): string {
  return getPublicSuiRpcUrl(network);
}
