#!/bin/bash

# Build script for R-Oracle

set -e

echo "Building R-Oracle node..."

# Install dependencies if needed
if ! command -v cargo &> /dev/null; then
    echo "Error: Cargo not found. Please install Rust: https://rustup.rs/"
    exit 1
fi

# Build release
cargo build --release --bin r-oracle-node

echo "Build complete!"
echo "Binary location: ./target/release/r-oracle-node"

