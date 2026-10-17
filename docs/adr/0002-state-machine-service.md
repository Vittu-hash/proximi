# 2. State Machine Service and Declarative Transition Table

## Status

Accepted

## Context

BorrowRequest lifecycles involve complex state flows (T1 to T13, N1, N2), multiple actors (borrower, owner, admin, system), preconditions, side effects (reservation adjustments, notifications, event logging), and terminal states. Scattered status updates across controllers lead to race conditions, incomplete transitions, and missing audit trails.

## Decision

All state transitions for `BorrowRequest` are centralized inside a dedicated state machine service module (`src/services/borrowRequest.transitions.ts`). Controllers and route handlers are strictly prohibited from writing or assigning the `status` field. A declarative transition table enforces actor permissions, preconditions, atomic updates, and triggered side effects. An automated ESLint `no-restricted-syntax` rule prevents direct assignment to `status` outside `borrowRequest.transitions.ts`.

## Consequences

- All transition logic is encapsulated, fully testable, and auditable in one place.
- Invalid state transitions fail predictably with 409 Conflict.
- Static analysis guarantees no accidental status mutations bypass business rules.

## Alternatives Considered

- Ad-hoc controller status updates: Prone to missed side effects, broken invariants, and inconsistent audits.
- Full external workflow engine (e.g. Temporal, Camunda): Overkill for single-database transactional lifecycle management in this project stage.
