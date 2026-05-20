# Traceability Problem: DESIGN.md Intent vs JSX Implementation

## Core issue

`DESIGN.md` defines component-level design intent, but React JSX usually implements styling with low-level Tailwind utility classes. Once intent is manually translated into utilities, the explicit link to `DESIGN.md` is lost.

This creates a drift risk: design intent can change while JSX stays stale.

## Concrete example

1. `DESIGN.md` says:

```yaml
components:
  card:
    backgroundColor: "{colors.neutral}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
```

2. Tailwind theme tokens are exported from primitives via `@theme`:

```css
@theme {
  --color-neutral: #f7f5f2;
  --radius-md: 8px;
  --spacing-md: 16px;
}
```

3. JSX is authored as:

```jsx
<div className="bg-neutral rounded-md p-md">...</div>
```

4. Later, `DESIGN.md` changes:

```yaml
components:
  card:
    backgroundColor: "{colors.primary}"
```

The JSX still uses `bg-neutral`. Nothing automatically updates it, and primitive token export does not detect this mismatch.

## Why primitive export is not enough

- Tailwind v4 `@theme` export maps primitive namespaces (`colors`, `typography`, `rounded`, `spacing`) to utilities.
- Component entries in `DESIGN.md` live at a higher abstraction level (semantic intent), not as direct Tailwind utility bindings.
- Therefore, the build can be valid while component usage in JSX is semantically wrong.

## Important clarification

Generating classes from `components.*` (for example `.ds-card`) can restore traceability, but class naming style does not change capability.

- A class named `.ds-card` and one named `.ds-card-tokens` both reflect only what `DESIGN.md` defines.
- If `DESIGN.md` is partial, generated output is partial.
- If `DESIGN.md` is complete, generated output is complete.

So completeness is primarily a `DESIGN.md` authoring concern, not an export-mode concern.

## Practical consequence

Without an explicit traceability mechanism, teams can ship UI that passes token export and build checks but no longer matches component intent in `DESIGN.md`.

## Options to close the traceability gap

1. Generate one class per `components.*` entry and use that class in JSX.
2. Keep raw utilities in JSX, but enforce conformance with a custom lint/CI rule that compares JSX usage with `DESIGN.md` component intent.
3. Use structured annotations in JSX and validate them against `DESIGN.md` in CI.

## Decision

We choose option 1: generate one class per `components.*` entry and use that class in JSX (for example, `.ds-card`).

## Implementation direction

- Use `@google/design.md export --format css-tailwind` for primitive tokens (`@theme`) and compile it with Tailwind CLI to `tailwind-generated.css`.
- Add a second export step that reads `components.*` from `DESIGN.md` and generates `components.css` with classes such as `.ds-card`.
- Load both outputs in the app: `tailwind-generated.css` + `components.css`.

## Clarification on Tailwind usage

This does not defeat Tailwind or bypass it entirely. It changes where Tailwind is used.

Tailwind still provides strong value in JSX for:

- Structural and layout utilities (`flex`, `grid`, `gap-*`, width/height utilities, positioning)
- Responsive behavior (`sm:`, `md:`, `lg:` modifiers)
- State and interaction variants (`hover:`, `focus:`, `active:`, `disabled:`)
- One-off composition choices that are not formalized in `DESIGN.md`
- Utility-driven page-level composition and fast iteration

What changes is the component-intent binding layer:

- For elements defined under `components.*` in `DESIGN.md`, JSX should reference generated `.ds-*` classes (for example, `.ds-card`) instead of manually translating intent into low-level utility classes.
- This preserves traceability from `DESIGN.md` to runtime styling and prevents silent drift after design-intent changes.

In other words, Tailwind remains the low-level utility engine, while generated `.ds-*` classes become the source-of-truth bridge for semantic component intent.

## Is there a common solution?

Yes. This is a common design-system traceability problem, and the most common solution is to make component intent machine-bound instead of manually translated in JSX.

- The chosen approach in this document (generate one class per `components.*` entry and reference that class in JSX) is a standard pattern in design systems.
- Similar prior art appears in token pipelines that generate CSS artifacts from a single source of truth.
- Similar prior art also appears in semantic component-class systems (`.card`, `.btn-primary`) and in Tailwind workflows that use `@apply` to create component classes from utilities.

### Prior art references

- Style Dictionary: https://styledictionary.com/
- Tokens Studio (design tokens workflow): https://tokens.studio/
- Design Tokens Community Group Format Module: https://tr.designtokens.org/format/
- Tailwind CSS `@apply`: https://tailwindcss.com/docs/functions-and-directives#apply
- BEM (semantic class naming for components): https://getbem.com/

## Open-source utilities for class generation

There is no widely adopted single tool that directly reads `components.*` from `DESIGN.md` and emits `.ds-*` classes for Tailwind out of the box. In practice, teams combine existing token/build tools with a small custom export step.

### Practical options

- Style Dictionary can generate CSS artifacts from token sources and is commonly extended with custom transforms/formats to emit semantic classes such as `.ds-card`.
- Tailwind `@apply` can compile semantic classes authored in CSS (for example, `.ds-card { @apply bg-neutral rounded-md p-md; }`). The generation step still needs to be implemented.
- Cobalt UI supports DTCG token inputs and multi-target outputs, and can be adapted for custom CSS outputs in token pipelines.
- Theo (older Salesforce token tool) offers similar token-to-artifact generation patterns, though most new projects prefer Style Dictionary.
- UnoCSS shortcuts provide named utility bundles and can be generated from structured component intent if using UnoCSS instead of Tailwind.
- Panda CSS recipes provide semantic component-style generation natively, and are a close conceptual match if moving off raw Tailwind utility authoring.

### Takeaway

- The common architecture is still the same: keep design intent in a structured source, then generate semantic component bindings in build time.
- For this project, the proposed second export step remains the most direct approach: parse `components.*` and emit `components.css` classes (`.ds-*`) that JSX references.

### References

- Style Dictionary: https://styledictionary.com/
- Tailwind CSS `@apply`: https://tailwindcss.com/docs/functions-and-directives#apply
- Cobalt UI: https://cobalt-ui.pages.dev/
- Theo: https://github.com/salesforce-ux/theo
- UnoCSS shortcuts: https://unocss.dev/config/shortcuts
- Panda CSS recipes: https://panda-css.com/docs/concepts/recipes
