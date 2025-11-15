# R-Oracle Architecture

## Overview

R-Oracle is a resilient multi-source oracle chain built on Polkadot. It provides reliable price data through multiple data sources with automatic failover mechanisms.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │  History     │  │   Submit     │      │
│  │   Component  │  │   Chart      │  │   Button     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ @polkadot/api
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              RPC Layer (with Failover)                       │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Primary    │──────────────│   Fallback   │            │
│  │  Polkadot    │   Health     │   OnFinality │            │
│  │    Cloud     │   Check      │              │            │
│  └──────────────┘              └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              R-Oracle Parachain (Substrate)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              pallet-roracle                          │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │ LastValue  │  │  History   │  │  Events    │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  │                                                      │   │
│  │  submit_oracle_value(value, source, status)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Oracle Data Sources (Failover)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Primary    │  │  Fallback 1  │  │  Fallback 2  │      │
│  │   Binance    │──│   Coinbase   │──│   Kraken     │      │
│  │   API        │  │     API      │  │     API      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Frontend Layer
- **Next.js Application**: React-based UI for interacting with the oracle
- **Dashboard**: Displays last oracle value, source, and status
- **History Chart**: Visualizes price history over time
- **Submit Button**: Triggers oracle update with failover

### 2. RPC Layer
- **Primary RPC**: Polkadot Cloud endpoint
- **Fallback RPC**: OnFinality public endpoint
- **Health Checks**: Automatic switching on failure

### 3. Parachain Layer
- **Substrate Runtime**: Custom runtime with pallet-roracle
- **Storage**: LastValue, History, HistoryIndex
- **Extrinsics**: submit_oracle_value
- **Events**: ValueUpdated

### 4. Oracle Data Sources
- **Primary**: Binance API
- **Fallback 1**: Coinbase API
- **Fallback 2**: Kraken API

## Resilience Mechanisms

### 1. Oracle Source Failover
- Automatic switching between data sources
- Primary → Fallback 1 → Fallback 2
- Error handling and retry logic

### 2. RPC Failover
- Health check monitoring
- Automatic endpoint switching
- Connection recovery

### 3. Data Validation
- Value validation (non-zero)
- Source validation (non-empty)
- Timestamp tracking

## Data Flow

1. User clicks "Submit Oracle Update"
2. Frontend fetches price from oracle sources (with failover)
3. Frontend submits transaction to parachain via RPC (with failover)
4. Parachain validates and stores data
5. Event emitted: ValueUpdated
6. Frontend updates display with new data

