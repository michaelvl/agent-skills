---
name: write-a-kubernetes-controller-spec
description: Write a software specification for a Kubernetes controller through codebase exploration and deep user interview. Use when user wants to write a spec, create requirements, plan a new Kubernetes controller or controller feature, document an existing implementation, or consolidate partial controller specs.
---

# Write a Kubernetes Controller Spec

## Overview

Create a detailed software specification for a Kubernetes controller through
collaborative interview and codebase exploration. This applies to new
controllers, extensions to existing controllers, and documentation of existing
implementations (including consolidation of partial specs/docs). The spec
targets coding agents as its audience - it must be precise enough for a coding
agent to implement the controller behavior without further clarification.

<HARD-GATE>
Do NOT write any implementation code or invoke implementation skills. This skill
produces a spec document only.
</HARD-GATE>

## First Steps

Start with checklist item 1 (`AGENTS.md`) and apply project-specific
conventions throughout the interview and final spec.

## Definitions

- **Controller**: A reconciliation loop for typically one master resource and
  one or more child resources.
- **Owned resource**: A child resource that the controller creates and manages.
- **Dependent resource**: A resource the controller reads but does not create or
  own; used as input when generating owned resources.
- **Manager**: The framework code (controller-manager) that manages one or more
  controllers, typically built into one binary.

## Checklist

You MUST create a task for each of these items and complete them in order:

1. **Read AGENTS.md** - check for project conventions on metrics, naming,
   labelling, and controller patterns.
2. **Gather initial description** - ask the user for a detailed description of
   what they want specified: a new controller, an extension to an existing
   controller, or documentation/consolidation of an existing implementation.
3. **Analyze initial context and pre-fill answers** - parse user-provided
   design sketches, issue text, prior notes, partial specs/docs, and any
   referenced implementation details. Map this information to checklist topics.
   Pre-fill answers that are strongly implied by context, and record
   assumptions. For topics with partial signal, prepare a recommendation
   phrased as a best guess to confirm with the user.
4. **Determine work mode** - explicitly determine whether this is: (a) a new
   controller, (b) a change to an existing controller, or (c) documenting an
   existing implementation/partial spec. For mode (b), identify which
   controller is being changed and whether the change is: new owned/dependent
   resources, CRD/API changes, reconciliation behavior changes, status changes,
   or a combination. For mode (c), treat existing code and docs as primary
   inputs and use interview questions mainly to confirm intent and resolve gaps.
   If the request combines (b) and (c), first capture current behavior from code
   and docs, then specify the intended delta.
5. **Explore codebase** - verify assertions, understand existing controllers,
   API types, and manager setup. For existing-controller changes, document the
   current reconcile flow baseline before specifying new behavior. For
   implementation-documentation mode, systematically extract answers from
   controller code, API types, watches, RBAC markers, tests, metrics, webhooks,
   and deployment manifests before asking questions.
6. **Deep interview** - ask questions one at a time, walking each branch of the
   design tree until shared understanding is reached.
7. **Define resources and APIs** - identify master resource, owned resources,
   dependent resources; define scope (cluster vs. namespace); draft YAML
   examples; interview about printer columns for CRDs. For existing-controller
   changes, explicitly mark which resources/fields are unchanged, modified, or
   newly introduced.
8. **Define relationships between owned resources** - when the controller
   creates multiple owned resources, ask: "Do any of the child resources
   reference each other? If so, which fields on one child resource contain
   values derived from another child resource?" Document each relationship in
   the spec. When a child resource depends on a value from another child
   resource, the spec must state that the dependent child is reconciled after
   its prerequisite, and that reconciliation of the dependent child is skipped
   (with a requeue) when the prerequisite resource or field is not yet
   available.
9. **Define reconciliation behavior** - specify what the controller does in each
   reconcile pass, error handling, requeue logic. For existing-controller
   changes, define exactly where the new behavior is inserted into the current
   reconcile flow and what existing behavior remains unchanged.
10. **Define status propagation** - ask which fields from child or dependent
   resources should be propagated to the parent resource's status. For each
   propagated field, clarify: source resource, source field path, target field
   on the parent status, and behavior when the source is unavailable (e.g.
   leave empty, set a default, mark not ready).
11. **Define reconciliation triggers** - explicitly identify all watches: `For`,
   `Owns`, and secondary `Watches` for dependent resources or other objects
   whose changes should trigger reconciliation. Ask: "Does the controller need
   to find resources by any spec field value (not just name/namespace)?" If
   yes, document required field indices (indexed resource type, field path, and
   which watch/lookup uses each index).
