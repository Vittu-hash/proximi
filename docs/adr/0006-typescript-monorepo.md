# 6. TypeScript Across API and Web Monorepo

## Status

Accepted

## Context

The system consists of a backend API service (`apps/api`) and a web frontend client (`apps/web`). Managing disparate repositories complicates synchronized feature releases, cross-cutting linting, type validation, and consistent domain modeling.

## Decision

The repository is structured as an npm workspaces monorepo containing `apps/api` and `apps/web`. TypeScript in strict mode is enforced across both workspaces. Build tooling, linting, formatting, and test scripts are centralized at the root and fan out to individual workspaces.

## Consequences

- Consistent language stack across API and web frontends.
- Shared conventional commits, pre-commit hooks, and continuous integration workflows.
- Strict type checking ensures high reliability and eliminates entire classes of runtime errors.

## Alternatives Considered

- Multi-repo structure: Increases coordination overhead, git repository management complexity, and divergent developer experiences.
- Turborepo or Nx: Unnecessary additional abstraction layers for a focused two-app monorepo at this stage.
