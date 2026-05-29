# Security

## Secrets

- **Never commit** `.env.local`, `.env`, or files containing `suiprivkey`, deployer keys, or Tatum API keys.
- `.gitignore` excludes `.env*.local` and common key patterns.
- **Vercel:** set secrets only in the project Environment Variables UI — not in the repo.

## If a key was exposed

1. **Tatum:** rotate or revoke the key in [Tatum Dashboard](https://dashboard.tatum.io).
2. **Deployer wallet:** transfer remaining assets to a new wallet; do not reuse the leaked `SUI_DEPLOYER_PRIVATE_KEY`.
3. **Git history:** if a key was pushed, treat it as compromised even after deletion; rotate keys.

## Production checklist

- [ ] `.env.local` not tracked by git (`git status` clean of env files)
- [ ] `SUI_DEPLOYER_PRIVATE_KEY` omitted from Vercel (deploy from CI/local only)
- [ ] `TATUM_API_KEY_TESTNET` only on server / Vercel env (browser uses `/api/sui/rpc` proxy)
- [ ] No private keys in README, issues, or demo videos

## Reporting

For this hackathon project, contact: f.nurrahman910@gmail.com
