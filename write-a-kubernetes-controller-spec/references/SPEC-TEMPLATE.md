# [Controller Name] Specification

## Spec Context

_For documentation/consolidation of an existing implementation (mode c), use a
brief paragraph stating that this document captures current behavior from the
implementation/docs and does not introduce a new change._

State whether this spec is for:

- **New controller**
- **Extension to existing controller**
- **Documentation/consolidation of existing implementation**

If this is an extension or documentation/consolidation effort, identify the
existing controller and summarize the baseline behavior that already exists
today.

### Baseline and Delta

_Include this subsection when extending an existing controller, or when
documenting an existing implementation with an intended delta from current
behavior._

_Omit this subsection for documentation/consolidation of an existing
implementation where no intended delta is being introduced._

- **Baseline behavior:** What the controller currently does (resources,
  reconcile flow, status, triggers, metrics/events)
- **Delta:** What this spec changes
- **Unchanged behavior:** Existing behavior that must remain intact

Use a concise table when helpful:

| Area | Current Baseline | Planned Change | Must Remain Unchanged |
|------|------------------|----------------|------------------------|
| Reconcile flow | Creates ConfigMap and updates Ready condition | Add Secret projection child before status aggregation | Existing ConfigMap generation semantics |
| Status | Sets `Ready` only | Add `status.childEndpoint` propagation | Existing `Ready` condition semantics |

## Problem Statement

The problem being solved, from the user/operator perspective.

## Solution Overview

High-level description of the controller and its purpose.

## Backward Compatibility

_Include this section whenever the spec changes CRDs (new CRDs or CRD schema/version changes)._

_Omit this section for documentation/consolidation of an existing
implementation (mode c) when no CRD changes are being introduced._

State which compatibility strategy applies and why:

- **Early development (not in production use):** Breaking CRD schema changes
  without `apiVersion` updates are acceptable/preferred.
- **Production usage:** Breaking CRD schema changes require versioned APIs and
  conversion webhooks.

Also state whether controller behavior (outside CRD schema) is backward
compatible or intentionally breaking.

If production usage applies, include conversion semantics so implementation is
unambiguous:

| Breaking Change | Old -> New Conversion | New -> Old Conversion | Lossy? |
|-----------------|-----------------------|-----------------------|--------|
| `spec.foo` renamed to `spec.bar` | Map `spec.foo` to `spec.bar` | Map `spec.bar` to `spec.foo` | No |
| `spec.mode` added in new version | Default `spec.mode="Standard"` when absent | Drop field | Yes |

Document defaults, field mappings, renamed fields, type-conversion behavior,
and any information loss during conversion.

## Resources

### Master Resource

The primary resource this controller reconciles. State whether it is
**cluster-scoped** or **namespace-scoped**.

```yaml
apiVersion: example.io/v1alpha1
kind: ExampleResource
metadata:
  name: my-resource
  namespace: default  # omit for cluster-scoped resources
spec:
  # Spec fields with comments explaining each field
  fieldName: value
status:
  ready: false
  status: "waiting for child resources"
  # Additional status fields
```

#### Printer Columns

Fields exposed via `kubectl get`:

```go
//+kubebuilder:printcolumn:name="Ready",type="boolean",JSONPath=".status.ready"
//+kubebuilder:printcolumn:name="Status",type="string",JSONPath=".status.status"
//+kubebuilder:printcolumn:name="Age",type="date",JSONPath=".metadata.creationTimestamp"
```

#### Immutable Fields

_Include this section if any spec fields are immutable after creation._

List fields that cannot be changed after the resource is created. A validating
admission webhook MUST reject updates that modify these fields.

