# Plan: <Feature Name>

> Source spec: <brief identifier or link>

## Architectural decisions

Durable decisions that apply across all phases:

- **API/contracts**: ...
- **Data model/invariants**: ...
- **Integration boundaries**: ...
- **Security model**: ...
- **Observability conventions**: ...

Example for a Kubernetes controller:

- **API/contracts**: CRD fields and versioning strategy
- **Integration boundaries**: dependent resources and generated owned resources
- **Observability conventions**: controller metrics and event strategy

---

## Phase 1: <Title>

**Spec behavior covered**: <list from spec>
**Complexity**: small | medium | large
**Builds on**: — (foundation phase)

### What to build

A concise description of this vertical slice. Describe end-to-end behavior, not layer-by-layer implementation details.

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Verification

- [ ] Run project test suite
- [ ] Manual or integration verification notes

Example test outline (adapt to project language and framework):

```
TestPhase1HappyPath:
    // Arrange: set up input/state
    // Act: trigger the behavior under test
    // Assert: verify expected outcome and side effects
```

---

## Phase 2: <Title>

**Spec behavior covered**: <list from spec>
**Complexity**: small | medium | large
**Builds on**: Phase 1

### What to build

...

### Acceptance criteria

- [ ] ...

### Verification

- [ ] Run project test suite
- [ ] ...

<!-- Repeat for each phase -->
