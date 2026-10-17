# State Transitions

Item state "Listed" = `Item.status = active`. Multiple requests may be pending on one item. Request lifecycle begins at T1.

## Transition Table

| ID | From State | To State | Allowed Actor | Preconditions | Side Effects | Notifications Fired | Event Log Entry |
|---|---|---|---|---|---|---|---|
| T1 | None | Requested | Borrower | Item active and same community; borrower ≠ owner; borrower status active; startDate ≥ today; endDate ≥ startDate; duration within item min/max loan days; no open request by this borrower on this item; borrower open-request cap not exceeded; no overlap with existing reservation | Create request | Owner: `request.received` | `request.created` |
| T2 | Requested | Approved | Owner | Actor owns item; item active; startDate ≥ today; atomic reservation insert succeeds | Single transaction: guarded status update, reservation pushed, `approvedAt` set, T4 run for overlapping pending requests; exact address becomes readable to borrower | Borrower: `request.approved` | `request.approved` |
| T3 | Requested | Rejected | Owner | Actor owns item; optional reason ≤ 500 chars | `decision` recorded | Borrower: `request.rejected` | `request.rejected` |
| T4 | Requested | Rejected | System | Fired inside T2; same item; date overlap with the newly approved request | `decision.kind = auto_rejected` | Borrower: `request.rejected` | `request.auto_rejected` |
| T5 | Requested | Cancelled | Borrower | Actor is borrower | `decision` recorded | Owner: `request.cancelled` | `request.cancelled` |
| T6 | Approved | Cancelled | Borrower or Owner | Handover not confirmed; owner cancellation requires reason | Reservation removed; address access revoked; cancelling party recorded for Stage 8 reputation | Counterparty: `request.cancelled` | `request.cancelled` |
| N1 | Approved | Approved | Owner | Handover record submitted: 1 to 8 condition photos; today ≥ startDate − 1 day and ≤ endDate | `handover.submittedAt`, photos, notes stored (no status change) | Borrower: `handover.awaiting_confirmation` | `handover.submitted` |
| T7 | Approved | Handed over | Borrower | N1 completed; actor is borrower | `handover.confirmedAt`, `handedOverAt`; `dueAt` = end of endDate; photos locked | Owner: `handover.confirmed` | `handover.confirmed` |
| T8 | Handed over | Returned | Owner | Actor is owner; 1 to 8 return photos; condition verdict supplied | `return` stored; `returnedAt`; reservation removed | Borrower: `return.recorded` | `request.returned` |
| T9 | Handed over | Overdue | System | now > `dueAt` | `overdue` flagged (Stage 4: lazy evaluation; Stage 8: scheduled job) | Owner and Borrower: `request.overdue` | `request.overdue` |
| T10 | Overdue | Returned | Owner | Same as T8 | Same as T8 | Borrower: `return.recorded` | `request.returned` |
| N2 | Returned | Returned | Owner or Borrower | Actor is a participant; one review per actor per request; rating 1 to 5 | Review created; reviewee `ratingSum` and `ratingCount` updated atomically (no status change) | Reviewee: `review.received` | `review.created` |
| T11 | Returned | Closed | System | Both reviews exist, or 7-day review window elapsed | `closedAt` recorded (Stage 4: lazy evaluation; Stage 8: scheduled job) | Both: `request.closed` | `request.closed` |
| T12 | Handed over, Overdue, or Returned | Disputed | Owner or Borrower | Current status in {Handed over, Overdue, Returned}; reason and details required | `dispute` recorded; `disputedFrom` stored; reservation retained; Report created | Counterparty and community admins: `request.disputed` | `request.disputed` |
| T13 | Disputed | Closed | Community admin | Admin in same community; resolution note required | `dispute.resolution*` set; `closedAt`; reservation removed | Both: `request.closed` | `request.dispute_resolved` |

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
