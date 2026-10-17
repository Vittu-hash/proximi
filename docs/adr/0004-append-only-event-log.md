# 4. Append-Only EventLog in Transaction

## Status

Accepted

## Context

Trust and accountability are foundational requirements for community item lending. In the event of a dispute, damage, or delayed return, an immutable audit trail is necessary to reconstruct the exact sequence of events, actors, timestamps, and request contexts.

## Decision

Every lifecycle transition and significant domain action writes an immutable entry into the `EventLog` collection inside the same MongoDB transaction as the state change. The `EventLog` model only exposes an `append` method, with update and delete operations disallowed. In production environments, database user privileges on the `eventlogs` collection are restricted to insert-only (`readWrite` with update/delete privileges revoked on the collection).

## Consequences

- Full traceability for state transitions, actor interventions, and automated actions.
- Any failure to log an event rolls back the entire state transition transaction, ensuring data integrity.
- Storage scales linearly with domain activity; indexing on `{entityType:1, entityId:1, createdAt:1}` guarantees rapid chronological query retrieval.

## Alternatives Considered

- Asynchronous message bus event logging (e.g. Kafka/RabbitMQ): Risk of events being dropped if database succeeds but message broker publish fails before commit.
- In-memory event bus: Audit records lost on process crashes or restarts.
