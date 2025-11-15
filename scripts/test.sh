#!/bin/bash

# Test script for R-Oracle

set -e

echo "Running R-Oracle tests..."
echo ""

# Test pallet
echo "=== Testing Pallet ==="
cargo test -p pallet-roracle -- --nocapture
echo ""

# Test frontend
if [ -d "frontend" ]; then
    echo "=== Testing Frontend ==="
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    npm test
    cd ..
    echo ""
fi

echo "All tests completed!"

