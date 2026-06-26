# Handoff: Rare Velvet — Shopify Theme (Online Store 2.0)

## Overview
Rare Velvet is a beauty + accessories lifestyle brand (pillars: **Beauty · Organization · Self-Care · Everyday Luxury**). This package contains a complete, working **Shopify Liquid theme** plus the **HTML design references** it was built from. The goal of the handoff is to take this to production: install the theme on the store, wire it to real products/collections/metafields/apps, and refine.

Tagline: **"Beauty. Organization. Everyday Luxury."**
Aesthetic: Sephora-meets-Anthropologie — editorial warmth + clean beauty-retail confidence.

## About the Design Files
This bundle contains **two kinds of files**:

1. **`theme/` — a real Shopify OS2 theme in Liquid.** This is production-oriented code (sections, snippets, templates, assets, config). It is the source of truth for implementation. It installs and renders in Shopify today.
2. **`design_references/` — HTML prototypes (`*.dc.html`).** These are **design references**, not production code. They show the intended look/behavior of each page at full fidelity. Use them to verify pixel-level intent (spacing, type, color, interactions) when refining the Liquid theme. Do **not** ship the HTML directly.

If you (the developer) extend this in a non-Shopify environment, treat the HTML as the design spec and rebuild using that stack's patterns. For the Shopify path, the Liquid theme is already the implementation — your job is configuration, QA, and polish.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are all specified. Recreate/refine pixel-perfectly.

## Tech / Environment
- **Platform:** Shopify, **Online Store 2.0** (JSON `index` template + section groups; other templates are `.liquid`).
- **No build step.** Plain Liquid + vanilla JS + hand-written CSS in `assets/`. No Node/Tailwind/SCSS.
- **Styling:** global CSS in `assets/rv-base.css` and `assets/rv-product.css` using CSS custom properties (design tokens). Section-specific CSS lives inline in each section's `<style>`.
- **JS:** `assets/rv-theme.js` (header, drawers, menu), `assets/rv-gallery.js` (PDP gallery + zoom/lightbox), `assets/rv-cart.js` (variant logic, cart drawer, AJAX add).

## Theme Structure (`theme/`)
```
assets/      rv-base.css, rv-product.css, rv-theme.js, rv-gallery.js, rv-cart.js, image-slot* (none in prod)
config/      settings_schema.json (theme settings), settings_data.json
layout/      theme.liquid (global <head>, header/footer, drawers, JSON-LD, skip link)
locales/     en.default.json
sections/    ~50 sections (see below)
snippets/    rv-badge.liquid, rv-material.liquid, rv-loyalty-points.liquid
templates/   index.json (homepage, drag-reorderable) + product.liquid, collection.liquid,
             cart.liquid, page.liquid, page.our-story.liquid, blog/article/search/404
```

### PDP routing — IMPORTANT
There is **one** `templates/product.liquid`. It branches on **Product Type** (set per product in Shopify admin) to pick a PDP layout. This was a deliberate choice: earlier attempts with multiple `product.<suffix>.json` templates failed to register on upload, so a single Liquid file that switches on `product.type` is the reliable pattern. Mapping:

| Product Type value | PDP layout (sections) |
|---|---|
| `Jewelry`, `Ring`, `Necklace`, `Earring`, `Bracelet` | Jewelry PDP (gallery, stack-with, hallmark, ring-size guide when ring) |
| `Skincare`, `Serum`, `Beauty` | Skincare PDP (ingredients, results, how-to, routine) |
| `Skincare Device`, `Device`, `Beauty Device` | Devices PDP (tech grid, results/before-after, comparison, spec table) |
| `Lounge`, `Loungewear`, `Apparel` | Lounge/Fashion PDP (size/color, complete-the-set, style-with) |
| (default / Jewelry Box / Interior) | Box/Interior PDP (complete-the-set, materials) |

The **ring size guide** renders when Product Type is a ring (or tag `ring`). Convert to type/tag-based trigger is already done — see `rv-ring-size-guide` include condition in `product.liquid`.

## Design Tokens (CSS custom properties — see `assets/rv-base.css` `:root`)
```
--rv-bone:    #F4F1EA   /* page background */
--rv-bone-2:  #ECE7DD   /* alt section bg */
--rv-paper:   #FBF9F4   /* cards */
--rv-char:    #2B2A27   /* body text / primary */
--rv-soft:    #56524C   /* secondary text */
--rv-grey:    #8B8680   --rv-grey-2: #6E6A64   --rv-line: #DAD4CB (hairlines)
--rv-deep:    #3B3833   /* dark bands / footer */
--rv-clay:    #B0795C   /* PRIMARY CTA / accent ("clay" — the winning palette) */
--rv-clay-2:  #9A6446
--rv-butter:  #F2E6C2   --rv-butter-2: #E2CB92   /* soft buttermilk accents/badges */
--rv-blush:   #E9D9D2   /* tertiary warmth */
--rv-star:    #C2A24E   /* review stars */
--rv-mint:    #9DB5A4   /* devices "FDA-cleared" accent */
```
**Type:** headlines = **Cormorant Garamond** (serif, 500, often italic for accents); body/UI = **Hanken Grotesk** (sans). All-caps labels use `.14em–.2em` letter-spacing. Generous line-height.

**Navigation:** logo **left** (links to home), fine 11px uppercase links (`.2em` tracking), actions right; header **shrinks on scroll** (Bruna-the-Label style) via `.rv-header--scrolled`.

