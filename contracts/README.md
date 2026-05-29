# DeFi Quest — Smart Contracts

## Do you need your own chain or RPC?

**No.** Your custom **DFQ token** is a normal ERC-20 deployed on **Sepolia** (or Polygon Amoy). Users need:

- **Sepolia ETH** — gas (from any Sepolia faucet)
- **DFQ** — your token (from the in-app `faucet()` or deployer mint)

You only need a **public RPC URL** (`SEPOLIA_RPC_URL`) — Alchemy, Infura, or `https://ethereum-sepolia-rpc.publicnode.com`. No private L2 or custom network.

## Contracts

| Contract | Role |
|----------|------|
| `DeFiQuestToken` | ERC-20 **DFQ** — faucet 1000 DFQ / 12h |
| `QuestBadgeNFT` | ERC-721 badge — mint costs **50 DFQ** |
| `QuestStaking` | Lock **≥10 DFQ** for bonus quest |

## Deploy (Sepolia)

1. Copy `.env.example` → `.env.local` and set `DEPLOYER_PRIVATE_KEY` + `SEPOLIA_RPC_URL`.
2. Fund deployer with Sepolia ETH.
3. Run:

```bash
npm install
npm run contracts:compile
npm run contracts:deploy:sepolia
```

4. Paste printed addresses into `.env.local`.

## Pin quest pool to IPFS

```bash
# Set PINATA_API_KEY + PINATA_SECRET_API_KEY in .env.local
npm run ipfs:pin-pool
```

Add `NEXT_PUBLIC_QUEST_POOL_CID` to `.env.local`.

## Faucets

- Sepolia ETH: https://sepoliafaucet.com / https://www.alchemy.com/faucets/ethereum-sepolia
- Polygon Amoy: use `contracts:deploy:amoy` + Amoy faucet if you prefer Polygon testnet
