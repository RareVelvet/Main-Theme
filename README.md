# Rare Velvet — Shopify Theme (Online Store 2.0)

Beauty · Organization · Self‑Care · Everyday Luxury.
A hand‑built OS 2.0 theme (plain Liquid + vanilla JS + hand‑written CSS, **no build step**).

> **New in this revision:** every storefront page is now a **JSON template**, so the
> homepage, all PDP layouts, collections, blog, article, search, cart and 404 are
> fully **drag‑and‑drop editable in the Shopify theme editor**. See
> [`docs/AUDIT-AND-RECOMMENDATIONS.md`](docs/AUDIT-AND-RECOMMENDATIONS.md) for the full
> review, the discount‑logic stress test, what's missing, and known flaws.

---

## What's in the box

```
assets/      rv-base.css, rv-product.css, rv-theme.js, rv-gallery.js, rv-cart.js
config/      settings_schema.json, settings_data.json
layout/      theme.liquid
locales/     en.default.json
sections/    ~70 sections (home, PDP, collection, cart, global UX)
snippets/    rv-badge, rv-material, rv-loyalty-points, rv-icon-placeholder
templates/   index.json + product*.json + collection/page/blog/article/search/cart/404.json
             (customers/* and gift_card stay .liquid — form pages, by design)
design-reference/   HTML prototypes from Claude Design (NOT shipped — visual truth only)
docs/        SETUP + AUDIT-AND-RECOMMENDATIONS
```

## PDP routing — IMPORTANT (this changed)

The old build used a single `product.liquid` that branched on Product Type. That works,
but it is **not editable in the theme editor**. This revision replaces it with proper
**JSON product templates**, one per layout:

| Template file              | Use it for                                   |
|----------------------------|----------------------------------------------|
| `product.json` (default)   | Jewelry boxes / interior / accessories       |
| `product.jewelry.json`     | Jewelry, rings, necklaces (incl. ring guide) |
| `product.skincare.json`    | Skincare / serums / beauty                   |
| `product.device.json`      | Skincare & beauty devices (richest layout)   |
| `product.bundle.json`      | Bundles / sets / kits                        |
| `product.lounge.json`      | Loungewear / apparel                         |

**You assign the template per product**: Admin → Products → *(product)* → right column
**Theme template** → pick one. Products with nothing selected use `product.json`.
Every section inside each template can then be reordered, hidden, duplicated or edited
in **Online Store → Customize**.

## Deploying via GitHub (recommended)

Shopify has a first‑party **GitHub integration** — this is the cleanest path:

1. Push this repo to GitHub (see below).
2. Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**.
3. Authorize, pick this repo and the branch (`main` once merged).
4. Shopify creates a theme that **stays in sync with the branch** — every push updates
   the (unpublished) theme. Edits made in the theme editor are **committed back** to the
   branch by Shopify.
5. Preview, QA, then **Publish**.

Notes & gotchas with the GitHub flow:
- The theme files must be at the **repo root** (they are — `config/`, `layout/`, etc.).
  Extra folders like `design-reference/` and `docs/` are ignored by Shopify.
- Connect **one branch to one theme**. If two people edit the same theme in the editor
  *and* push to the branch, you can get merge conflicts in `settings_data.json` /
  `templates/*.json`; coordinate, or use a dedicated branch per theme.
- For quick local iteration you can also use the Shopify CLI:
  `shopify theme dev` (live preview) and `shopify theme push`.

## Local validation

```bash
npm i -g @shopify/cli @shopify/theme
shopify theme check     # currently: 0 errors, 4 (intentional) warnings
```

See `docs/SETUP.md` for the full store‑configuration checklist (metafields,
collections, discounts, apps).
