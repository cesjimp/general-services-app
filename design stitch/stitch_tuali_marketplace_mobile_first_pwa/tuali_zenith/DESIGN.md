# Design System Specification: The Lucid Authority

## 1. Overview & Creative North Star
The "Lucid Authority" is a design philosophy that marries the clarity of modern B2C interfaces with the grounded weight of premium B2B editorial design. Unlike standard frameworks that rely on rigid borders and flat grids, this system uses **intentional asymmetry** and **tonal layering** to guide the user.

We break the "template" look by treating the mobile screen as a digital canvas of fine paper and frosted glass. Our goal is to create a signature experience where depth is felt through color shifts rather than seen through lines, and where typography speaks with an authoritative yet approachable voice.

---

## 2. Colors & Surface Logic

This system utilizes a sophisticated Material-style token set to manage hierarchy. The palette is anchored by **Primary Trust Navy (`#00236f`)** and energized by **Secondary Action Orange (`#a73a00`)**.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders for sectioning or containment. 
Boundaries must be defined solely through:
1.  **Background Color Shifts:** Use `surface-container-low` for a page section and `surface-container-lowest` (pure white) for the card sitting on top.
2.  **Tonal Transitions:** Defining an area by a subtle shift from `surface` to `surface-bright`.

### Surface Hierarchy & Nesting
Treat the UI as physical layers. We use the surface-container tiers (Lowest to Highest) to define importance:
-   **Base Layer:** `surface` (#f7f9fb)
-   **Section Layer:** `surface-container-low` (#f2f4f6)
-   **Interaction Layer (Cards/Inputs):** `surface-container-lowest` (#ffffff)
-   **Overlays/Modals:** `surface-bright` (#f7f9fb)

### The "Glass & Gradient" Rule
To elevate the "Premium" feel, floating elements (Bottom Sheets, Navigation Bars) should utilize **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` (12px–20px). 
*   **Signature Textures:** Use a subtle linear gradient on primary CTAs, transitioning from `primary` (#00236f) to `primary_container` (#1e3a8a). This adds a "soul" to the color that flat hex codes lack.

---

## 3. Typography: Editorial Sophistication

We use **Plus Jakarta Sans** for its geometric clarity and **JetBrains Mono** for technical precision.

*   **Display & Headlines:** Use `display-md` (2.75rem) for hero moments. The generous x-height of Plus Jakarta Sans allows for tight leading (line-height), creating a high-end editorial feel.
*   **Title & Body:** `title-lg` (1.375rem) should be used for card headings to ensure readability at a glance.
*   **Technical Context:** `JetBrains Mono` is reserved exclusively for IDs, credit counts, or distances. This creates a "precision tool" aesthetic within the premium environment.
*   **Hierarchy Rule:** Always pair a bold `headline-sm` with a `body-md` in `on-surface-variant` (#444651) to create tonal contrast that guides the eye without needing heavy dividers.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved by "stacking" tones. For example:
-   **Level 0:** `surface` (The background)
-   **Level 1:** `surface-container-low` (A wide content grouping)
-   **Level 2:** `surface-container-lowest` (A specific interactive card)

### Ambient Shadows
When a "floating" effect is required (e.g., a FAB or a premium card), shadows must be extra-diffused.
-   **Specs:** `y-12, blur-24, spread-0`
-   **Color:** Use the `on-surface` color at **4%–8% opacity**. Never use pure black or grey; the shadow should feel like a natural tint of the background.

### The "Ghost Border" Fallback
If accessibility requirements (WCAG) demand a container edge, use a **Ghost Border**:
-   **Token:** `outline-variant` (#c5c5d3) at **15% opacity**.
-   **Rule:** 100% opaque borders are strictly forbidden.

---

## 5. Components

### Buttons (The Interaction Core)
-   **Primary:** Gradient fill (`primary` to `primary_container`). 
-   **Feedback:** All buttons must use `active:scale-95 transition-transform`.
-   **Touch Target:** Minimum 48px height, even if the visual container is smaller.
-   **Radius:** `md` (1.5rem) for a modern, approachable feel.

### Premium Cards
-   **Visuals:** No dividers. Use `24px` of vertical padding (from the 8pt grid) to separate internal content.
-   **Radius:** `xl` (3rem) for large hero cards; `lg` (2rem) for standard feed cards.
-   **Context:** Use `surface-container-lowest` on a `surface` background.

### Input Fields
-   **State:** Default state uses `surface-container-high` background with no border.
-   **Focus:** Transition to a "Ghost Border" using the `primary` color at 20% opacity.
-   **Typography:** Labels use `label-md` in `on-surface-variant`.

### Selection Chips
-   **Style:** Pill-shaped (`full` roundedness).
-   **Logic:** Unselected chips should blend into the background (`surface-container-high`); selected chips should pop with `secondary_container` (#fd651e) and `on_secondary_container` (#571a00).

---

## 6. Do's and Don'ts

### Do:
-   **Do** use asymmetrical margins (e.g., 24px left, 16px right) on certain editorial headers to create visual interest.
-   **Do** prioritize whitespace over content density. If a screen feels "busy," increase the vertical spacing to the next 8pt step (e.g., move from 24px to 32px).
-   **Do** use `JetBrains Mono` for any data that feels "generated" (Order IDs, Timestamps).

### Don't:
-   **Don't** use 1px solid dividers to separate list items. Use 16px or 24px of white space instead.
-   **Don't** use pure black (#000000) for text. Always use `on-surface` (#191c1e) to maintain the "Clean & Bright" aesthetic.
-   **Don't** use sharp corners. The minimum radius for any container is `sm` (0.5rem), but the standard should be `md` (1.5rem) or higher.
-   **Don't** ever skip the `scale-95` interaction on clickable elements; the "tactile" feel is what defines the premium experience.

---

**Director's Note:** Every pixel must feel intentional. If you add an element, ask yourself: "Am I adding this to solve a problem, or just to fill space?" If it's the latter, remove it. Let the typography and the subtle shifts in surface color do the heavy lifting.