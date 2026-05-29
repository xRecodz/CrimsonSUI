import { getActiveNetwork } from '@/lib/sui/network';

export type WalrusStoreResponse = {
  newlyCreated?: {
    blobObject: {
      id: string;
      blobId: string;
      storage: { storageSize: string; endEpoch: string };
    };
    resourceOperation?: { resourceId: string; operation: string };
  };
  alreadyCertified?: {
    blobId: string;
    endEpoch: string;
    event?: { txDigest: string };
  };
};

export type WalrusUploadResult = {
  blobId: string;
  suiObjectId?: string;
  endEpoch?: string;
  gatewayUrl: string;
  raw: WalrusStoreResponse;
};

function getPublisherUrl(): string {
  const network = getActiveNetwork();
  if (network === 'mainnet') {
    return (
      process.env.WALRUS_PUBLISHER_URL_MAINNET ??
      process.env.WALRUS_PUBLISHER_URL ??
      'https://publisher.walrus-testnet.walrus.space'
    );
  }
  return (
    process.env.WALRUS_PUBLISHER_URL ??
    'https://publisher.walrus-testnet.walrus.space'
  );
}

function getAggregatorUrl(): string {
  const network = getActiveNetwork();
  if (network === 'mainnet') {
    return (
      process.env.WALRUS_AGGREGATOR_URL_MAINNET ??
      process.env.WALRUS_AGGREGATOR_URL ??
      'https://aggregator.walrus-testnet.walrus.space'
    );
  }
  return (
    process.env.WALRUS_AGGREGATOR_URL ??
    'https://aggregator.walrus-testnet.walrus.space'
  );
}

function getEpochs(): number {
  const v = Number(process.env.WALRUS_EPOCHS ?? 5);
  return Number.isFinite(v) && v > 0 ? v : 5;
}

export function walrusBlobUrl(blobId: string): string {
  const base = getAggregatorUrl().replace(/\/$/, '');
  return `${base}/v1/blobs/${blobId}`;
}

export function parseWalrusStoreResponse(
  data: WalrusStoreResponse,
): WalrusUploadResult {
  if (data.newlyCreated?.blobObject) {
    const obj = data.newlyCreated.blobObject;
    return {
      blobId: obj.blobId,
      suiObjectId: obj.id,
      endEpoch: obj.storage?.endEpoch,
      gatewayUrl: walrusBlobUrl(obj.blobId),
      raw: data,
    };
  }

  if (data.alreadyCertified) {
    const { blobId, endEpoch } = data.alreadyCertified;
    return {
      blobId,
      endEpoch,
      gatewayUrl: walrusBlobUrl(blobId),
      raw: data,
    };
  }

  throw new Error('Unexpected Walrus store response shape');
}

/** Store raw bytes on Walrus via public/authenticated publisher HTTP API. */
export async function storeBlobOnWalrus(
  data: Uint8Array | Buffer | string,
  options?: { epochs?: number; sendObjectTo?: string },
): Promise<WalrusUploadResult> {
  const publisher = getPublisherUrl().replace(/\/$/, '');
  const epochs = options?.epochs ?? getEpochs();
  const params = new URLSearchParams({ epochs: String(epochs) });
  if (options?.sendObjectTo) {
    params.set('send_object_to', options.sendObjectTo);
  }

  const body =
    typeof data === 'string' ? new TextEncoder().encode(data) : data;

  const res = await fetch(`${publisher}/v1/blobs?${params}`, {
    method: 'PUT',
    body: body as BodyInit,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Walrus upload failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as WalrusStoreResponse;
  return parseWalrusStoreResponse(json);
}

/** Store JSON on Walrus. */
export async function storeJsonOnWalrus(
  payload: unknown,
  options?: { epochs?: number; sendObjectTo?: string },
): Promise<WalrusUploadResult & { json: unknown }> {
  const jsonString = JSON.stringify(payload);
  const result = await storeBlobOnWalrus(jsonString, options);
  return { ...result, json: payload };
}

/** Read blob bytes from Walrus aggregator. */
export async function readBlobFromWalrus(blobId: string): Promise<ArrayBuffer> {
  const url = walrusBlobUrl(blobId);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Walrus read failed (${res.status}) for blob ${blobId}`);
  }
  return res.arrayBuffer();
}

/** Read and parse JSON blob from Walrus. */
export async function readJsonFromWalrus<T = unknown>(blobId: string): Promise<T> {
  const buf = await readBlobFromWalrus(blobId);
  const text = new TextDecoder().decode(buf);
  return JSON.parse(text) as T;
}

export function getWalrusEndpoints() {
  return {
    publisher: getPublisherUrl(),
    aggregator: getAggregatorUrl(),
    epochs: getEpochs(),
    network: getActiveNetwork(),
  };
}
