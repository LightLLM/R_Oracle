# R-Oracle: Resilient Multi-Source Oracle Chain

[![CI](https://github.com/LightLLM/R_Oracle/workflows/CI/badge.svg)](https://github.com/LightLLM/R_Oracle/actions)
[![License](https://img.shields.io/badge/license-Unlicense-blue.svg)](LICENSE)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange.svg)](https://www.rust-lang.org/)
[![Node](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)

A resilient multi-source oracle chain built on Polkadot, providing reliable price data through multiple data sources with automatic failover mechanisms.

## 🎯 What is R-Oracle?

R-Oracle is a Substrate-based parachain that implements a resilient oracle system with:

- **Multi-Source Data**: Fetches data from multiple oracle providers (Binance, Coinbase, Kraken)
- **Automatic Failover**: Seamlessly switches between sources on failure
- **RPC Resilience**: Dual RPC endpoints with health checks
- **On-Chain Storage**: Stores oracle values and history on-chain
- **Modern Frontend**: Next.js dashboard for monitoring and interaction

## 🛡️ Why is it Resilient?

R-Oracle implements multiple layers of resilience:

1. **Oracle Source Failover**: Primary (Binance) → Fallback 1 (Coinbase) → Fallback 2 (Kraken)
2. **RPC Failover**: Primary (Polkadot Cloud) → Fallback (OnFinality)
3. **Data Validation**: Runtime-level validation ensures data integrity
4. **Transaction Retry**: Automatic retry logic for transient failures

See [docs/RESILIENCE.md](docs/RESILIENCE.md) for detailed information.

## 🏗️ Architecture

```
Frontend (Next.js) → RPC Layer (with Failover) → Parachain (Substrate) → Oracle APIs (with Failover)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## 📋 Prerequisites

- **Rust**: Latest stable version (install via [rustup.rs](https://rustup.rs/))
- **Node.js**: v18 or higher
- **Docker**: For containerized deployment (optional)
- **Polkadot.js Extension**: For wallet integration

## 🚀 Quick Start

### 1. Build the Chain

```bash
# Clone the repository
git clone <repository-url>
cd R_Oracle

# Build the node
cargo build --release

# Or use the build script
chmod +x scripts/build.sh
./scripts/build.sh
```

### 2. Run the Chain Locally

```bash
# Run in development mode
./target/release/r-oracle-node --dev

# Or with custom chain spec
./target/release/r-oracle-node --chain=dev --alice
```

The node will start and you can interact with it via:
- **RPC**: `ws://127.0.0.1:9944`
- **HTTP RPC**: `http://127.0.0.1:9933`

### 3. Run the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Connect Wallet

1. Install [Polkadot.js Extension](https://polkadot.js.org/extension/)
2. Create or import an account
3. Connect to the R-Oracle chain in the frontend

## 📦 Deployment

### Polkadot Cloud Deployment

#### 1. Build Chain Specification

```bash
chmod +x scripts/build-chain-spec.sh
./scripts/build-chain-spec.sh
```

This generates:
- `chain-specs/r-oracle-dev.json` - Human-readable chain spec
- `chain-specs/r-oracle-dev-raw.json` - Raw chain spec for deployment

#### 2. Build Docker Image

```bash
docker build -t r-oracle-node:latest .
```

#### 3. Deploy to Polkadot Cloud

1. Create a new project in Polkadot Cloud
2. Upload the Docker image
3. Configure chain spec (use raw chain spec)
4. Set environment variables:
   - `CHAIN=chain-specs/r-oracle-dev-raw.json`
   - `RPC_PORT=9933`
   - `WS_PORT=9944`
   - `P2P_PORT=30333`

#### 4. Update Frontend RPC

Update `frontend/src/lib/api.ts` with your deployed RPC endpoint:

```typescript
const PRIMARY_RPC = 'wss://your-deployed-endpoint.com';
```

### Local Docker Deployment

```bash
# Build and run
docker build -t r-oracle-node .
docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 r-oracle-node --dev
```

## 🔧 Configuration

### Chain Configuration

Edit `node/src/chain_spec.rs` to customize:
- Parachain ID
- Initial validators
- Genesis accounts
- Token properties

### Frontend Configuration

Environment variables (`.env.local`):
```bash
NEXT_PUBLIC_PRIMARY_RPC=wss://your-primary-rpc.com
NEXT_PUBLIC_FALLBACK_RPC=wss://your-fallback-rpc.com
```

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - System architecture overview
- [Sequence Diagrams](docs/SEQUENCE.md) - Data flow diagrams
- [Resilience Mechanisms](docs/RESILIENCE.md) - Detailed resilience explanation

## 🧪 Testing

### Pallet Tests

```bash
# Run all pallet tests
cargo test -p pallet-roracle

# Run with output
cargo test -p pallet-roracle -- --nocapture

# Run specific test
cargo test -p pallet-roracle test_submit_oracle_value_success
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

See [TESTING.md](TESTING.md) for detailed testing documentation.

## 🎯 Judging Criteria Alignment

### Technical Implementation
- ✅ **Substrate/Polkadot SDK**: Built on Substrate with custom pallet
- ✅ **Parachain Development**: Full parachain implementation
- ✅ **Custom Pallet**: `pallet-roracle` with storage, extrinsics, and events
- ✅ **Runtime Integration**: Properly integrated into runtime

### Innovation
- ✅ **Resilience**: Multi-layer failover mechanisms
- ✅ **Oracle System**: Multi-source oracle with automatic failover
- ✅ **RPC Resilience**: Dual RPC endpoints with health checks

### User Experience
- ✅ **Frontend**: Modern Next.js dashboard
- ✅ **Visualization**: Charts and timeline for failover events
- ✅ **Error Handling**: Clear error messages and recovery

### Documentation
- ✅ **README**: Comprehensive setup and usage instructions
- ✅ **Architecture Docs**: Detailed system documentation
- ✅ **Deployment Guide**: Polkadot Cloud deployment instructions

### Code Quality
- ✅ **Structure**: Well-organized codebase
- ✅ **Comments**: Code documentation
- ✅ **Best Practices**: Follows Substrate/Polkadot conventions

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the Unlicense - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Substrate](https://substrate.io/)
- Inspired by [Polkadot Hackathon Guide](https://github.com/polkadot-developers/hackathon-guide)
- Uses [Polkadot.js](https://polkadot.js.org/) for frontend integration

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/LightLLM/R_Oracle/issues)
- Check the documentation in `/docs`
- Review the code comments

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the Unlicense - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Substrate](https://substrate.io/)
- Inspired by [Polkadot Hackathon Guide](https://github.com/polkadot-developers/hackathon-guide)
- Uses [Polkadot.js](https://polkadot.js.org/) for frontend integration

---

**Built for the Polkadot Hackathon** 🚀

