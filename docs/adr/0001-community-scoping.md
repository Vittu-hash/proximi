# 1. Community Scoping and RequestContext

## Status

Accepted

## Context

Proximi is designed around closed communities (such as university campuses, hostels, or apartment complexes). Sharing, discovery, borrowing, and administration must be strictly isolated to the member's community to prevent cross-tenant data leaks and unauthorized item visibility.

## Decision

Every database document (Item, BorrowRequest, Review, EventLog, Report) is scoped with `communityId`. All incoming authenticated requests pass through `requestContext` middleware, which instantiates a typed `RequestContext {userId, communityId, role, correlationId}`. Service methods accept `RequestContext` and enforce `communityId` filters across all database operations. In Stage 0, each user is associated directly with a single `communityId` on the User document (`User.communityId`). When multi-community membership is required in future stages, this will be extracted into a dedicated `Membership` collection.

## Consequences

- Direct, unscoped model finders are prohibited; queries always scope by `communityId`.
- Prevents cross-community data leakage by default.
- Transitioning to multi-community membership later will require a database migration from `User.communityId` to `Membership` collection records, with service signatures remaining largely intact.

## Alternatives Considered

- Multi-tenant separate databases: High operational overhead and cost for small closed communities.
- Client-supplied `communityId` without server-side validation: High security vulnerability risking tenant spoofing.
