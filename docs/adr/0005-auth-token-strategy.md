# 5. Access JWT and Rotating Refresh Token in HttpOnly Cookie

## Status

Accepted

## Context

Web client authentication needs to balance security (mitigating Cross-Site Scripting [XSS] and Cross-Site Request Forgery [CSRF]) with user convenience (avoiding frequent re-logins) and the ability to revoke stolen or expired sessions.

## Decision

Authentication uses short-lived JWT access tokens (15-minute TTL) passed via standard authorization mechanisms, combined with long-lived rotating refresh tokens (7-day TTL) delivered via `httpOnly`, `secure`, `sameSite=lax` cookies. Active user sessions are stored on the `User` document as cryptographically hashed token IDs (`sessions: {jtiHash, expiresAt, createdAt}[]`). Every refresh request rotates the refresh token: the used token is invalidated, a new token pair is issued, and any attempt to reuse an already-invalidated token revokes all user sessions as a security precaution.

## Consequences

- Protects refresh tokens from malicious JavaScript access (XSS defense).
- Hashed token identifiers stored in the database allow instantaneous session revocation on logout or account compromise.
- Cookie credentials require CORS configuration with `credentials: true` and an explicit `CLIENT_ORIGIN`.

## Alternatives Considered

- Storing access tokens in localStorage: Vulnerable to credential theft via XSS.
- Stateless refresh tokens without database tracking: Inability to revoke sessions or detect token replay attacks.
