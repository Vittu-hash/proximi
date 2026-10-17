# 8. MongoDB Replica Set Requirement for Multi-Document Transactions

## Status

Accepted

## Context

Proximi requires ACID guarantees across multiple collections during critical operations, such as creating borrow requests, updating item reservation arrays, and appending immutable event log records. In MongoDB, multi-document transactions are only supported on replica sets or sharded clusters; standalone mongod instances reject transaction sessions.

## Decision

Mandate a single-node replica set (`rs0`) across local development, continuous integration, and production environments. Local Docker Compose runs MongoDB with `--replSet rs0` and automated initialization. Continuous integration workflows execute the same containerized replica set services. All database connection strings include `replicaSet=rs0`.

## Consequences

- Multi-document transactions, commit, and rollback operate identically across all runtime environments.
- Application logic safely relies on atomic multi-collection operations without custom compensation handlers.
- Local development requires Docker or a replica-set-configured MongoDB service.

## Alternatives Considered

- Two-phase commit patterns in application code: High implementation complexity and vulnerability to partial failure states.
- Standalone MongoDB without transactions: Inability to guarantee atomicity between reservation updates and state changes.
