# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure
- Custom pallet `pallet-roracle` with storage, extrinsics, and events
- Next.js frontend with dashboard and charts
- Oracle failover mechanism (Binance → Coinbase → Kraken)
- RPC failover with health checks
- Comprehensive test suite
- Documentation (README, architecture, sequence diagrams)
- GitHub Actions CI/CD workflows
- Docker support

## [1.0.0] - 2024-01-XX

### Added
- Initial release of R-Oracle
- Substrate-based parachain implementation
- Multi-source oracle with automatic failover
- On-chain storage of oracle values and history
- Modern web dashboard
- Polkadot Cloud deployment support

[Unreleased]: https://github.com/LightLLM/R_Oracle/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/LightLLM/R_Oracle/releases/tag/v1.0.0

