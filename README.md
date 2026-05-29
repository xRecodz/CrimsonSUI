# Crimson — DeFi Quest (Sui + Walrus + Tatum)

Gamified DeFi learning on **Sui testnet**: daily quizzes, weekly **QuestBadge** NFT mint, DFQ faucet & staking, **Walrus** quest proofs, and a wallet-linked leaderboard. Built for the **Tatum × Walrus** hackathon.

## Live demo

https://crimson-zeta.vercel.app/

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
7. **Stake DFQ** for the **Hidden / Bonus quest** (see below) → sync XP on the leaderboard.
8. Verify on explorers:
   - [Package on Suiscan](https://suiscan.xyz/testnet/package/0xcacf1b48c3dcc9b37ff5d5c56ec10ee7297e81d5f7baf1b167055e06cff441e4)
   - Wallet / tx links in the Quests UI after on-chain actions.

## Bonus quest — scaled XP (the tricky part)

The **Hidden Staking Quest** is the endgame leaderboard push. It is easy to misunderstand because **Bonus XP is not flat +1,000** — it **scales with how much DFQ you stake**, within caps and unlock rules.

### Unlock & limits

| Rule | Detail |
|------|--------|
| **Unlock** | Only after you **mint the weekly QuestBadge** (`nftBadgeMinted`). Farm dailies → weekly first. |
| **One shot** | **Once per wallet** progress save. You cannot complete the bonus quest again. |
| **Season** | Must be inside `NEXT_PUBLIC_SEASON_START` → `NEXT_PUBLIC_SEASON_END` (UTC). |
| **Minimum stake** | **10 DFQ** (on-chain when contracts are connected). Below that → **0 Bonus XP**. |

### How Bonus XP is calculated

Implemented in `lib/bonus-xp.ts`:

```text
Bonus XP = 1,000 (base at min stake)
         + floor( extra_DFQ × rate )

extra_DFQ = min(stakeAmount, STAKE_CAP) − 10
```

| Constant | Default | Env override |
|----------|---------|----------------|
| Base at 10 DFQ | **1,000 XP** | — |
| Rate per DFQ above 10 | **+50 XP / DFQ** | `NEXT_PUBLIC_BONUS_XP_PER_DFQ` |
| Stake counted for scaling (cap) | **1,000 DFQ max** | `NEXT_PUBLIC_BONUS_STAKE_XP_CAP` |

**Examples (defaults):**

| DFQ staked | Calculation | Bonus XP earned |
|------------|-------------|-----------------|
| 10 | base only | **1,000** |
| 100 | 1,000 + (90 × 50) | **5,500** |
| 500 | 1,000 + (490 × 50) | **25,500** |
| 1,000 | 1,000 + (990 × 50) | **50,500** |
| 2,000+ | cap at 1,000 DFQ for scaling | **50,500** (same as 1,000) |

The quest panel shows a live **“Estimated reward”** breakdown (base + scaling, and whether the cap was hit).

### Two XP buckets on the leaderboard

| Field | Source |
|-------|--------|
| **`totalXp`** | Daily (+100 each) and weekly quest rewards |
| **`bonusXp`** | Hidden staking quest only (scaled amount above) |
| **Leaderboard total** | `totalXp + bonusXp` (see `getTotalXp` in `lib/quest-engine.ts`) |

So a player with many dailies but no bonus will rank differently from someone who min-stakes 10 DFQ for +1,000 Bonus XP — and a whale stake near the cap can jump the board with **+50,500** in one completion.

### On-chain stake vs typed amount (important)

When Sui contracts are configured, clicking **Stake & earn**:

1. Sends a real **stake transaction** to `StakingPool`.
2. Re-reads your **total staked DFQ** from chain.
3. Awards Bonus XP from that **on-chain total**, not from a “simulated” local-only number.

If you already had DFQ staked, the rewarded XP uses **cumulative staked balance**. Stake at least **10 DFQ total** before expecting any Bonus XP.

### Strategy tips (for demo / judges)

1. Complete **5 dailies** → **mint badge** to unlock the panel.
2. Use the **DFQ faucet** if you need tokens; keep **SUI** for gas.
3. Preview XP in the yellow box before submitting — staking more DFQ increases XP until the **1,000 DFQ scaling cap**.
4. **Sync leaderboard** after bonus so `totalXp + bonusXp` appears globally (server-side store on Vercel is best-effort; refresh if needed).

Proof of completion is stored on **Walrus** like other quests (`bonusXpEarned` in metadata).

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
- `NEXT_PUBLIC_SEASON_START`, `NEXT_PUBLIC_SEASON_END` (bonus quest window)
- `NEXT_PUBLIC_BONUS_XP_PER_DFQ`, `NEXT_PUBLIC_BONUS_STAKE_XP_CAP` (bonus scaling tuning)

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
