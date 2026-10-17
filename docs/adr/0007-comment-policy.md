# 7. Comment Policy and Suppression Directives Behaviour

## Status

Accepted

## Context

Proximi enforces a strict zero-comment policy across all project codebases, configuration files, CI workflows, and documentation. Code clarity, expressive naming, type systems, and architecture decision records serve as the sole source of explanation and design rationale. A custom ESLint rule (`custom/no-comments`) intercepts the AST and reports any comments extracted via `sourceCode.getAllComments()`. An empirical audit was conducted to determine how standard tool suppression and compiler directives interact with this rule.

## Decision

Comments of any kind remain forbidden across the repository. The audit revealed the following behavior for suppression and compiler directives:

1. `// eslint-disable-next-line`: Blocked by `custom/no-comments`. While the targeted rule is suppressed, the comment itself triggers a fatal lint error.
2. `/* eslint-disable */`: Allowed by ESLint. Because file-level disable disables all ESLint rules globally, `custom/no-comments` is also bypassed. However, repository guidelines forbid committing this directive.
3. `// @ts-expect-error`: Blocked by `custom/no-comments` and `@typescript-eslint/ban-ts-comment`. The TypeScript compiler respects the directive, but ESLint fails.
4. `/// <reference types="node" />`: Blocked by `custom/no-comments`. The TypeScript compiler resolves the reference, but ESLint fails.
5. Shebang lines (`#!/usr/bin/env node`): Blocked by `custom/no-comments` because the ECMAScript parser treats the shebang node as a comment token.
6. `/* istanbul ignore next */`: Blocked by `custom/no-comments`.

No exceptions or rule loosenings are introduced. All suppressions and commentary must remain absent from the codebase.

## Consequences

- Code must be written cleanly without requiring lint or type error suppressions.
- Types and configurations must be fully resolved via `tsconfig.json` compiler options rather than inline triple-slash references.
- Executable script entries should rely on npm bin mappings or node execution flags rather than inline shebang directives in linted TypeScript files.
- Tests must achieve coverage organically without inline Istanbul ignore markers.
