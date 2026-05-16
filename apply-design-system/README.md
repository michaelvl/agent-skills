# apply-design-system

Adopt and apply a shared design system in a project with clear traceability from
`DESIGN.md` sources to token CSS and component usage.

This skill covers both:

- **Bootstrap**: first-time setup of `DESIGN.md` and `DESIGN-EXTENSION.md`
- **Ongoing work**: adding new design needs through extension files (not
  hardcoded values)

## Reference from AGENTS.md

```text
## Design System

Never use raw visual values (hex colors, px sizes, font weights) in components
or pages. Use the `apply-design-system` skill for any UI work.
```

## What this skill enforces

- `DESIGN.md` is the baseline design source.
- `DESIGN-EXTENSION.md` is the single source for project-local design
  additions/overrides.
- Token stylesheet (`styles.css` or equivalent) is generated from merged design
  sources.
- Components/pages use token references only.
- Raw visual values are rejected outside token stylesheet and design docs.

## Quick invocation playbook

Use this skill when:

- A project needs to adopt the design system.
- A UI change is requested.
- A developer says: "I need a new color/spacing/radius/typography value."

Suggested prompts:

- "Apply the design system to this repo using the `apply-design-system` skill."
- "I need a new UI value not in current tokens; guide me with
  `apply-design-system`."
- "Bootstrap DESIGN.md and DESIGN-EXTENSION.md with `apply-design-system`."

## Operational flow

1. Ensure `docs/specs/DESIGN.md` and `docs/specs/DESIGN-EXTENSION.md` exist
   (copy from skill assets if missing).
2. Locate token stylesheet path for this codebase (`styles.css` equivalent).
3. If required token exists, consume it.
4. If missing, add to `DESIGN-EXTENSION.md` with rationale.
5. Run `@google/design.md lint` on both design files.
6. Merge baseline + extension and export CSS tokens.
7. Use token references in UI code.

## Tooling notes

- `@google/design.md` CLI is used for lint/diff/export.
- Skill intentionally leaves lint implementation mechanism open (ESLint custom
  rule, regex gate, or existing project tooling).
- For Node.js-based frontend lint pipelines, a starter boundary-check script is
  available at `assets/enforce-design-boundary.mjs`.
- Skill intentionally does not auto-update baseline `DESIGN.md`.

## Assets

- `assets/DESIGN.md`
- `assets/DESIGN-EXTENSION.md`
- `assets/enforce-design-boundary.mjs`
