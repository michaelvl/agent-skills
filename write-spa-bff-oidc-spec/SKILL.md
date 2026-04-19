---
name: write-spa-bff-oidc-spec
description: Produces a complete SPA+BFF+OIDC application specification through structured interview with a domain expert. Use when the user wants to define what to build (not implement it), especially for web apps needing auth, API boundaries, and deployment-ready architecture.
---

# Skill: write-spa-bff-oidc-spec

## Overview

Create a high-quality software spec for applications that follow a SPA + BFF +
OIDC architecture. The user is often a domain expert rather than a full-stack
engineer, so the skill must translate domain intent into clear technical
requirements and justified architecture decisions.

This is not a frontend UX/design skill. It captures product behavior,
functional requirements, and architecture boundaries, but does not prescribe
visual design systems, layout polish, branding, or detailed interaction design.

<HARD-GATE>
Do NOT implement code, scaffold repos, generate project files, or invoke
implementation skills. This skill produces a spec document only.
</HARD-GATE>

## First Steps

1. Read `AGENTS.md` and apply project conventions.
2. Review any user-provided context and existing specs/docs.

## Checklist

You MUST create a task for each item and complete them in order.

1. **Gather initial intent** - ask for the domain goal in plain language.
2. **Extract known constraints** - infer what is already decided from context.
3. **Clarify users and workflows** - who uses the app and what actions matter.
4. **Define domain model** - entities, fields, relationships, lifecycle states.
5. **Define API capabilities** - CRUD, search/filter/sort, bulk operations.
6. **Determine real-time needs** - none, polling, SSE, or WebSocket.
7. **Determine auth requirement** - anonymous vs authenticated app.
8. **If authenticated, define auth behavior** - login, logout, session behavior,
   token handling boundaries, and default OIDC scope/claim requirements.
9. **If authenticated, clarify account-menu UX requirement** - ask whether the
   app should show a top-right user avatar that opens a submenu with `Logout`
   and `Profile`; if `Profile` is enabled, specify it displays OIDC user info
   (claims) obtained from the IdP.
10. **Frontend choice** - recommend framework/tooling based on use case.
11. **Backend language choice** - recommend 2-4 options; include Go when valid.
12. **Architecture shape** - default to single backend deployment with logical
    boundaries (CDN, BFF, API, real-time hub).
13. **Deployment evolution** - explain default single-container deployment,
     ask whether frontend and backend release cadence are tightly coupled, and
     capture whether externalized CDN should be documented as a future option.
14. **Session storage strategy** - apply adaptive storage per "Persistence
     Decision Policy > Session storage".
15. **API data persistence strategy** - interview domain expert and decide one
     persistence backend for domain data (do not require dual-mode support).
16. **Security model** - apply defaults from "Default vs ask policy" and
    "Architecture Defaults". Check for authz complexity signals per "Authz
    complexity signals"; defer and flag if any are found.
17. **Operational model** - local run model (for example docker-compose),
     environment variables, and baseline observability. Include the test-only
     IdP per "Architecture Defaults" if auth is required.
18. **Testing strategy** - unit/integration strategy for backend and auth flow;
     frontend testing expectations.
19. **Out of scope** - propose 3-8 explicit exclusions and ask for confirmation.
20. **Write spec** - use the template from `assets/SPEC-TEMPLATE.md`.
21. **Ask output destination** - local file, GitHub issue, or both.
22. **Save/submit spec** - produce deliverable per user choice.

## Interview Rules

- Ask one question at a time.
- Prefer multiple-choice when useful.
- Deduce before asking: do not ask for information already clear from context.
- When partial signal exists, present a recommended default and ask to confirm.
- Keep domain expert focused on product/domain decisions, not infrastructure
  internals unless the decision has strong product impact.

### Default vs ask policy (keep onboarding fast)

Default these security items without additional interview questions (briefly
explain the rationale, then proceed):

- OIDC claims baseline: request scopes `openid email profile`; treat `sub` as
  the canonical user identifier for authorization decisions; use display claims
  such as `name`, `picture`, and `email` for account/profile UI.
- Authorization baseline: if no authz complexity signals are found during steps
  3-4, default to user-scoped ownership — authenticated user can access only
  their own resources; requests for other users' resources return 404. State
  this default briefly and move on.
