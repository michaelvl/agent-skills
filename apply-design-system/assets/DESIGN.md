---
version: "alpha"
name: "ACMEcorp Core"
description: "Company-wide, product-agnostic design system for ACMEcorp digital experiences."
colors:
  primary: "#171717"
  on-primary: "#FFFFFF"
  secondary: "#4D4D4D"
  on-secondary: "#FFFFFF"
  tertiary: "#0072F5"
  on-tertiary: "#FFFFFF"
  neutral: "#FAFAFA"
  surface: "#FFFFFF"
  text-primary: "#171717"
  text-secondary: "#4D4D4D"
  text-muted: "#666666"
  text-disabled: "#808080"
  border: "#EBEBEB"
  focus: "#0070F5"
  info: "#0A72EF"
  accent-alt: "#DE1D8D"
  success: "#15803D"
  warning: "#B45309"
  danger: "#FF5B4F"
typography:
  display-lg:
    fontFamily: "Geist"
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-2.4px"
    fontFeature: "liga"
  heading-md:
    fontFamily: "Geist"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-1.28px"
    fontFeature: "liga"
  body-md:
    fontFamily: "Geist"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.56
    letterSpacing: "0em"
    fontFeature: "liga"
  body-sm:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "liga"
  label-md:
    fontFamily: "Geist"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: "0em"
    fontFeature: "liga"
  code-sm:
    fontFamily: "Geist Mono"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.54
    letterSpacing: "0em"
    fontFeature: "liga"
  section-heading:
    fontFamily: "Geist"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-2.4px"
    fontFeature: "liga"
  card-title:
    fontFamily: "Geist"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.96px"
    fontFeature: "liga"
  body-large:
    fontFamily: "Geist"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "0em"
    fontFeature: "liga"
  body-medium:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "liga"
  body-semibold:
    fontFamily: "Geist"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.32px"
    fontFeature: "liga"
  caption:
    fontFamily: "Geist"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0em"
    fontFeature: "liga"
  mono-body:
    fontFamily: "Geist Mono"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
    fontFeature: "liga"
  mono-small:
    fontFamily: "Geist Mono"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0em"
    fontFeature: "liga, tnum"
rounded:
  r2: 2px
  r4: 4px
  r6: 6px
  r8: 8px
  r12: 12px
  r64: 64px
  r100: 100px
  full: 9999px
spacing:
  s1: 1px
  s2: 2px
  s3: 3px
  s4: 4px
  s5: 5px
  s6: 6px
  s8: 8px
  s10: 10px
  s12: 12px
  s14: 14px
  s16: 16px
  s32: 32px
  s36: 36px
  s40: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.r6}"
    padding: "{spacing.s8}"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.r6}"
    padding: "{spacing.s8}"
  button-secondary-hover:
    backgroundColor: "{colors.neutral}"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.r6}"
    padding: "{spacing.s16}"
  card-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.r8}"
    padding: "{spacing.s32}"
  badge-neutral:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.s10}"
icons:
  icon-sm:
    size: "12px"
    strokeWidth: 1.5
  icon-md:
    size: "16px"
    strokeWidth: 1.5
  icon-lg:
    size: "20px"
    strokeWidth: 1.5
  icon-xl:
    size: "24px"
    strokeWidth: 1.5
---

## Overview

ACMEcorp Core defines a calm, professional interface language that can be
applied across marketing sites, internal tools, customer dashboards, and
platform products. The system emphasizes readability, predictable hierarchy, and
reusable primitives over product-specific visual flair.

Use this design system when building new ACMEcorp interfaces unless a product
has an approved extension layer. Prefer composition of base tokens and
components rather than introducing one-off styles.

## Colors

The palette is neutral-first and mirrors ACMEcorp's shared interface baseline.

- **Primary (`#171717`)**: Core brand ink for high-emphasis actions and key
  headings.
- **Secondary (`#4D4D4D`)**: Supporting dark tone for lower-emphasis
  high-contrast surfaces.
- **Tertiary (`#0072F5`)**: Primary interactive accent for links and selected
  states.
- **Neutral (`#FAFAFA`)**: Soft neutral tint for subtle section and control
  backgrounds.
- **Surface (`#FFFFFF`)**: Primary container background.
- **Text**: Primary `#171717`, secondary `#4D4D4D`, muted `#666666`, disabled
  `#808080`.
