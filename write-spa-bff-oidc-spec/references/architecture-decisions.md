# Architecture Decision Reference

This reference provides short, reusable explanations for common architectural
choices in SPA + BFF + OIDC systems.

## Why BFF and cookie-based security?

In browser apps, token handling in frontend code increases exposure risk
(`localStorage`, JS-accessible memory, accidental logging). A BFF keeps OAuth
tokens server-side and gives the browser only an opaque session cookie. This
reduces token leakage risk and centralizes auth behavior in one backend layer.

## Why server-side sessions?

The BFF pattern relies on server-side auth state (tokens, expiry, user context)
bound to a session ID in an `HttpOnly` cookie. This keeps sensitive token
material out of browser JavaScript and allows controlled refresh/logout logic.

## Why adaptive session storage (in-memory fallback + external Redis option)?

In-memory sessions are ideal for local development and simple single-instance
deployments. External Redis is needed for resilient multi-instance deployments
and restart tolerance. Supporting both via configuration preserves simplicity in
dev while keeping a safe scaling path.

## What is CSRF in this architecture and why is protection needed?

Cookie-based auth means browsers automatically attach session cookies on
cross-site requests. Without CSRF protection, a malicious site could trigger
state-changing actions in a logged-in user's session. CSRF tokens on unsafe
methods (POST/PATCH/PUT/DELETE) bind requests to trusted frontend behavior.

## Why `SameSite=Lax` for session cookies?

OIDC login commonly uses cross-site redirects. `SameSite=Strict` can break the
auth callback flow. `Lax` is usually the right balance for redirect-based login
while still reducing some cross-site cookie sending scenarios.

## Why `HttpOnly` and `Secure` cookies?

`HttpOnly` prevents JavaScript from reading session cookies, reducing XSS blast
radius. `Secure` ensures cookies are only sent over HTTPS, preventing leakage on
plaintext transport.

## Why `INSECURE_COOKIES` for local testing?

Manual testing often runs on local HTTP docker-compose endpoints where strict
`Secure` cookies can block session behavior in some setups. `INSECURE_COOKIES`
provides an explicit local override:

- Unset or `false`: keep `Secure` enabled (default, recommended).
- `true`: disable the `Secure` cookie flag for local HTTP manual testing.

This override is a development convenience and must be explicitly disallowed in
production.

## Why define authorization separately from authentication?

Authentication answers "who is this user". Authorization answers "what can this
user do". A correct auth flow can still expose data if authorization is
implicit or inconsistently applied. Specs should define resource scoping and
failure behavior explicitly.

## Why require input validation and output encoding?

Input validation reduces the attack surface for malformed or malicious requests
that can trigger injection-like behavior. Output encoding prevents untrusted
data from being interpreted as executable content, especially in browser
rendering contexts.

## Why specify security response headers in the spec?

Security headers are low-cost controls that reduce common browser attack paths
(clickjacking, MIME confusion, content injection). Defining them in the spec
avoids environment-specific drift and misconfiguration.

## Why define security logging and alerting requirements?

Without consistent logging and actionable alerting, attacks become difficult to
detect, triage, and investigate. Security controls should be observable, with
events that support both incident response and forensic analysis.

## Why define exceptional-condition handling up front?

Security failures often occur when systems handle error paths inconsistently,
leak internals, or fail open. Defining fail-closed behavior, rollback
requirements, and sanitized error responses in the spec prevents insecure
fallback behavior.

## Why REST for data and WebSocket only for notifications?

Using REST as the source of truth keeps API behavior debuggable, cacheable, and
testable. WebSocket notifications can remain thin (for example "data changed")
and trigger re-fetch, avoiding complex event payload versioning.

## Why separate logical backend components in one deployable?

A single deployable keeps operational overhead low for v1. Defining explicit
logical boundaries (CDN, BFF, API, real-time hub) preserves a clean path to
future service extraction without rewriting core logic.

Defining these boundaries also has a direct security consequence: the BFF→API
interface must use the access token as the authorization credential, not session
state. The BFF retrieves the access token from its session store and forwards it
as a Bearer token; the API validates it independently. Collapsing these concerns
into shared session checks removes the API's ability to authorize requests
independently and makes future extraction very difficult.

## Why discuss API data persistence as a product decision?

Unlike session storage, API data persistence directly affects domain features:
query expressiveness, data integrity, reporting, and migration strategy. This
choice should be explicit with the domain expert, not hidden as an internal
default.

## In-memory vs Redis vs relational DB for API data

- In-memory: fastest to start, no durability, good for PoC/learning.
- Redis: strong fit for key-value/caching/simple structures, limited relational
  querying.
- Relational DB: best for rich domain models, joins, transactions, and complex
  reporting needs.

## Why single origin matters for SPA + auth

Serving SPA and backend under one origin simplifies cookie policy, CSRF model,
CORS, and frontend networking. It avoids many cross-origin auth edge cases.

## Why include a "Not Doing (and Why)" section?

Specs often fail from implicit assumptions and uncontrolled expansion. Explicit
exclusions prevent accidental scope creep and give implementation agents clear
boundaries.

## Why start with local docker-compose?

Local reproducibility is the fastest validation loop for architecture and auth
flow. It enables reliable onboarding and debugging before introducing CI/CD or
orchestration complexity.

## Why use a test-only IdP for local docker-compose setups?

Using the test-only IdP from
`https://github.com/michaelvl/oidc-oauth2-workshop` removes early friction when
validating OIDC flows locally: no external tenant setup, no account bootstrap,
and deterministic login behavior (for example password `valid`). This keeps
local auth testing fast and repeatable.

This IdP is for local/testing only and must be explicitly marked as out of
scope for production deployments.

## Why assume JWT access tokens and validate at the API layer?

The OIDC spec does not mandate access token format. However, JWT access tokens
enable stateless local validation at the API layer using the IdP's published
JWKS, avoiding a network round-trip to the IdP per request. This is the common
path for modern OIDC providers and the one this skill targets.

If the IdP issues opaque access tokens, the API must call the token introspection
endpoint (RFC 7662) per request. This is out of scope for this skill and must be
explicitly flagged in specs where the access token format is unknown or opaque.

The `coreos/go-oidc` library can be used to validate JWT access tokens at the
API layer by reusing its `RemoteKeySet` and `NewVerifier` — the validation path
is identical to ID token verification. This is a well-understood pattern despite
being slightly off the library's primary design target.

## Why not use the ID token for API authorization?

The OIDC spec explicitly prohibits forwarding the ID token as an API
authorization credential. The ID token is a one-time authentication assertion
for the client (BFF) to verify the login event — it is not a bearer credential
for ongoing API access. Using it as one violates the spec and conflates
authentication with authorization.
