# Proximi

[![CI](https://github.com/Vittu-hash/proximi/actions/workflows/ci.yml/badge.svg)](https://github.com/Vittu-hash/proximi/actions/workflows/ci.yml)

Proximi is a trust-first resource-sharing platform enabling verified members of closed communities—such as university campuses, hostels, and residential apartment complexes—to securely lend and borrow high-value, infrequently used items with complete confidence and transparency.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker Desktop with Docker Compose

## Setup

1. Clone the repository:
```bash
git clone git@github.com:Vittu-hash/proximi.git
cd proximi
```

2. Install dependencies:
```bash
npm install
```

3. Prepare environment variables:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

4. Start local replica-set MongoDB:
```bash
docker compose up -d
```

5. Verify MongoDB replica set status:
```bash
docker compose exec mongo mongosh --quiet --eval "rs.status().ok"
```

## Available Scripts

- `npm run dev`: Runs development servers across all workspaces.
- `npm run lint`: Executes linting checks across all workspaces.
- `npm run typecheck`: Runs TypeScript compiler checks across all workspaces.
- `npm run test`: Runs test suites across all workspaces.
- `npm run format`: Formats codebase across all workspaces using Prettier.