- **Border (`#EBEBEB`)**: Dividers, card outlines, and control boundaries.
- **Focus (`#0070F5`)**: Keyboard focus ring and accessibility highlight.
- **Semantic states**: Info `#0A72EF`, success `#15803D`, warning `#B45309`,
  danger `#FF5B4F`.
- **Reserved accent (`#DE1D8D`)**: Secondary highlight for charts,
  illustrations, or multi-series data.

## Typography

Typography is a core part of ACMEcorp's identity and should remain stable across
products.

### Font Family

- **Primary**: `Geist`, with fallbacks:
  `Arial, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol`
- **Monospace**: `Geist Mono`, with fallbacks:
  `ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Liberation Mono, DejaVu Sans Mono, Courier New`
- **OpenType features**: `"liga"` is enabled globally on Geist text, and
  `"tnum"` is used for tabular numeric labels.

### Hierarchy

| Role              | Font       | Size           | Weight  | Line Height       | Letter Spacing    | Notes                                   |
| ----------------- | ---------- | -------------- | ------- | ----------------- | ----------------- | --------------------------------------- |
| Display Hero      | Geist      | 48px (3.00rem) | 600     | 1.00-1.17 (tight) | -2.4px to -2.88px | Maximum compression, flagship headlines |
| Section Heading   | Geist      | 40px (2.50rem) | 600     | 1.20 (tight)      | -2.4px            | Section titles                          |
| Sub-heading Large | Geist      | 32px (2.00rem) | 600     | 1.25 (tight)      | -1.28px           | Card and subsection headings            |
| Sub-heading       | Geist      | 32px (2.00rem) | 400     | 1.50              | -1.28px           | Lighter sub-headings                    |
| Card Title        | Geist      | 24px (1.50rem) | 600     | 1.33              | -0.96px           | Feature cards                           |
| Card Title Light  | Geist      | 24px (1.50rem) | 500     | 1.33              | -0.96px           | Secondary card headings                 |
| Body Large        | Geist      | 20px (1.25rem) | 400     | 1.80 (relaxed)    | normal            | Introductions and lead text             |
| Body              | Geist      | 18px (1.13rem) | 400     | 1.56              | normal            | Standard reading text                   |
| Body Small        | Geist      | 16px (1.00rem) | 400     | 1.50              | normal            | Standard UI text                        |
| Body Medium       | Geist      | 16px (1.00rem) | 500     | 1.50              | normal            | Navigation and emphasized text          |
| Body Semibold     | Geist      | 16px (1.00rem) | 600     | 1.50              | -0.32px           | Strong labels and active states         |
| Button / Link     | Geist      | 14px (0.88rem) | 500     | 1.43              | normal            | Buttons, links, captions                |
| Button Small      | Geist      | 14px (0.88rem) | 400     | 1.00 (tight)      | normal            | Compact controls                        |
| Caption           | Geist      | 12px (0.75rem) | 400-500 | 1.33              | normal            | Metadata and tags                       |
| Mono Body         | Geist Mono | 16px (1.00rem) | 400     | 1.50              | normal            | Code blocks                             |
| Mono Caption      | Geist Mono | 13px (0.81rem) | 500     | 1.54              | normal            | Technical labels                        |
| Mono Small        | Geist Mono | 12px (0.75rem) | 500     | 1.00 (tight)      | normal            | Uppercase technical labels              |
| Micro Badge       | Geist      | 7px (0.44rem)  | 700     | 1.00 (tight)      | normal            | Uppercase micro badges                  |

### Principles

- **Compression as identity**: Display sizes use aggressive negative tracking
  for a compact, engineered voice. Tracking relaxes as sizes decrease: `-2.4px`
  at `48px`, `-1.28px` at `32px`, `-0.96px` at `24px`, `-0.32px` at `16px`, and
  normal at `14px`.
- **Ligatures everywhere**: Geist text uses OpenType `"liga"` by default to
  preserve the intended glyph rhythm.
- **Three-weight system**: `400` (body), `500` (interactive/UI), `600`
  (headings). Avoid broad weight drift in day-to-day UI.
- **Mono for technical voice**: Geist Mono, often uppercase and paired with
  `"tnum"`, is used for IDs, metrics, and technical metadata.

## Iconography

ACMEcorp uses **Iconoir** as the standard icon library. Iconoir is an
open-source SVG icon set (MIT license, 1,671+ icons). Icons are rendered as
inline SVG or framework components - not as an icon font.

### Source

Install the framework-specific package from npm:

