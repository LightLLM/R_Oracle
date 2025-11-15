# Push to GitHub - Quick Guide

Your repository is already created at: **https://github.com/LightLLM/R_Oracle**

## Quick Push Instructions

### Step 1: Initialize Git (if not already done)

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: R-Oracle resilient multi-source oracle chain

- Custom pallet-roracle with storage, extrinsics, and events
- Next.js frontend with dashboard and charts
- Oracle failover mechanism (Binance → Coinbase → Kraken)
- RPC failover with health checks
- Comprehensive test suite
- Documentation and deployment files"
```

### Step 4: Add Remote

```bash
git remote add origin https://github.com/LightLLM/R_Oracle.git
```

If remote already exists, update it:
```bash
git remote set-url origin https://github.com/LightLLM/R_Oracle.git
```

### Step 5: Push to GitHub

```bash
# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## If You Get Authentication Errors

### Option 1: Use Personal Access Token

1. Generate token at: https://github.com/settings/tokens
2. Use token as password when pushing

### Option 2: Use SSH

```bash
# Change remote to SSH
git remote set-url origin git@github.com:LightLLM/R_Oracle.git

# Push
git push -u origin main
```

## Verify Upload

1. Visit: https://github.com/LightLLM/R_Oracle
2. Check that all files are present
3. Verify README.md displays correctly
4. Check that GitHub Actions are enabled

## Next Steps After Push

1. **Enable GitHub Actions** (if not already enabled)
   - Go to Settings → Actions → General
   - Enable "Allow all actions"

2. **Add Repository Topics**
   - Go to repository main page
   - Click gear icon next to "About"
   - Add: `polkadot`, `substrate`, `parachain`, `oracle`, `blockchain`, `rust`, `nextjs`, `hackathon`

3. **Create First Release**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

4. **Update Repository Description**
   - Go to Settings → General
   - Description: "Resilient Multi-Source Oracle Chain built on Polkadot"

## Troubleshooting

### Large Files
If you have files > 100MB, they won't be pushed. Check with:
```bash
find . -type f -size +10M
```

### Push Rejected
If push is rejected:
```bash
git pull origin main --rebase
git push origin main
```

### Check Status
```bash
git status
git remote -v
git log --oneline
```

