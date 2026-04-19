# OWASP Top 10:2025 Alignment Checklist

Use this checklist when producing specs with `write-spa-bff-oidc-spec`.

| ID | OWASP Risk | Skill coverage intent | Status |
|---|---|---|---|
| A01 | Broken Access Control | Define explicit authorization model, user-scoped access, and consistent unauthorized/not-found behavior. | In scope (must address) |
| A02 | Security Misconfiguration | Define secure defaults and required security headers; capture environment-specific exceptions explicitly. | In scope (must address) |
| A03 | Software Supply Chain Failures | Dependency governance, SBOM, and CI/CD hardening. | Out of scope (implementation/operations concern) |
| A04 | Cryptographic Failures | Deep crypto implementation details (key lifecycle, encryption at rest strategy). | Out of scope (implementation concern) |
| A05 | Injection | Define input validation and output encoding requirements across API and frontend paths. | In scope (must address) |
| A06 | Insecure Design | Use structured interview and explicit boundaries to prevent insecure architecture assumptions. | In scope (must address) |
| A07 | Authentication Failures | Require BFF + OIDC confidential-client pattern and secure server-side session model. | In scope (must address) |
| A08 | Software or Data Integrity Failures | Artifact signing, provenance, and integrity controls in delivery pipelines. | Out of scope (implementation/operations concern) |
| A09 | Security Logging and Alerting Failures | Define security events, logging constraints, and alerting triggers in the spec. | In scope (must address) |
| A10 | Mishandling of Exceptional Conditions | Define fail-closed behavior, rollback rules, centralized error handling, and sanitized error outputs. | In scope (must address) |

## How to use in generated specs

For each in-scope item, include concrete requirements in the relevant spec
section. For out-of-scope items, mention them explicitly in "Not Doing (and
Why)" when relevant so future implementation phases can pick them up.

## Interview load guidance

To keep early onboarding fast for domain experts:

- Apply baseline defaults for in-scope OWASP items without extra questions.
- Ask follow-up security questions only when domain behavior requires
  non-default authorization or domain-specific audit/alerting behavior.
