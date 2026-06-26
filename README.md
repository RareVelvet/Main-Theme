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
sections/    ~70 sections + header-group.json / footer-group.json (editable header & footer)
snippets/    rv-badge, rv-material, rv-loyalty-points, rv-icon-placeholder
templates/   index.json + product*.json + collection/page/blog/article/search/cart/404.json
             (customers/* and gift_card stay .liquid — form pages, by design)
design-reference/   HTML prototypes from Claude Design (NOT shipped — visual truth only)
docs/        SETUP + AUDIT-AND-RECOMMENDATIONS
```

## PDP routing — IMPORTANT (auto‑adapts by Product Type)

There is **one** product template, `templates/product.json`, used by every product —
**nothing to assign**. It contains every PDP module, and each type‑specific module
renders **only for matching products** (it self‑hides otherwise). So the layout adapts
automatically from each product's **Product Type**:

| Product Type contains…                                   | Modules that appear |
|----------------------------------------------------------|---------------------|
| `jewelry` / `ring` / `necklace` / `earring` / `bracelet` | Jewelry hero, hallmarks, stack‑with + style‑with upsells, layering, shop‑the‑look, ring‑size guide (rings/`ring` tag) |
| `skincare` / `serum` / `beauty` / `cleanser` / `lip` / `makeup` | Ingredients, results strip, how‑to‑use, concern tiles |
| `device` / `tool`                                        | Credibility, derm, device results, spec row, comparison, how‑to‑use, guarantee |
| `bundle` / `set` / `kit`                                 | What's included |
| `lounge` / `fashion` / `apparel` / `loungewear`          | Complete‑the‑set, style‑with |
| anything / blank                                         | Shared base only (gallery+buy box, benefits, gifting, FBT, UGC, accordions, reviews, recently‑viewed, cross‑sell) |

**So the one setup step is: set each product's _Product Type_ correctly** (Admin →
Products → *(product)* → **Product type**). e.g. the huggie earrings need a type like
`Jewelry` or `Earring` to get the jewelry layout + upsells. Bulk‑edit the *Product type*
column to do a whole catalog fast.

Everything is still **fully editable in Online Store → Customize**: reorder, hide,
duplicate or restyle any module. (Modules that don't apply to the product you're editing
simply render nothing on the storefront.)

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
