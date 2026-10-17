# Contributing Guidelines

## Branching Model

- Main branch: `main`
- Stage branches: `chore/stage-<number>` (e.g., `chore/stage-0`)
- Feature branches: `feat/<feature-name>`, `fix/<fix-name>`, `chore/<chore-name>`

## Conventional Commits

All commit messages must adhere to the Conventional Commits specification.
Format:
```
<type>(<scope>): <subject>
```

Allowed types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code style changes (formatting)
- `refactor`: Refactoring without behavior change
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance, configuration, dependencies
- `ci`: CI/CD pipeline changes

## Pull Request Rules

- Every PR must use the standard PR template located at `.github/pull_request_template.md`.
- All automated checks (lint, typecheck, test) must pass before merging.
- No direct pushes to `main`.

## No-Comment Code Style

- Code must be self-documenting through precise naming, domain modeling, and strict TypeScript types.
- Comment lines (`//`, `/* */`, and `#`) are forbidden across all code, configuration, and workflow files unless strictly required by a specific file format.
- Automated lint rules enforce the absence of comments across source files.