Enforcement details (operations, error messages, and full validation behavior)
are specified in the [Admission Webhooks](#admission-webhooks) section.

| Field | Reason for immutability |
|-------|------------------------|
| `spec.region` | Underlying cloud resource cannot be moved between regions |

### Owned Resources

Resources created and managed by this controller. For each owned resource, state:

- Resource kind, API group, and **scope** (cluster or namespace)
- YAML example showing the generated resource
- Which master resource fields drive the owned resource's spec
- Label and annotation propagation behavior
- Naming convention for the child resource

The controller owns and overwrites all fields it manages on each reconcile. Any
fields not managed by the controller are left untouched.

Show each owned resource as a concrete input/output pair:

**When given this parent resource:**

```yaml
apiVersion: example.io/v1alpha1
kind: ExampleResource
metadata:
  name: my-resource
  namespace: default
spec:
  size: large
```

**The controller generates the following child resource:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-resource-config
  namespace: default
  labels:
    app.kubernetes.io/managed-by: example-controller
data:
  size: large
```

### Dependent Resources

Resources the controller reads but does not own. For each:

- Resource kind, API group, and **scope** (cluster or namespace)
- How the controller discovers/selects it
- Which fields are consumed and how they influence reconciliation

## Ownership and Cleanup

Define how owned resources are cleaned up when the master resource is deleted:

- **Owner references**: Used when parent and child are in the same scope (both
  namespace-scoped, or both cluster-scoped). Kubernetes garbage collector
  handles deletion automatically.
- **Label-based cleanup**: Required when parent and child are in different
  scopes (e.g. cluster-scoped parent, namespace-scoped children). The
  controller must implement a finalizer to delete children by label selector.

State which strategy applies to each owned resource and why.

## Finalizers

_Include this section if the controller requires a finalizer._

Finalizers should be avoided unless the controller must perform cleanup that
Kubernetes garbage collection cannot handle (e.g. deleting external cloud
resources, cross-scope label-based child cleanup, revoking external credentials).

If a finalizer is needed:

- Finalizer name: `example.io/controller-name`
- Cleanup logic performed before finalizer removal:
  1. Step 1
  2. Step 2
- Error handling during cleanup (requeue? fail open?)

If no finalizer is needed, state: **This controller does not use a finalizer.
Cleanup is handled by Kubernetes garbage collection via owner references.**

## Reconciliation Behavior

### Happy Path

Step-by-step description of what happens during a successful reconcile:

1. Fetch the master resource
2. Validate the spec
3. Look up dependent resources
4. Create/update owned resources using CreateOrUpdate with mutate functions
5. Aggregate status from owned resources
6. Update master resource status

_For extensions to an existing controller:_ describe exactly where new behavior
is inserted in the existing reconcile flow (before/after which existing step),
and which existing steps are intentionally unchanged.

The mutate function passed to `CreateOrUpdate` MUST be idempotent - it sets
fields to desired values, never appends or merges. It must produce the same
child resource regardless of the child's current state.

### Error Handling

For each error scenario:

- What triggers it
- How the controller responds (requeue, status update, event)
- Requeue timing

### Requeue Strategy

Define requeue behavior:

- **Fixed interval**: Requeue after a constant duration (e.g. 30 seconds)
- **Exponential backoff**: Requeue with increasing intervals (e.g. 1s, 2s, 4s,
  ..., max 5m)
- **Rate limiting concerns**: State whether the controller interacts with
  external APIs or manages high resource counts that require rate-aware
  requeueing

### Status Conditions

Define the status conditions the controller sets on the master resource:

| Condition | True when | False when |
|-----------|-----------|------------|
| Ready | All owned resources are healthy | Any owned resource is unhealthy or missing |

### Status Field Propagation

_Include this section if the parent resource's status exposes fields sourced
from child or dependent resources._

| Parent Status Field | Source Resource | Source Field | When Source Unavailable |
|---------------------|-----------------|--------------|-------------------------|
| `status.childEndpoint` | `Service/my-resource-svc` | `.status.loadBalancer.ingress[0].hostname` | Leave empty, set Ready=false |
| `status.version` | `ConfigMap/my-resource-config` | `.data.version` | Use default `"unknown"` |

The reconciler aggregates these fields during status computation. If a source
resource is not found or the field is not yet populated, apply the behavior
specified in the "When Source Unavailable" column.

### Kubernetes Events

_Include this section if the controller emits Kubernetes Events
(`corev1.Event` via EventRecorder)._

Events the controller records on the master resource:

| Type | Reason | When |
|------|--------|------|
| Normal | Created | Owned resource successfully created |
| Warning | ReconcileError | Failed to create/update owned resource |

If the controller does not emit Kubernetes Events, state: **This controller
does not emit Kubernetes Events. Status is reported exclusively through status
conditions on the master resource.**

## Metrics

_Use project conventions from AGENTS.md if available. If not, follow the
existing Prometheus/OpenMetrics naming convention discovered in the codebase._

All metrics are counters labelled with `controller`, `resource` (parent resource
type), and `action`:

| Metric | Action label | Description |
|--------|-------------|-------------|
| Reconcile invocations | `reconcile` | Incremented each time the reconcile loop is called |
| Resource created | `create` | Incremented when `CreateOrUpdate` results in a resource creation |
| Resource updated | `update` | Incremented when `CreateOrUpdate` results in a resource update |
| Resource create/update failure | `error` | Incremented when a `CreateOrUpdate` call fails |
| Requeue operations | `requeue` | Incremented each time the controller requeues a resource |

### Controller-Specific Metrics

_Include this section if the controller requires metrics beyond the defaults._

Use this section to document metrics for controller-specific situations such as
external API latency/failure rates, queue depth of pending work, resource state
distribution, or domain-specific business events.

| Metric Name | Type | Labels | Recorded When |
|-------------|------|--------|---------------|
| `example_external_api_request_duration_seconds` | Histogram | `controller`, `endpoint`, `status_code` | After each external API call completes |
| `example_resources_in_pending_state` | Gauge | `controller`, `resource` | During status aggregation in each reconcile |

## RBAC Requirements

```go
//+kubebuilder:rbac:groups=example.io,resources=exampleresources,verbs=get;list;watch;update;patch
//+kubebuilder:rbac:groups=example.io,resources=exampleresources/status,verbs=get;update;patch
//+kubebuilder:rbac:groups="",resources=configmaps,verbs=get;list;watch;create;update;patch
```

## Deployment Artifacts

_Include this section if the project uses Helm charts, Kustomize, or other
deployment packaging._

List deployment manifests that require updates for this spec. For
documentation/consolidation mode, state whether no deployment artifact changes
are required.

| Artifact | Location | Required Update |
|----------|----------|-----------------|
| CRD YAML | `charts/mycontroller/crds/` | Copy generated CRD from `config/crd/bases/` |
| ClusterRole | `charts/mycontroller/templates/clusterrole.yaml` | Add RBAC rules for new resource types |
| Role | `charts/mycontroller/templates/role.yaml` | Add permissions for ConfigMap access |

If the project auto-generates these from kubebuilder markers, state the
generation command (e.g. `make manifests`) and where the output must be copied.

## Admission Webhooks

_Include this section if the controller uses validating and/or mutating
admission webhooks._

If neither webhook is used, state explicitly: **This controller does not use
admission webhooks.**

### Validating Webhook

_Include this section if immutable fields exist or validation requirements
cannot be expressed through the CRD OpenAPI schema alone._

Define a validating admission webhook that can:

- Reject updates to immutable fields (list which fields)
- Validate field values and cross-field constraints not expressible in the CRD
  OpenAPI schema

Validation rules should be explicit:

| Rule | Trigger | Operations | Error Message |
|------|---------|------------|---------------|
| `spec.region` is immutable | New value differs from old value | `update` | `spec.region is immutable` |
| `spec.minReplicas <= spec.maxReplicas` | `minReplicas` greater than `maxReplicas` | `create, update` | `spec.minReplicas must be <= spec.maxReplicas` |

```go
//+kubebuilder:webhook:path=/validate-example-io-v1alpha1-exampleresource,mutating=false,failurePolicy=fail,sideEffects=None,groups=example.io,resources=exampleresources,verbs=create;update,versions=v1alpha1,name=vexampleresource.kb.io,admissionReviewVersions=v1
```

### Mutating Webhook

_Include this section if defaults or normalization should be applied at
admission time before resource persistence._

For each mutation, define the field path, behavior, operation scope, and
rationale:

| Field | Default/Normalization | Operations | Persisted in Spec? | Rationale |
|-------|-----------------------|------------|--------------------|-----------|
| `spec.replicas` | Default to `1` when unset | `create` | Yes | Ensure deterministic baseline behavior |
| `spec.region` | Normalize to lowercase | `create, update` | Yes | Avoid case-variant duplicates |

If no mutating webhook is used, state whether equivalent defaulting happens in
the reconciler and why admission-time mutation is unnecessary.

```go
//+kubebuilder:webhook:path=/mutate-example-io-v1alpha1-exampleresource,mutating=true,failurePolicy=fail,sideEffects=None,groups=example.io,resources=exampleresources,verbs=create;update,versions=v1alpha1,name=mexampleresource.kb.io,admissionReviewVersions=v1
```

## Manager Registration

How this controller is registered with the controller manager, including:

- `For`: the master resource
- `Owns`: owned child resources (triggers reconcile of parent when child changes)
- `Watches`: secondary watches for dependent resources or other objects whose
  changes should trigger reconciliation, with appropriate event handlers
  (e.g. `EnqueueRequestForOwner`, `EnqueueRequestsFromMapFunc`)
- Required field indices (if any). If the controller must find resources by
  spec field values (not just name/namespace), list each index explicitly.

| Indexed Resource Type | Indexed Field Path | Used By (watch/lookup) |
|-----------------------|--------------------|-------------------------|
| `ExampleResource` | `spec.secretRef.name` | Secret watch map function to enqueue referencing parents |

## Implementation Decisions

Architectural and technical decisions made during the interview:

- Specific patterns, libraries, or conventions to follow
- How this controller interacts with other controllers in the manager
- Naming and labelling conventions for child resources
- Any constraints or non-obvious design choices

## Testing

### Testing Strategy

**Unit tests (preferred):** Use traditional unit tests for all synchronous,
deterministic logic. This includes:

- Mutate functions (verify correct child resource generation)
- Idempotency of mutate functions
- Validation logic
- Status aggregation logic
- Metric emission

**Envtest (async integration):** Use envtest when the test suite must simulate
external systems or controllers that set status fields on child resources while
the controller under test runs concurrently. Envtest is recommended for:

- End-to-end reconciliation flows
- Status condition propagation from child to parent
- Finalizer and cleanup behavior
- Webhook validation

_For extensions to an existing controller:_ include regression tests for
pre-existing behavior that must remain unchanged.

### Race Condition Handling in Async Tests

When the test suite sets status fields on resources that the controller reacts
to, this must be done in a way that is robust to race conditions. The controller
runs asynchronously to the test suite, so the resource may be modified by the
controller between the test's Get and StatusUpdate calls.

Recommended pattern:

1. Use `Eventually` (from gomega) to poll until the resource reaches the
   expected pre-condition state
2. Fetch the latest version of the resource immediately before modifying status
3. If the status update fails with a conflict error, retry by re-fetching and
   re-applying
4. Use `Eventually` again to verify the controller reacted to the status change

Do NOT assume a fixed timing between setting a status field and the controller
reacting to it.

### What to Test

Implementation-level behaviors to verify in automated tests. Unlike the
`Out of Scope` section (which defines boundaries the implementation must not
cross), this section describes behaviors that tests must verify.

| Behavior | Test Type | Description |
|----------|-----------|-------------|
| Creates owned resource from master | Unit | Verify mutate function produces correct owned resource |
| Mutate function is idempotent | Unit | Verify calling mutate twice produces identical result |
| Validation logic | Unit | Verify invalid specs are rejected with clear errors |
| Status aggregation | Unit | Verify status is correctly derived from child resource states |
| End-to-end reconciliation | Envtest | Verify full reconcile flow from parent creation to ready status |
| Status reflects owned resource state | Envtest | Set status on child resource, verify parent status updates |
| Status field propagation | Unit | Verify each child/dependent field is correctly mapped to parent status |
| Handles missing dependent resource | Envtest | Verify appropriate error/requeue when dependent not found |
| Cleanup on deletion | Envtest | Verify owned resources are cleaned up (via owner refs or finalizer) |
| Immutable field rejection | Envtest | Verify webhook rejects updates to immutable fields |
| Metrics emitted correctly | Unit | Verify counters increment for reconcile, create, update, error, requeue |

### Test Patterns

Prior art in the codebase and recommended test approaches.

## Out of Scope

What this controller explicitly does NOT handle. These boundaries prevent
scope creep during implementation - a coding agent MUST NOT implement features
listed here, even if they seem like natural extensions.

This section should be derived from user-confirmed exclusions gathered during
the interview, not generic defaults.

- This controller does not manage `ResourceX`; that is handled by `other-controller`
- No support for cross-namespace references; all resources must be in the same namespace
- No automatic retry with exponential backoff for external API calls (fixed requeue only)
- No support for migrating resources created by an older version of this controller
