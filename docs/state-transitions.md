# State Transitions

Item state "Listed" = `Item.status = active`. Multiple requests may be pending on one item. Request lifecycle begins at T1.

## Transition Table

| ID | Transition | Actor | Preconditions | Side effects | Notifications |
|---|---|---|---|---|---|
| T1 | ∅ → Requested | Borrower | Item active and same community; borrower ≠ owner; borrower status active; startDate ≥ today; endDate ≥ startDate; duration within item min/max loan days; no open request by this borrower on this item; borrower open-request cap not exceeded; no overlap with existing reservation | Create request; event `request.created` | Owner: `request.received` |
| T2 | Requested → Approved | Owner | Actor owns item; item active; startDate ≥ today; atomic reservation insert succeeds | Single transaction: guarded status update, reservation pushed, `approvedAt` set, T4 run for overlapping pending requests; exact address becomes readable to borrower; event `request.approved` | Borrower: `request.approved` |
| T3 | Requested → Rejected | Owner | Actor owns item; optional reason ≤ 500 chars | `decision` recorded; event `request.rejected` | Borrower: `request.rejected` |
| T4 | Requested → Rejected (auto) | System | Fired inside T2; same item; date overlap with the newly approved request | `decision.kind = auto_rejected`; event `request.auto_rejected` | Borrower: `request.rejected` |
| T5 | Requested → Cancelled | Borrower | Actor is borrower | `decision` recorded; event `request.cancelled` | Owner: `request.cancelled` |
| T6 | Approved → Cancelled | Borrower or Owner | Handover not confirmed; owner cancellation requires reason | Reservation removed; address access revoked; cancelling party recorded for Stage 8 reputation; event `request.cancelled` | Counterparty: `request.cancelled` |
| N1 | Approved → Approved (no status change) | Owner | Handover record submitted: 1 to 8 condition photos; today ≥ startDate − 1 day and ≤ endDate | `handover.submittedAt`, photos, notes stored; event `handover.submitted` | Borrower: `handover.awaiting_confirmation` |
| T7 | Approved → Handed over | Borrower | N1 completed; actor is borrower | `handover.confirmedAt`, `handedOverAt`; `dueAt` = end of endDate; photos locked; event `handover.confirmed` | Owner: `handover.confirmed` |
| T8 | Handed over → Returned | Owner | Actor is owner; 1 to 8 return photos; condition verdict supplied | `return` stored; `returnedAt`; reservation removed; event `request.returned` | Borrower: `return.recorded` |
| T9 | Handed over → Overdue | System | now > `dueAt` | `overdue` flagged; event `request.overdue`. Stage 4: lazy evaluation. Stage 8: scheduled job | Owner and Borrower: `request.overdue` |
| T10 | Overdue → Returned | Owner | Same as T8 | Same as T8 | Borrower: `return.recorded` |
| N2 | Returned → Returned (no status change) | Owner or Borrower | Actor is a participant; one review per actor per request; rating 1 to 5 | Review created; reviewee `ratingSum` and `ratingCount` updated atomically; event `review.created` | Reviewee: `review.received` |
| T11 | Returned → Closed | System | Both reviews exist, or 7-day review window elapsed | `closedAt`; event `request.closed`. Window path: lazy in Stage 4, job in Stage 8 | Both: `request.closed` |
| T12 | Handed over, Overdue, or Returned → Disputed | Owner or Borrower | Current status in set; reason and details required | `dispute` recorded; `disputedFrom` stored; reservation retained; Report created; event `request.disputed` | Counterparty and community admins: `request.disputed` |
| T13 | Disputed → Closed | Community admin | Admin in same community; resolution note required | `dispute.resolution*` set; `closedAt`; reservation removed; event `request.dispute_resolved` | Both: `request.closed` |

## Terminal States

- Rejected
- Cancelled
- Closed

Any pair not listed is invalid and must be rejected with 409 and tested.

## Reservation Lifecycle

| Event | Reservation |
|---|---|
| T2 | added |
| T6, T8, T10, T13 | removed |
| T12 | retained |
