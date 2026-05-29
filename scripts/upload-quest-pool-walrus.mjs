/**
 * Upload quest pool JSON to Walrus testnet/mainnet.
 * Usage: npm run walrus:upload-pool
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

function getPublisherUrl() {
  const network = process.env.NEXT_PUBLIC_SUI_NETWORK ?? 'testnet';
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

function getAggregatorUrl() {
  const network = process.env.NEXT_PUBLIC_SUI_NETWORK ?? 'testnet';
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

async function main() {
  await loadEnv();

  const poolPath = path.join(__dirname, '..', 'data', 'quest-pool.json');
  const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
  const publisher = getPublisherUrl().replace(/\/$/, '');
  const aggregator = getAggregatorUrl().replace(/\/$/, '');
  const epochs = process.env.WALRUS_EPOCHS ?? '5';
  const network = process.env.NEXT_PUBLIC_SUI_NETWORK ?? 'testnet';

  console.log(`Network: ${network}`);
  console.log(`Publisher: ${publisher}`);
  console.log(`Uploading quest pool (${pool.questions?.length ?? 0} questions)...`);

  const body = JSON.stringify(pool);
  const res = await fetch(`${publisher}/v1/blobs?epochs=${epochs}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body,
  });

  if (!res.ok) {
    console.error('Upload failed:', await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const blobId =
    data.newlyCreated?.blobObject?.blobId ??
    data.alreadyCertified?.blobId;

  if (!blobId) {
    console.error('Unexpected response:', JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log('\nQuest pool stored on Walrus!');
  console.log('Blob ID:', blobId);
  console.log('Gateway:', `${aggregator}/v1/blobs/${blobId}`);
  console.log('\nAdd to .env.local:');
  console.log(`NEXT_PUBLIC_QUEST_POOL_BLOB_ID=${blobId}`);
}

main();
