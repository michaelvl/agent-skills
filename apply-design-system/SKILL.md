---
name: apply-design-system
description: Apply a shared design system to a codebase from bootstrap through ongoing extension workflows, with traceability from DESIGN.md files into token CSS and component usage. Use when adding or modifying UI, adopting DESIGN.md in a project, or introducing new design tokens.
---

# Apply Design System

Apply a design system using a two-layer source model:

- `DESIGN.md`: company baseline, static asset (bootstrapped from this skill's
  assets)
- `DESIGN-EXTENSION.md`: product-local additions and overrides

Then map both into a token stylesheet (often `styles.css`) and ensure UI code
only uses token references, never raw visual values.

Traceability flow:

```
DESIGN.md + DESIGN-EXTENSION.md
        |
        | merge frontmatter (via yq) + export (via @google/design.md)
        v
styles.css  <- only place raw values appear
        |
        | CSS classes or var(--token-name)
        v
components / pages
```

<HARD-GATE>
Do NOT introduce raw visual values (hex, rgb, px, rem, etc.) directly in
components/pages when a token is required. If a needed value does not exist in
either DESIGN.md file, add it to DESIGN-EXTENSION.md first.
</HARD-GATE>

<HARD-GATE>
`DESIGN.md` is a read-only, company-sourced baseline asset. Do NOT edit,
normalize, or patch it in individual projects, including when lint tools report
warnings. Project-local changes MUST go in `DESIGN-EXTENSION.md`.
</HARD-GATE>

## Checklist

Create a task for each item and complete in order:

1. **Check project context** - read repo AGENTS guidance and identify frontend
   structure.
2. **Locate design files** - verify whether `docs/specs/DESIGN.md` and
   `docs/specs/DESIGN-EXTENSION.md` exist.
3. **Bootstrap if needed** - copy missing files from this skill's `assets/`.
4. **Locate token stylesheet** - identify `styles.css` equivalent used as token
   source for the project.
5. **Apply workflow** - either consume existing tokens or run extension flow for
   new needs.
6. **Validate design docs** - run `@google/design.md lint` on both design files.
7. **Regenerate token stylesheet** - run the project's `generate-styles` script
   to regenerate the token stylesheet from merged design sources.
8. **Enforce boundary** - ensure linting in project tooling rejects raw values
   outside token stylesheet.

## Workflow A: Bootstrap

Use when the project has not adopted the design system yet.

1. If `docs/specs/DESIGN.md` is missing, copy `assets/DESIGN.md` into
   `docs/specs/DESIGN.md`.
2. If `docs/specs/DESIGN-EXTENSION.md` is missing, copy
   `assets/DESIGN-EXTENSION.md` into `docs/specs/DESIGN-EXTENSION.md`.
3. Confirm both files are added to the project repository.

After bootstrap, suggest adding these checks to build/lint workflow (for example
`make lint`):

- `npx @google/design.md lint docs/specs/DESIGN.md`
- `npx @google/design.md lint docs/specs/DESIGN-EXTENSION.md`
- `generate-styles` (or equivalent) in the frontend build step
- A frontend lint rule that rejects raw visual values outside the token
  stylesheet

Do not prescribe a single implementation mechanism for linting; keep it open to
the codebase (ESLint custom rule, regex gate, other existing tooling).

Copy both template assets (see **Template Assets**) into the project and wire
them into build/lint.

## Workflow B: Use Existing Tokens

Use when requested UI changes can be satisfied by existing tokens.

1. Look up available tokens in the token stylesheet (`styles.css` or
   equivalent). This is the authoritative list UI code may reference.
2. Apply token references (`var(--token-name)`) in component/page code.
3. If a needed token is missing from the token stylesheet, do not use raw
   values. Use Workflow C.

## Workflow C: Need Something New (Agent-Guided)

Use when a required visual value does not already exist as a token.

Ask one question at a time and guide this decision tree:

1. **Check baseline** - does `DESIGN.md` already define an equivalent token?
2. **Check extension** - does `DESIGN-EXTENSION.md` already define it?
3. If absent from both, add the token to `DESIGN-EXTENSION.md` with:
   - name
   - value
   - purpose/intent
   - short justification
4. Validate both files with `@google/design.md lint`.
5. Run the project's `generate-styles` script (see **Template Assets**) to
   regenerate the token stylesheet.
6. Use the new token reference in UI code.

Never skip directly to hardcoded values in components.

## Workflow D: Baseline Version Drift (Manual)

Updating `DESIGN.md` is intentional and manual via baseline replacement only.
This skill does not perform auto-updates and does not allow in-place edits.

1. Replace project `docs/specs/DESIGN.md` with a newer baseline only when the
   project explicitly chooses to upgrade the company baseline.
2. Never modify baseline contents in place; use a full-file replacement from the
   approved baseline source.
3. Use `npx @google/design.md diff` between old and new baseline to understand
   token changes.
4. Reconcile `DESIGN-EXTENSION.md` manually.
5. Run the project's `generate-styles` script (see **Template Assets**). Do not
   hand-edit the token stylesheet.
6. Update `baseline-version` in `DESIGN-EXTENSION.md`.

## Token Pipeline Contract

Treat the token stylesheet (`styles.css` or equivalent) as the project token
boundary.

- Raw values are allowed in:
  - `docs/specs/DESIGN.md`
  - `docs/specs/DESIGN-EXTENSION.md`
  - token stylesheet source/output
- Raw values are not allowed in:
  - components
  - pages
  - inline React styles
  - non-token CSS modules/files

The token stylesheet is generated by the project's `generate-styles` script (see
**Template Assets**).

The token stylesheet is fully generated from the DESIGN files. Do not hand-edit
it. Any new values must be added to `DESIGN-EXTENSION.md` first, then the
stylesheet regenerated.

## Template Assets

This skill provides two Node.js script templates in `assets/`. Copy both into
the project's scripts directory during bootstrap and configure project-specific
paths/file extensions.

`generate-styles.mjs` expects `yq` to be available on `PATH`.

| Template                      | Purpose                                                                   | Wire into           |
| ----------------------------- | ------------------------------------------------------------------------- | ------------------- |
| `generate-styles.mjs`         | Merge baseline and extension token outputs and write the token stylesheet | frontend build step |
| `enforce-design-boundary.mjs` | Reject raw visual values outside the token stylesheet                     | frontend lint step  |

## Flexibility Rules

- Do not hardcode `frontend/src/styles.css` in the skill logic.
- Locate the token stylesheet path per project.
- Keep linting mechanism open; enforce behavior, not tool choice.

## Success Criteria

The workflow is complete when all are true:

1. Both design source files exist in `docs/specs/`.
2. `DESIGN-EXTENSION.md` is the single source for product-local visual
   extensions.
3. Token stylesheet is generated from merged design sources.
4. Components/pages reference tokens only.
5. Lint/build workflow includes design doc validation and raw-value boundary
   enforcement.