- Input validation/output encoding baseline: validate all external input at API
  boundaries and encode output for the rendering context.
- Security headers baseline: include CSP, HSTS, X-Content-Type-Options, and
  X-Frame-Options.
- Exceptional-condition baseline: fail closed, require rollback on partial
  failures, and return sanitized error responses.
- Security logging baseline: log failed login, session creation/destruction,
  CSRF failures, and authorization failures.

### Authz complexity signals

After completing checklist steps 3 (users and workflows) and 4 (domain model),
check whether any of the following signals are present:

- Multiple distinct user roles or personas with different access rights
- Entities owned by groups, teams, or organizations rather than individual users
- Admin or moderator actions that cross user boundaries
- Resource visibility levels (for example public, private, or shared)
- Approval, delegation, or escalation workflows

**If no signals are found:** apply the user-scoped ownership default above.

**If one or more signals are found:** do NOT attempt to design the authz model
inline. Instead:

1. Tell the domain expert that the app has authorization complexity that requires
   dedicated design work beyond this skill's scope.
2. Capture the signals observed.
3. Continue the rest of the spec interview, leaving the "Authorization model"
   section marked as incomplete using the `Authorization Model Gaps` subsection
   defined in the template.

Ask follow-up questions only for:

- Domain-specific audit and alerting needs (for example booking approvals,
  payment-like transactions, regulated workflows).

## Architecture Defaults

The skill should recommend these defaults unless the user's constraints require
otherwise:

- SPA frontend with single-origin deployment behind the BFF.
- BFF performs OIDC confidential-client flow; browser does not store tokens.
- BFF requests OIDC scopes `openid email profile` by default.
- `sub` is the canonical subject identifier for authorization and ownership
  checks; `email` is for contact/display only and must not be used as the
  primary authorization key.
- Cookie-based sessions (`HttpOnly`, `SameSite=Lax`, and `Secure` by default).
- Cookie security toggle via `INSECURE_COOKIES`: unset or `false` means secure
  cookies; `true` disables the `Secure` flag for local HTTP testing only.
- REST for state mutations and reads; optional WebSocket/SSE only for change
  notifications when real-time updates are needed.
- Single backend deployable with clear internal component boundaries so future
  service extraction remains a refactor.
- For docker-compose local testing with auth enabled, include the test-only IdP
  from `https://github.com/michaelvl/oidc-oauth2-workshop` as the default local
  identity provider.

## Deployment Evolution Guidance

Use this progression model during the interview:

- Default architecture: one backend deployable containing CDN, BFF, API, and
  optional real-time hub.
- If frontend and backend release cadence is loosely coupled, document
  externalized CDN/static artifact hosting as a near-term evolution option.
- Mention split BFF/API services as a long-term scaling path, but keep it out
  of initial implementation scope unless the user explicitly asks for it.

## Persistence Decision Policy

### Session storage

Do not ask the domain expert to pick in-memory vs Redis for sessions.

Explain briefly:
- In-memory sessions are simple but do not survive restarts and do not support
  safe horizontal scaling.
- External session storage enables resilient scaling.

Then specify this requirement in the spec:
- If session store env var (for example `REDIS_URL`) is present, use external
  Redis for session storage.
- If not present, use in-memory session storage.

### API data persistence

This is a domain decision and MUST be discussed with the user.

- Explain tradeoffs between in-memory, Redis, and relational DB options.
- Recommend one based on domain data shape and query needs.
- Specify a single chosen persistence backend in the spec.
- Do not require the initial implementation to support multiple API data stores
  behind one abstraction unless user explicitly requests it.

## OWASP 2025 Coverage Policy

Use `references/owasp-top10-2025-alignment.md` as a checklist. When explaining
choices, use concise rationale from `references/architecture-decisions.md`.

- A01, A02, A05, A09, and A10 are in-scope and MUST be addressed in produced
  specs.
- A03, A04, and A08 are primarily implementation/operations concerns in this
  skill context and may be marked out-of-scope with rationale.

For in-scope items, prefer baseline defaults first and ask additional questions
only when the domain model indicates non-default behavior.
