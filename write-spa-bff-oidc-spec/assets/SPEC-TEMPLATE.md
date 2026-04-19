# <Project Name> - Specification

## Purpose

<Why this product exists and what user/domain problem it solves.>

## Goals

1. <Goal 1>
2. <Goal 2>
3. <Goal 3>

## Architecture

### System components

<Describe frontend, backend, auth provider, persistence, and optional real-time
components.>

### Logical backend components

- **CDN/static delivery**: <role>
- **BFF/auth**: <role>
- **API**: <role>
- **Real-time hub** (optional): <role>

### Key decisions

- <Decision + rationale>
- <Decision + rationale>

## Auth and Session Management

> Omit this section only if the app is intentionally anonymous.

### Auth flow

<Login/callback/logout behavior and boundaries between browser and backend.>

### Session model

<Cookie properties, session lifecycle, refresh behavior.>

Define `INSECURE_COOKIES` behavior explicitly:
- If `INSECURE_COOKIES` is unset or `false`, set `Secure` on session cookies.
- If `INSECURE_COOKIES=true`, omit `Secure` for local HTTP manual testing only.
- State that `INSECURE_COOKIES=true` is not for production.

### Session storage strategy

- If `<SESSION_STORE_ENV>` is set: use external Redis session storage.
- Otherwise: use in-memory session storage.

### CSRF protection

<How CSRF token is issued and validated for state-changing requests.>

### Authorization model

<Define authorization rules for protected resources. Specify user/data scoping,
least-privilege assumptions, and response behavior for unauthorized or
other-user resource access (for example 404 vs 403 policy).>

#### Authorization model gaps

> Include this subsection only when authz complexity signals were detected
> during the interview and the authz model could not be fully specified. Omit
> for simple user-scoped apps where the default applies.

The following authorization complexity signals were identified during the
interview but not fully resolved. A dedicated authorization design pass is
required before implementation:

- <Signal 1, e.g. "multiple user roles: admin, member, viewer">
- <Signal 2, e.g. "resources shared within teams">

Open decisions:

- <Decision 1, e.g. "access rules for team-owned resources">
- <Decision 2, e.g. "error response policy for role-insufficient access">

**This spec is incomplete in this area. Implementation MUST NOT begin on
authorization-sensitive features until these decisions are resolved.**

### Input validation and output encoding

<Define request validation for all external inputs and output encoding strategy
for API and frontend rendering paths.>

### Security response headers

<Define required headers and values, at minimum: Content-Security-Policy,
Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options.>

### Security logging and alerting

<Define which security-relevant events are logged and which conditions trigger
alerts (for example failed logins, authz failures, CSRF failures, repeated
validation failures). Ensure sensitive data is excluded from logs.>

### Exceptional-condition handling

<Define fail-closed behavior, rollback requirements for partial failures,
centralized error handling, and sanitized error responses that avoid leaking
internal details.>

## Data Model and Persistence

### Domain entities

- **<Entity 1>**: <fields, constraints>
- **<Entity 2>**: <fields, constraints>

### Persistence decision

<Chosen backend for API data and rationale.>

### Storage schema

<Keys/tables/indexes/relationships relevant to chosen persistence.>

## API Contract

### Base path and auth requirements

<API base path, auth requirements, response format.>

### Endpoints

| Method | Path | Request | Response |
|--------|------|---------|----------|
| <...>  | <...>| <...>   | <...>    |

### Error model

<Validation/auth/not-found/conflict handling and status codes.>

## Real-Time Sync Model (if applicable)

### Triggering model

<When events are produced and consumed.>

### Message protocol

<Message type examples and semantics.>

### Reconnection and consistency model

<Backoff strategy and catch-up behavior.>

## Frontend Architecture

### Technology choice

<Framework/toolkit and rationale.>

### State and routing model

<Routing assumptions, state ownership, rendering model.>

### Integration points

<API client boundaries, auth bootstrap behavior, real-time client behavior.>

## Local Development and Deployment Model

### Local stack

<docker-compose services and responsibilities.>

If auth is enabled, include a local test-only IdP service from
`https://github.com/michaelvl/oidc-oauth2-workshop` and state explicitly that
this IdP is not for production.

### Configuration

| Variable | Required | Purpose |
|----------|----------|---------|
| <...>    | <yes/no> | <...>   |

### Run workflow

<Minimal local run/verify steps.>

## Testing Strategy

- **Backend unit tests**: <scope>
- **Backend integration tests**: <scope>
- **Auth flow tests**: <scope>
- **Frontend tests/manual checks**: <scope>

## Not Doing (and Why)

- <Out-of-scope item 1 and reason>
- <Out-of-scope item 2 and reason>
- <Out-of-scope item 3 and reason>