12. **Ask about requeue strategy** - determine requeue intervals (fixed vs.
   exponential backoff) and whether rate limiting concerns exist (e.g. external
   API calls, high resource counts).
13. **Determine Kubernetes Events strategy** - ask whether the controller should
    emit Kubernetes Events (`corev1.Event` via EventRecorder), and if so, for
    which operations.
14. **Define ownership and cleanup strategy** - determine whether owner
    references or label-based garbage collection is appropriate (e.g.
    cross-scope ownership requires label-based cleanup).
15. **Ask about finalizers** - prefer not to use finalizers. Finalizers are
    needed when the controller must perform cleanup that cannot be handled by
    Kubernetes garbage collection alone (e.g. deleting external cloud resources,
    cleaning up cross-scope children via label selector, revoking external
    credentials). If the user identifies such a need, include finalizer logic
    in the spec. Otherwise, omit finalizers.
16. **Define admission webhooks** - determine whether the controller should use
    validating and/or mutating admission webhooks.
    - **Validating webhook interview question:** "Should the controller provide
      early validation feedback at admission time? For example: immutable fields
      after creation, or validation rules that cannot be expressed in CRD
      OpenAPI schema (cross-field constraints, semantic checks, etc.)."
    - If yes, ask:
      - Which fields are immutable, and why?
      - Which validation rules are required beyond OpenAPI schema validation?
      - For each rule: what triggers rejection, which operations it applies to
        (`create`, `update`, or both), and the expected error message.
    - **Mutating webhook interview question:** "Should the controller apply
      defaults or normalize fields at admission time before persistence?"
    - If yes, ask:
      - Which fields should be defaulted and what values should be set?
      - Which fields should be normalized and how (for example lowercasing)?
      - For each mutation: field path, mutation/default behavior, and which
        operations it applies to (`create` only, or `create` and `update`).
      - Whether mutated/defaulted values must be visible on the persisted
        resource spec.
    - Guidance: if defaults are simple and do not need admission-time
      visibility, recommend reconciler-based defaulting instead of a mutating
      webhook to reduce deployment complexity.
    - If neither webhook is needed, state this explicitly in the spec.
17. **For specs involving CRD changes: define compatibility and CRD evolution strategy** -
    explicitly determine which situation applies:
    - **Early development (not used in production)**: breaking CRD changes
      without `apiVersion` updates are acceptable and may be preferred.
    - **Production usage**: breaking CRD changes require versioned APIs and
      conversion webhooks.
    Document the chosen strategy in the spec. If production usage applies,
    interview for conversion semantics (field mappings, defaults, renamed
    fields, type conversions, and any lossy conversions) so the conversion
    logic is captured in the spec.
