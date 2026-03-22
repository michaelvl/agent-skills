---
name: spec-to-plan
description: Turn a software spec into a multi-phase implementation plan using tracer-bullet vertical slices, saved as a local Markdown file and/or submitted as a GitHub issue. Use when user wants to break down a spec, create an implementation plan from requirements, or mentions tracer bullets.
---

# Spec to Plan

Break a spec into a phased implementation plan using vertical slices (tracer bullets). Output is a Markdown file in `./plans/` and/or a GitHub issue.

## Process

### 1. Confirm the spec is in context

The spec should already be in the conversation. If it isn't, ask the user to paste it or point you to the file.

### 2. Explore the codebase

If you have not already explored the codebase, do so to understand the current architecture, existing patterns, and integration layers.

### 3. Identify durable architectural decisions

Before slicing, identify high-level decisions that are unlikely to change throughout implementation:

- API surface (external contracts, versioning, compatibility constraints)
- Data model boundaries and persistence invariants
- Integration boundaries (services, queues, external APIs)
- Security and authorization model
- Observability conventions (metrics, logs, events)

Use domain-specific examples when helpful (for Kubernetes controllers: CRD shape/versioning, controller-manager registration and watches, RBAC markers, and metric naming conventions).

These go in the plan header so every phase can reference them.

### 4. Draft vertical slices

Break the spec into **tracer bullet** phases. Each phase is a thin vertical slice that cuts through all relevant integration layers end-to-end, not a horizontal slice of one layer.

<vertical-slice-rules>
- Each slice delivers a narrow but complete path through relevant layers (domain model, API/handler/reconciler, persistence/integration, tests)
- A completed slice is demoable or verifiable on its own
- Prefer many thin slices over few thick ones
- Include concrete implementation anchors: file paths and function/type names tied to current code; do not reference line numbers because they become outdated quickly
- Do include durable decisions and concrete behavior boundaries
- Order phases so that Phase 1 is the thinnest possible end-to-end happy path; later phases extend, harden, or add variants to earlier ones
- When a phase builds on a previous phase, state the dependency explicitly (e.g. "builds on Phase 1")

Controller example: one slice can cover API type updates + reconcile behavior + generated child resource + status propagation + tests.
</vertical-slice-rules>

**Anti-patterns to avoid:**
- Do not create phases that only touch one layer (horizontal slicing) -- each phase must cut through all relevant layers
- Do not include step-by-step implementation instructions; describe the target behavior and let the implementing agent decide how to get there
- Do not add phases for work not covered by the spec -- if it's not in the spec, it's not in the plan

Because this plan is an execution artifact used immediately after creation, prioritize fidelity to current implementation over abstraction. Be explicit about where changes happen.

### 5. Quiz the user

Present the proposed breakdown as a numbered list. For each phase show:

- **Title**: short descriptive name
- **Spec behavior covered**: which behaviors/requirements from the spec this addresses
- **Complexity**: small, medium, or large -- helps the user judge whether a phase should be split further

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Should any phases be merged or split further?

Iterate until the user approves the breakdown.

### 6. Write the plan

Write the plan content using [references/PLAN-TEMPLATE.md](references/PLAN-TEMPLATE.md).

### 7. Ask user for output destination

Ask the user whether to:

- Save as a local Markdown file in `./plans/`
- Submit as a GitHub issue
- Or both

### 8. Deliver the plan

Deliver according to the user's choice:

- For local file output: create `./plans/` if it doesn't exist and write the plan as Markdown named after the feature (e.g. `./plans/user-onboarding.md`)
- For GitHub issue output: create an issue using `gh issue create` and use the plan content as the issue body
- Guardrail: avoid creating duplicate issues; if the conversation already references an existing tracking issue for this plan, update or reuse that issue instead of opening a new one

### 9. Validate plan quality

Before finalizing, ensure:

- Every phase maps back to explicit spec behavior
- Phases are independently verifiable
- Cross-cutting concerns (errors, observability, compatibility) are covered
- Scope boundaries from the spec are preserved (no speculative extras)
- Each phase includes concrete anchors (file paths and function/type names, not line numbers)