## Key Sections (in `theme/sections/`)
- **Home:** `rv-hero`, `rv-trust-bar`, `rv-category-nav`, `rv-lifestyle-tiles`, `rv-product-grid` (Best Sellers, Odd-Muse quick-add), `rv-testimonial-band` (rotating), `rv-new-arrivals`, `rv-routine-builder` (3-step glow, GLOW15), `rv-why-us` ("The Rare Velvet Difference"), `rv-bundle-grid`, `rv-ugc-grid` (shoppable), `rv-journal`, `rv-press-bar`, `rv-newsletter`, `rv-footer`.
- **Brand:** `rv-our-story` (page template `page.our-story`).
- **PDP shared:** `rv-product-main` (gallery, buy box, sticky ATC, trust, guarantee, wishlist/back-in-stock via Notify Me), `rv-product-accordions` (Details & Materials from metafields, Shipping & Returns global), `rv-product-reviews` (Loox), `rv-recently-viewed`, `rv-product-crosssell`.
- **Merch logic:** `rv-product-stack-with` / `rv-product-complete-set` (multi-select bundles, live total + auto discount code), `rv-product-vanity-upsell`.
- **Global UX:** `rv-search-drawer` (predictive), `rv-cart-drawer` (slide-out, free-ship progress), `rv-quickview`, `rv-welcome-popup`.

## Live integrations the theme expects (apps)
- **Loox** — reviews widget + star ratings (`loox-rating`, Loox metafields). Enable the app embed.
- **LoyaltyLion** ("Rare Velvet points") — PDP points line + footer Rewards band.
- **Notify Me** — wishlist heart + back-in-stock button (`[data-notify-me]`, `[data-wishlist]`).
- **Search & Discovery** (Shopify) — powers collection filters.

## Merchandising conventions
- **Badges** (`snippets/rv-badge.liquid`): priority **Limited Edition → Best Seller → Low Stock → New In**; max 2 shown; **Sold Out** auto from inventory; **Low Stock** when inventory < 15. "Best Sellers" collection drives Best Seller; "New In" drives New In.
- **Material subtitle** (`snippets/rv-material.liquid`): metafield `custom.material_name`, else inferred from Metal option.
- **Details & Materials** accordion: metafields `custom.material`, `custom.size`, `custom.finish` (labelled rows); legacy fallback `custom.length/width/...`.
- **Discount codes (codes, NOT automatic):** `STACK15` (Stackables 15%), `VANITY10` (storage 10%, non-combinable), `GLOW15` (routine 15%), `COLLECT15`, `LOUNGE10` — each applied only via its module's "add the set" button.

## Interactions & Behavior
- **Header:** sticky; hides on scroll-down, reveals on scroll-up; shrinks (logo + padding) once scrolled.
- **PDP gallery:** thumbnail rail + main image; desktop hover-zoom (cursor-pan 2.2×); click → full-screen lightbox; mobile pinch-to-zoom.
- **Quick-add / quick-view:** collection cards reveal quick-add on hover; eye icon opens quick-view modal (fetches `/products/{handle}.js`, variant pick, AJAX add → cart drawer).
- **Cart drawer:** opens on add; free-shipping progress bar (threshold $50); qty change/remove via AJAX.
- **Bundles:** multi-select; live subtotal + "save $X"; applies the section's discount code on add.
- **Subscribe & save** (devices/skincare): one-time vs auto-refill serum (15% off, every 2 months).
- **Responsive:** mobile-first. Nav collapses to full-screen Odd-Muse overlay; category pills shown as small buttons on mobile; PDP gallery → swipe carousel; sticky bottom ATC.

## Files in this bundle
- `theme/` — the full Shopify theme (install via Shopify admin or `shopify theme push`).
- `design_references/` — HTML prototypes for visual truth:
  - `Rare Velvet Homepage v2.dc.html` (homepage — clay/winning palette)
  - `Rare Velvet Our Story.dc.html`
  - `Rare Velvet Jewelry PDP v2.dc.html`, `Rare Velvet Jewelry Boxes PDP.dc.html`
  - `Rare Velvet Skincare PDP.dc.html`, `Rare Velvet Skincare Devices PDP.dc.html`, `Rare Velvet Skincare Devices Mobile.dc.html`
  - `Rare Velvet Lounge PDP.dc.html`
  - `Rare Velvet Cart Mockup.dc.html`, `Rare Velvet Badge Logic.dc.html`
  - `Rare Velvet Launch Checklist.dc.html`
  - `image-slot.js` (drag-drop placeholder used by the prototypes only — not part of the production theme)

## Recommended first steps for the developer
1. Install `theme/` (Shopify admin → Themes → Upload zip, or `shopify theme push`) and publish to a dev/unpublished theme.
2. Create **metafield definitions**: `custom.material`, `custom.size`, `custom.finish`, `custom.material_name` (Products).
3. Set each product's **Product Type** per the routing table; tag rings.
4. Create collections: `best-sellers`, `new-in`, `stackables`, plus category collections; enable **Search & Discovery** filters.
5. Create the **discount codes** above (mark VANITY10 non-combinable).
6. Install/enable **Loox, LoyaltyLion, Notify Me**; fill **Settings → Policies** (footer auto-pulls).
7. Replace placeholder imagery with real photography; QA mobile (nav, sticky ATC, cart drawer).