18. **Define metrics** - use project conventions from AGENTS.md if available;
    otherwise investigate codebase for existing Prometheus/OpenMetrics naming
    patterns, then recommend the default metrics from the
    [Default Metrics](#default-metrics) section using the discovered
    convention. After presenting the default metrics, ask: "Are there
    controller-specific situations that should have additional metrics beyond
    the defaults?" Examples include: external API latency/failure rates, queue
    depth of pending work, counts of resources in specific states, and
    domain-specific business events. For each additional metric, clarify:
    metric type (`counter`, `gauge`, or `histogram`), metric name, label set,
    and when the metric is recorded.
19. **Define testing approach** - prefer traditional unit tests for
    synchronous logic (mutate functions, validation, status aggregation). For
    asynchronous tests where the test suite must simulate external systems
    (e.g. setting status fields on child resources that the controller reacts
    to), recommend envtest. Document that async tests must handle race
    conditions between the test suite and the running controller. For
    existing-controller changes, identify regression coverage needed for
    pre-existing behavior that must remain unchanged.
20. **Define out of scope** - propose 3-5 features or behaviors that are
    related to the controller but not part of this spec. Propose items that a
    coding agent might reasonably infer or add on its own, such as: handling
    additional resource types, supporting extra configuration options, advanced
    error recovery, or integration with systems not discussed during the
    interview. Present the proposals to the user and let them confirm, modify,
    or extend the list. Use the confirmed list in the spec's `Out of Scope`
    section.
21. **Identify deployment artifact updates** - search the codebase for Helm
    charts, Kustomize overlays, or other deployment manifests. If the
    controller introduces or modifies CRDs, check whether CRD YAML must be
    copied into a Helm chart's `crds/` or `templates/` directory. If RBAC
    requirements change (new resource types, new verbs), check whether Roles or
    ClusterRoles in deployment manifests need updating. Document all required
    deployment artifact changes in the spec.
22. **Write the spec** - use the template from
    [references/SPEC-TEMPLATE.md](references/SPEC-TEMPLATE.md).
23. **Ask user for output destination** - save as file, submit as GitHub issue,
    or both.
24. **Save/submit the spec** - deliver according to user's choice:
    - For local file output: write the spec as a Markdown file
    - For GitHub issue output: create an issue using `gh issue create` and use the spec content as the issue body
    - Guardrail: avoid creating duplicate issues; if the conversation already references an existing tracking issue for this spec, update or reuse that issue instead of opening a new one

## Interview Process

**Interview style:**
- Determine early whether this is mode (a), (b), or (c) from checklist item 4
- Deduce answers from user-provided context, existing code, and existing
  docs/spec fragments before asking questions. Do not re-ask questions already
  answered clearly unless intent is unclear.
- If context partially answers a topic, present your best guess as
  "Recommended" and ask for confirmation.
- Check existing controllers, API types, and project structure first
- Ask questions one at a time - never multiple questions per message
- Prefer multiple choice questions when possible

**Exploring approaches:**
- Propose 2-3 approaches when design trade-offs exist
- Lead with your recommendation and reasoning
- Actively look for opportunities to reuse existing patterns in the codebase

**For mode (a) - new controllers:** The implementation MUST follow the
controller pattern
in [references/kubernetes-controller-pattern.md](references/kubernetes-controller-pattern.md).
Reference this pattern in the spec.

**For mode (b) - existing controller changes:** Capture a brief baseline of
current behavior, then specify the delta: what changes, where it changes in
reconcile flow, and what must remain unchanged.

**For mode (c) - implementation documentation/consolidation:** Derive the spec
from existing implementation and docs first. Use questions to confirm uncertain
intent, resolve conflicts between code and docs, and identify whether observed
behavior is intentional or incidental.

## Default Metrics

When `AGENTS.md` does not specify metrics conventions, recommend the following
counters. Before recommending metric names, search the codebase for existing
metric registrations to determine whether the project uses Prometheus or
OpenMetrics naming conventions, and follow the same pattern.

All metrics should be labelled with `controller` (controller name), `resource`
(parent resource type), and `action` (one of the values below):

| Metric | Action label | Description |
|--------|-------------|-------------|
| Reconcile invocations | `reconcile` | Incremented each time the reconcile loop is called |
| Resource created | `create` | Incremented when `CreateOrUpdate` results in a resource creation |
| Resource updated | `update` | Incremented when `CreateOrUpdate` results in a resource update |
| Resource create/update failure | `error` | Incremented when a `CreateOrUpdate` call fails |
| Requeue operations | `requeue` | Incremented each time the controller requeues a resource |

## Key Principles

- **Coding agent audience** - write for an implementer with zero codebase
  context but solid Go/Kubernetes skills
- **Baseline before delta** - when extending existing controllers, first
  capture current behavior, then describe exactly what changes
- **Deduce before asking** - extract answers from user-provided context,
  existing code, and partial docs/specs first. Only ask questions for
  missing/uncertain topics; when uncertain, present a recommended best guess
  for confirmation.
- **YAML over prose** - define APIs through concrete YAML examples following
  the pattern: "when given this parent resource, the controller generates the
  following child resource(s)"
- **Explicit scoping** - always state whether each resource is cluster-scoped
  or namespace-scoped; this affects ownership, RBAC, and cleanup strategy
- **Controller owns its fields** - the controller overwrites all fields it
  manages on child resources during each reconcile, unless the user has
  explicitly requested that specific fields be preserved
- **Idempotent mutate functions** - the mutate function passed to
  `CreateOrUpdate` must produce the same result regardless of the child
  resource's current state. It must set fields to desired values, not append
  or merge. The spec must define field values, not field transformations.
- **Unit tests first** - prefer traditional unit tests for synchronous,
  deterministic logic. Reserve envtest for async scenarios where the
  controller must react to status changes made by simulated external systems.
- **YAGNI** - exclude features the user hasn't asked for
- **Explicit boundaries** - define out-of-scope items so implementation agents
  do not add adjacent features by inference
- **Testable requirements** - every behavior described in the spec should have
  a corresponding test
- **Respect project conventions** - follow naming, labelling, and metrics
  patterns from AGENTS.md
- **CRD evolution must be explicit** - when CRDs are added or changed, the spec
  must record whether early-development breaking changes are allowed or whether
  production-safe versioning + conversion webhook strategy is required
- **Prefer simpler defaulting paths** - when defaults do not require
  admission-time persistence or centralized mutation policy, prefer
  reconciler-based defaulting over a mutating webhook to reduce operational
  complexity
