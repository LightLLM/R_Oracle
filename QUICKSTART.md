# Quick Start Guide

## Prerequisites

1. **Install Rust**: https://rustup.rs/
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Install Node.js**: v18 or higher
   ```bash
   # Using nvm (recommended)
   nvm install 18
   nvm use 18
   ```

3. **Install Polkadot.js Extension**: https://polkadot.js.org/extension/

## Build and Run

### 1. Build the Chain

```bash
# Build the node
cargo build --release

# This will take 10-30 minutes on first build
```

### 2. Run the Chain

```bash
# Terminal 1: Run the node
./target/release/r-oracle-node --dev

# Wait for "Idle" status, then proceed
```

### 3. Run the Frontend

```bash
# Terminal 2: Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### 4. Access the Application

1. Open browser: http://localhost:3000
2. Install Polkadot.js Extension if not already installed
3. Create or import an account
4. Connect to the chain
5. Click "Submit Oracle Update" to test

## Testing Oracle Failover

### Test Oracle Source Failover

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Submit Oracle Update"
4. Watch console logs for failover messages:
   - "Successfully fetched price from Binance"
   - Or "Binance failed, trying next source..."

### Test RPC Failover

1. Stop the local node (Ctrl+C)
2. The frontend should automatically switch to fallback RPC
3. Check console for "Primary RPC failed, switching to fallback"

## Common Issues

### Build Errors

**Issue**: Missing dependencies
**Solution**: 
```bash
rustup update
cargo clean
cargo build --release
```

**Issue**: Version conflicts
**Solution**: Check Rust version (should be latest stable)
```bash
rustc --version
```

### Frontend Errors

**Issue**: Cannot connect to chain
**Solution**: 
- Ensure node is running
- Check RPC endpoint in `frontend/src/lib/api.ts`
- Verify port 9944 is not blocked

**Issue**: Extension not found
**Solution**:
- Install Polkadot.js Extension
- Refresh browser
- Grant permissions to the site

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- Review [docs/RESILIENCE.md](docs/RESILIENCE.md) for failover mechanisms

