# write-spa-bff-oidc-spec

Domain experts define what to build. The skill defines how to build it securely.

The domain expert brings entities, workflows, and user needs. The skill brings
full-stack architecture: BFF auth where the browser never sees tokens, adaptive
session storage that scales without rework, and CSRF protection that covers
cookie-based auth by default.

Through a structured interview, it converts domain intent into concrete
decisions, API contracts, and component boundaries. It recommends secure
defaults while exposing key tradeoffs where product decisions matter most — in
particular API data persistence, where hidden assumptions cost the most.

The result is a focused, implementation-ready spec with clear goals,
explicit scope boundaries, and "Not Doing" guardrails that prevent rework.

## Architecture coverage

- **SPA** — single-page frontend; no server-rendered pages, no token handling in JS
- **BFF** — backend-for-frontend; OIDC confidential client keeps secrets server-side
- **OIDC authorization code flow** — browser receives only an opaque session cookie
- **HttpOnly / Secure / SameSite=Lax cookies** — session credentials outside JS reach
- **CSRF protection** — token-based mitigation for cookie-authenticated state changes
- **Adaptive session storage** — in-memory by default, external Redis when configured
- **Single-origin deployment** — SPA, auth, and API behind one host; no CORS complexity
- **Logical component boundaries** — CDN, BFF, API, and optional real-time hub in one binary, separable later
- **REST + thin WebSocket notifications** — mutations through REST, real-time via lightweight event push
- **Explicit persistence decision** — in-memory, Redis, or relational DB chosen per domain needs
- **Local-first ops** — docker-compose stack with all dependencies for immediate local validation

## References

- [Examples](references/examples.md)
- [Architectural decisions](references/architecture-decisions.md)
- [OWASP Top 10:2025 alignment checklist](references/owasp-top10-2025-alignment.md)
