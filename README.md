# Crimson — DeFi Quest (Sui + Walrus + Tatum)

Gamified DeFi learning on **Sui testnet**: daily quizzes, weekly **QuestBadge** NFT mint, DFQ faucet & staking, **Walrus** quest proofs, and a wallet-linked leaderboard. Built for the **Tatum × Walrus** hackathon.

## Live demo

> Replace with your Vercel URL after deploy: `https://crimson-zeta.vercel.app/`

## Author & contact

| | Link |
|---|------|
| **GitHub** | [github.com/xrecodz](https://github.com/xrecodz) |
| **Twitter / X** | [@xrecodz](https://twitter.com/xrecodz) |
| **Repository** | [github.com/xRecodz/CrimsonSUI](https://github.com/xRecodz/CrimsonSUI) |
| **Email** | f.nurrahman910@gmail.com |

## Tech stack

| Layer | Technology |
|--------|------------|
| Chain | Sui Move (`crimson_quest` package) |
| Storage | Walrus testnet (quest proofs + badge metadata) |
| RPC | Tatum Sui gateway + public fullnode fallback |
| App | Next.js 16, `@mysten/dapp-kit` |

## How to play (judges / testers)

1. Install [Slush](https://slush.app/) or any Sui wallet → switch to **Testnet**.
2. Get test SUI from the [Sui faucet](https://faucet.sui.io/).
3. Open the app → **Connect wallet** → go to **Quests**.
4. **Claim DFQ faucet** (1000 DFQ, 12h cooldown).
5. Complete **daily** quests (+100 XP each) → proofs appear in **Walrus proof viewer**.
6. Complete **5 dailies in the week** → **Mint weekly badge** (50 DFQ fee, on-chain `QuestBadge`).
7. **Stake DFQ** for the bonus quest → sync XP on the leaderboard.
8. Verify on explorers:
   - [Package on Suiscan](https://suiscan.xyz/testnet/package/0xcacf1b48c3dcc9b37ff5d5c56ec10ee7297e81d5f7baf1b167055e06cff441e4)
   - Wallet / tx links in the Quests UI after on-chain actions.

## Deployed contracts (Sui testnet)

| Object | ID |
|--------|-----|
| Package | `0xcacf1b48c3dcc9b37ff5d5c56ec10ee7297e81d5f7baf1b167055e06cff441e4` |
| Faucet | `0xf8db4c2e04663f19bfad66c98dda03fbd5253b3f9785767bad90f1e30e6aca71` |
| BadgeRegistry | `0x0b45a7ed69e5a69002f3496ef7be9d13bc10659ab7cd6f0a503e47832c75c633` |
| StakingPool | `0xc7161155f8c6eca7886f2f5eefac95dc86140acc000a083d60455afd813f1f19` |

Publish digest: `3eEkhHEtk9dfFGFzYV4QHpuHPgTgDhSiqrMwu9Fh9b2B`  
Also stored in `lib/contracts/deployed-sui.json`.

## Walrus

- Quest pool blob (env `NEXT_PUBLIC_QUEST_POOL_BLOB_ID`): configure after `npm run walrus:upload-pool`
- Proofs: uploaded per quest completion via `/api/walrus/upload`
- Read via aggregator: `https://aggregator.walrus-testnet.walrus.space/v1/blobs/<blobId>`

## Generate & publish quest pool

Daily quests are loaded from **`data/quest-pool.json`** (local fallback) or from **Walrus** when `NEXT_PUBLIC_QUEST_POOL_BLOB_ID` is set.

### 1. Generate questions locally

Regenerates `data/quest-pool.json` from the built-in question bank in the script:

```bash
npm run generate:quest-pool
```

This runs `scripts/generate-quest-pool.mjs` and writes **53** DeFi + Sui/Walrus quiz/vote questions to `data/quest-pool.json`.

**To add or edit questions:** open `scripts/generate-quest-pool.mjs`, edit the `questions` array (each item needs `type`, `title`, `question`, `options`, `correctOptionId`), then run the command again.

Example question shape:

```json
{
  "type": "quiz",
  "title": "Liquidity Pool Basics",
  "question": "What is impermanent loss in an AMM?",
  "options": [
    { "id": "a", "label": "..." },
    { "id": "b", "label": "..." }
  ],
  "correctOptionId": "b"
}
```

### 2. Upload pool to Walrus (production)

Requires `.env.local` with Walrus URLs (see `.env.example`). Then:

```bash
npm run walrus:upload-pool
```

The script uploads `data/quest-pool.json` to Walrus testnet and prints:

```text
NEXT_PUBLIC_QUEST_POOL_BLOB_ID=<blobId>
```

Copy that value into **`.env.local`** and **Vercel Environment Variables**, then redeploy.

### 3. Verify

- **Local:** restart `npm run dev` — daily quests should pull from the new pool (Walrus if blob ID is set, else bundled JSON).
- **Walrus:** open `https://aggregator.walrus-testnet.walrus.space/v1/blobs/<blobId>` in a browser to see the JSON.

> Per-wallet daily quests are derived from the pool + wallet address (deterministic shuffle). You do not need to redeploy Move contracts when only the question pool changes.

## Local development

```bash
npm install
cp .env.example .env.local   # fill Tatum keys + contract IDs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run generate:quest-pool` | Regenerate `data/quest-pool.json` |
| `npm run walrus:upload-pool` | Upload quest pool JSON to Walrus |
| `npm run sui:deploy` | Publish Move package (needs `SUI_DEPLOYER_PRIVATE_KEY`) |

## Environment variables

See `.env.example`. **Never commit** `.env.local`.

**Required for production (Vercel):**

- `NEXT_PUBLIC_SUI_NETWORK=testnet`
- `NEXT_PUBLIC_CRIMSON_PACKAGE_ID`, `NEXT_PUBLIC_FAUCET_OBJECT_ID`, `NEXT_PUBLIC_BADGE_REGISTRY_ID`, `NEXT_PUBLIC_STAKING_POOL_ID`
- `NEXT_PUBLIC_QUEST_POOL_BLOB_ID`
- `TATUM_API_KEY_TESTNET`, `SUI_RPC_URL_TESTNET`, `SUI_PUBLIC_RPC_TESTNET`
- `WALRUS_PUBLISHER_URL`, `WALRUS_AGGREGATOR_URL`, `WALRUS_EPOCHS`

**Not needed on Vercel:** `SUI_DEPLOYER_PRIVATE_KEY` (deploy-only).

## Project structure

```
app/                 # Next.js routes + API (Walrus, Sui RPC proxy, stats)
components/          # UI (quests, hero, leaderboard)
hooks/               # Wallet + contract hooks
lib/contracts/       # Sui config, reads, transactions, deployed-sui.json
move/crimson_quest/  # Move source
scripts/             # generate-quest-pool, deploy-sui, Walrus upload
data/                # quest pool + FAQ
```

## Security

See [SECURITY.md](./SECURITY.md). Do not commit private keys or Tatum API keys.

## License

MIT (hackathon submission).
