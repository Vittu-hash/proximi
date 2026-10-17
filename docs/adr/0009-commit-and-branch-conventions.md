# 9. Conventional Commits and Branch Protection Strategy

## Status

Accepted

## Context

Structured version control history and predictable release tracking are critical for team velocity, automated changelog generation, and regression prevention. Direct commits to the default branch risk shipping broken code and bypassing automated quality gates.

## Decision

Enforce the Conventional Commits standard across all repository commits using commitlint and husky hooks. Direct pushes to the `main` branch are blocked using repository branch protection rules. All changes enter `main` exclusively through Pull Requests with required passing status checks (lint, typecheck, test) and mandatory squash-merging.

## Consequences

- Commit history on the default branch remains clean, linear, and machine-readable.
- Changes cannot bypass continuous integration quality gates.
- Every release and PR squash title communicates scope and intent predictably.

## Alternatives Considered

- Unstructured commit messages: Impedes automated release tools and reduces traceability.
- Direct-to-main development without branch protection: High risk of unverified code breaking main.
