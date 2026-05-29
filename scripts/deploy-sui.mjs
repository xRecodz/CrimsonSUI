/**
 * Build and publish crimson_quest Move package to Sui testnet.
 * Usage: node scripts/deploy-sui.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { fromBase64 } from '@mysten/bcs';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PACKAGE_DIR = path.join(ROOT, 'move', 'crimson_quest');
const SUI_BIN = path.join(ROOT, 'tools', 'sui.exe');

async function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
}

function getPublishBytecode() {
  const raw = execSync(
    `"${SUI_BIN}" move build --dump-bytecode-as-base64 --path "${PACKAGE_DIR}"`,
    { encoding: 'utf8', cwd: ROOT },
  );
  const jsonLine = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('{'))
    .pop();
  if (!jsonLine) throw new Error('Failed to read build output from sui move build');
  return JSON.parse(jsonLine);
}

async function findObjectsFromPublishTx(client, digest) {
  const tx = await client.getTransactionBlock({
    digest,
    options: { showObjectChanges: true },
  });

  const changes = tx.objectChanges ?? [];
  const created = changes.filter((c) => c.type === 'created');

  const faucet = created.find((c) => c.objectType?.includes('::crimson::Faucet'));
  const registry = created.find((c) =>
    c.objectType?.includes('::crimson::BadgeRegistry'),
  );
  const pool = created.find((c) => c.objectType?.includes('::crimson::StakingPool'));

  return {
    faucetId: faucet?.objectId,
    registryId: registry?.objectId,
    poolId: pool?.objectId,
  };
}

async function main() {
  await loadEnv();

  const secret = process.env.SUI_DEPLOYER_PRIVATE_KEY;
  if (!secret) {
    console.error('Set SUI_DEPLOYER_PRIVATE_KEY in .env.local');
    process.exit(1);
  }

  const rpc =
    process.env.SUI_PUBLIC_RPC_TESTNET ??
    'https://fullnode.testnet.sui.io:443';

  const keypair = Ed25519Keypair.fromSecretKey(secret);
  const sender = keypair.getPublicKey().toSuiAddress();

  const client = new SuiJsonRpcClient({ network: 'testnet', url: rpc });

  console.log('Deployer:', sender);
  const balance = await client.getBalance({ owner: sender });
  console.log('SUI balance:', Number(balance.totalBalance) / 1e9, 'SUI');

  console.log('Building Move package…');
  const built = getPublishBytecode();
  const modules = built.modules.map((m) => fromBase64(m));
  const dependencies = built.dependencies;

  const tx = new Transaction();
  const [upgradeCap] = tx.publish({ modules, dependencies });
  tx.transferObjects([upgradeCap], sender);

  console.log('Publishing package…');
  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showEffects: true, showObjectChanges: true },
  });

  await client.waitForTransaction({ digest: result.digest });

  const packageId = result.objectChanges?.find((c) => c.type === 'published')?.packageId;

  if (!packageId) {
    console.error('Could not find package ID in transaction');
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const objects = await findObjectsFromPublishTx(client, result.digest);

  console.log('\n✅ Published crimson_quest');
  console.log('Package ID:', packageId);
  console.log('Faucet:', objects.faucetId);
  console.log('BadgeRegistry:', objects.registryId);
  console.log('StakingPool:', objects.poolId);
  console.log('Tx:', result.digest);
  console.log('\nAdd to .env.local:');
  console.log(`NEXT_PUBLIC_CRIMSON_PACKAGE_ID=${packageId}`);
  console.log(`NEXT_PUBLIC_FAUCET_OBJECT_ID=${objects.faucetId}`);
  console.log(`NEXT_PUBLIC_BADGE_REGISTRY_ID=${objects.registryId}`);
  console.log(`NEXT_PUBLIC_STAKING_POOL_ID=${objects.poolId}`);

  const outPath = path.join(ROOT, 'lib', 'contracts', 'deployed-sui.json');
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        packageId,
        faucetId: objects.faucetId,
        badgeRegistryId: objects.registryId,
        stakingPoolId: objects.poolId,
        deployer: sender,
        digest: result.digest,
        network: 'testnet',
        deployedAt: new Date().toISOString(),
      },
      null,
      2,
    ) + '\n',
  );
  console.log('\nWrote', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
