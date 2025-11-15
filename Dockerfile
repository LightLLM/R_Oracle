# Build stage
FROM paritytech/ci-linux:production as builder

WORKDIR /build

# Copy workspace files
COPY Cargo.toml Cargo.lock ./
COPY runtime/Cargo.toml ./runtime/
COPY node/Cargo.toml ./node/
COPY pallets/roracle/Cargo.toml ./pallets/roracle/

# Copy source code
COPY runtime/src ./runtime/src
COPY node/src ./node/src
COPY pallets/roracle/src ./pallets/roracle/src

# Build the node
RUN cargo build --release --bin r-oracle-node

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/target/release/r-oracle-node /usr/local/bin/

# Expose ports
EXPOSE 30333 9933 9944

# Run the node
ENTRYPOINT ["/usr/local/bin/r-oracle-node"]