- React: `iconoir-react`
- Vue: `iconoir-vue`
- CSS (SVG sprites): `iconoir`

Do not use icon font files or bundle a second icon library alongside Iconoir.

### Size Scale

| Token     | Size | `width` / `height` | Typical use                      |
| --------- | ---- | ------------------ | -------------------------------- |
| `icon-sm` | 12px | 12px x 12px        | Inline metadata, compact badges  |
| `icon-md` | 16px | 16px x 16px        | Default - buttons, inputs, nav   |
| `icon-lg` | 20px | 20px x 20px        | Section headers, callouts        |
| `icon-xl` | 24px | 24px x 24px        | Feature highlights, empty states |

Always use one of these four sizes. Set `width` and `height` on the SVG element
using the token value. Do not set ad hoc sizes outside this scale.

### Stroke Weight

Iconoir icons default to a stroke width of `1.5`. Keep this value across all
products. Do not deviate per icon for stylistic reasons; override only when an
icon requires a distinct visual weight to convey meaning.

### Color

Icons inherit the surrounding text color by default (`currentColor`). Override
explicitly using a `{colors.*}` token when the icon needs a distinct semantic
meaning (e.g. `{colors.danger}` for a destructive action, `{colors.success}` for
a confirmation).

### Accessibility

- Add `aria-hidden="true"` to every decorative icon.
- Pair interactive icon-only controls with a visible label or `aria-label`.
- Never use an icon as the sole indicator of status - always accompany it with
  text or a tooltip.

### Do's and Don'ts

**Do**

- Use `icon-md` (16px) as the default unless context clearly demands a different
  size.
- Keep stroke width at `1.5` as the standard across all products.
- Use `{colors.text-muted}` for supporting or decorative icons to reduce visual
  weight.

**Don't**

- Don't introduce a second icon library alongside Iconoir.
- Don't mix stroke weights in the same component for decoration.
- Don't set icon dimensions with `em` units when a fixed-size token is
  available.
- Don't rely on icon color alone to communicate state - always pair with text or
  `aria-label`.

## Layout

Layout should feel structured, spacious, and consistent.

- Use the spacing scale as the single source for gaps, inset padding, and
  section rhythm.
- Canonical spacing steps are `1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 32, 36, 40`
  px.
- Build page structure with simple grids that collapse cleanly from desktop to
  mobile.
- Prefer `32px-40px` section spacing on desktop and `14px-16px` on small
  screens.
- Keep content width readable; avoid full-width text blocks for long-form copy.
- Use `neutral` as alternate section background only when it improves
  scanability.

## Elevation & Depth

Depth should remain subtle and functional.

- Level 0: no shadow, for page background and flat sections.
- Level 1: light container separation for cards and floating panels.
- Level 2: stronger elevation for overlays, popovers, and modal surfaces.
- Focus always takes precedence over elevation; interactive elements must show a
  clear `focus` ring.
- Avoid decorative heavy shadows or layered effects that reduce clarity.

## Shapes

Corner radius communicates component role and density.

- Use `r2` for micro surfaces, inline code chips, and tiny status markers.
- Use `r4` and `r6` for controls and compact interactive elements.
- Use `r8` for cards and grouped content containers.
- Use `r12` for image containers and featured media blocks.
- Use `r64` and `r100` for large navigation pills.
- `full` only for pills, status chips, and fully rounded affordances.

Use one radius step per component family whenever possible to preserve a
coherent visual rhythm.

## Components

Core component tokens define baseline behavior and should be reused directly:

- `button-primary` and `button-primary-hover` for high-emphasis actions.
- `button-secondary` and `button-secondary-hover` for supporting actions.
- `input-default` for text input fields with standard padding and type.
- `card-default` for grouped information blocks.
- `badge-neutral` for low-emphasis labeling.

Component variants (hover, active, disabled, danger, success) should be
expressed as additional component token entries using the same naming pattern.

## Do's and Don'ts

### Do

- Use token references (for example `{colors.primary}`) instead of hardcoded
  values in component definitions.
- Keep semantic intent clear: brand roles, content hierarchy, and interactive
  feedback.
- Validate text/background contrast for all interactive and informational UI.
- Reuse existing component tokens before adding new ones.

### Don't

- Do not define product-specific brand colors in this shared company baseline.
- Do not mix multiple unrelated type families in the same interface.
- Do not introduce custom spacing or radius values outside the defined scales.
- Do not rely on color alone to communicate status or interaction state.
