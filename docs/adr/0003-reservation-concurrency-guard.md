# 3. Reservation Concurrency Guard and Inclusive UTC Dates

## Status

Accepted

## Context

When multiple borrow requests are submitted for the same item with overlapping time windows, concurrent owner approvals could cause double-booking. Additionally, inconsistent time zones and fractional timestamps create edge cases in loan period calculations.

## Decision

Double-booking is prevented using item-embedded reservations executed inside a MongoDB multi-document transaction (`session`). An atomic `Item.updateOne` with an `$elemMatch` guard queries for absence of overlapping reservations in the date range `[startDate, endDate]`. If the update matches 0 documents, the transaction aborts and returns 409 Conflict. All dates are normalized to day-level UTC midnight timestamps, representing an inclusive date range `[startDate, endDate]`.

## Consequences

- Atomic concurrency guard guarantees zero double-booking even under high concurrency.
- Single-node MongoDB replica set is required in local development and CI to support multi-document ACID transactions.
- Day-level UTC boundaries simplify reservation comparisons and eliminate timezone daylight saving ambiguities.

## Alternatives Considered

- Pessimistic locking via Redis: Adds external infrastructure dependency and failure modes.
- Separate Reservations collection: Requires compound multi-collection locking and increases contention overhead compared to embedding within Item.
