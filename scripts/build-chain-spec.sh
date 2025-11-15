#!/bin/bash

# Build chain specification for R-Oracle

set -e

echo "Building chain specification..."

# Build the node first
cargo build --release --bin r-oracle-node

# Generate chain spec
./target/release/r-oracle-node build-spec --chain=dev > chain-specs/r-oracle-dev.json

# Generate raw chain spec
./target/release/r-oracle-node build-spec --chain=chain-specs/r-oracle-dev.json --raw > chain-specs/r-oracle-dev-raw.json

echo "Chain specification generated successfully!"
echo "Files:"
echo "  - chain-specs/r-oracle-dev.json"
echo "  - chain-specs/r-oracle-dev-raw.json"

