# Rare Velvet — Audit, Discount Stress‑Test & Recommendations

This document answers four questions:
1. **What was fixed / changed** when the theme was brought into this repo.
2. **Do the discount + upsell logics make sense?** (the stress test you asked for)
3. **What's missing.**
4. **Flaws & things to consider before packaging / going live.**

Validation baseline: `shopify theme check` → **0 errors, 4 warnings** (the 4 are an
intentional placeholder snippet + Google Fonts loaded remotely — both fine).

---

## 1) What was fixed / changed

### Correctness bugs fixed (these would have shipped broken)
| Area | Problem | Fix |
|---|---|---|
| Bundles (`stack-with`, `complete-set`) | Invalid Liquid `if … contains x == false` — the "match metal tone" filter silently broke the conditional | Rewrote with `unless` |
| Cart page (`rv-cart`) | `\| plural` is **not a Shopify filter** — item‑count pluralization never rendered | Inline `{% if count != 1 %}s` |
| Quick‑add (collection pages) | Collection grid bound its **own** click handler *and* the global one in `rv-theme.js` → **every quick‑add added the item twice** | Guarded the inline handler with `__rvQuickAdd` (matches product‑grid) |
| `gift_card.liquid` | `gift_card_qr_image` filter doesn't exist; missing translation key | Switched to `gift_card.qr_identifier` markup; literal title |
| `settings_schema.json` | Empty strings in `*_url` fields = invalid schema | Real URLs |
| `rv-product-fbt` | Section name > 25 chars (won't save) | Shortened |
| Dead code (`rv-cart.js`) | `[data-quick-add]` handler bound to an attribute no element uses | Removed; replaced with a `rv:cart:updated` count sync |
| Cosmetic | underscore var names, unused `assign`, out‑of‑scope `form` object | Cleaned |

### Architecture / best‑practice upgrades
- **All pages → JSON templates** (homepage, 6 PDP layouts, collection, page, our‑story,
  blog, article, search, cart, 404). Everything is now editable/reorderable in the theme
  editor. (Was: hard‑coded `.liquid` templates a merchant couldn't touch.)
- **Subscribe & Save is now real.** Previously the "Subscribe & save 15%" treatment was a
  decorative text label with no `selling_plan` wired to the form — selecting it did
  nothing. It now renders a proper **selling‑plan radio group** *only when the product
  actually has selling plans*, and submits a `name="selling_plan"` input so checkout
  creates a true subscription. Requires the **Shopify Subscriptions** app (or Recharge等)
  to create the plans. (`sections/rv-product-main.liquid`)
- **PDP add‑to‑cart is now AJAX** and opens the cart drawer (was a full reload to `/cart`).
  Uses `FormData`, so variant + quantity + selling plan + line‑item properties are all
  forwarded. Falls back to native submit on error.
- **Free‑shipping threshold unified.** It was hard‑coded to `5000` on the cart page but a
  setting (default `$50`) in the drawer — they could silently disagree. Now there's a
  single global setting **Theme settings → Cart & shipping → Free shipping threshold**
  that both read.
- **Duplicate DOM id removed.** `#rv-cart-upsell` existed in two sections; namespaced with
  `section.id`.

---

## 2) Discount + upsell stress test

**How the bundle modules work today:** the shopper taps pieces, the button shows a live
"save $X", and on click the JS adds all selected variants with `/cart/add.js`, then sends
the browser to `**/discount/CODE?redirect=/cart**`, which activates a discount **code** for
the whole cart.

That mechanism *works*, but it has four real risks you should understand. I've added a
fix toggle for the biggest ones (see "auto‑discount mode" below).

### ⚠️ Risk 1 — The code applies to the WHOLE cart, not just the bundle
`/discount/STACK15` turns on the code for the entire cart session. If `STACK15` is "15% off
order" and the shopper already had other items in the bag, **those get 15% off too**.
→ **You must scope every code in Admin** to the relevant collection (Discounts → *code* →
Applies to → Specific collections), or set a minimum. Otherwise it's a margin leak.

### ⚠️ Risk 2 — The code persists even if they remove the bundle
Once the `/discount/` URL is hit, the code sticks to the cart. A shopper can add the stack
(triggering 15%), delete all but one piece, and still check out with 15% off a single item.
→ Mitigate with **minimum quantity / minimum subtotal** requirements on the code.

### ⚠️ Risk 3 — Multiple modules can't stack (this is the big upsell gotcha)
Shopify allows **one discount code per order** unless discounts are explicitly configured
as combinable. `STACK15`, `GLOW15`, `VANITY10`, `LOUNGE15`, `COLLECT15` are all separate
codes. If a shopper builds two bundles, the second `/discount/` URL **overwrites** the
first — they silently lose one discount, even though both modules promised a saving.
→ Either accept "best single bundle discount applies," **or** move to automatic discounts
(below), which you *can* mark combinable in Admin.

### ⚠️ Risk 4 — Displayed "save $X" is only as honest as your Admin setup
The "— save $12" on the button is computed from the section's **Discount %** setting, not
from the real discount. If the Admin code is a different % (or a fixed amount, or doesn't
apply because of scoping), **the shopper is shown a saving they won't actually get.**
→ Keep the section's *Discount %* in lock‑step with the Admin discount value, and treat the
button figure as an estimate.

### ✅ The fix I added: "auto‑discount mode"
Every bundle module (`stack-with`, `complete-set`, `vanity-upsell`, `routine-builder`) now
has a checkbox **"Use an automatic discount instead of a code (recommended)."**

- **ON** → the module just adds the items and goes to the cart; it does **not** put a code
  in the URL. You create a single **Automatic discount** in Admin
  (Discounts → Create → Automatic → e.g. "Buy 2+ from *Stackables*, 15% off those
  products"). Automatic discounts are **scoped, can be marked combinable, and can't be
  gamed by URL** — this neutralizes Risks 1–3 in one move.
- **OFF** → legacy behavior (applies the code via `/discount/CODE`).

**Recommendation:** ship with **auto‑discount mode ON** and build the matching Automatic
discounts. It is materially safer for margin and far less confusing for shoppers. The exact
Admin config for all four modules is in **[`docs/DISCOUNTS.md`](DISCOUNTS.md)**.

### The cleanest long‑term option: native Shopify Bundles
For "buy these specific products together at a set price," Shopify's **Bundles** (Shopify
Bundles app / "fixed bundles") or an app like **Fast Bundle / Rebuy** creates a real
discounted bundle product. That removes the cart‑URL dance entirely and reports cleanly in
analytics. Worth it if bundles become a core merchandising lever.

### Subscribe & Save (now functional)
Real selling plans are wired (§1). Confirm: install **Shopify Subscriptions**, create a
selling plan group (e.g. "Refill every 2 months — 15% off"), attach it to the serum /
device products. The PDP will then show One‑time vs Subscribe automatically. With **no**
selling plan attached, the subscribe UI correctly hides itself.

---

## 3) What's missing / to wire before launch

**Apps the theme is built to use (hooks already in place):**
- **Loox** (reviews + star ratings) — `rv-product-reviews`, `loox-rating` hooks.
- **LoyaltyLion** ("Rare Velvet points") — PDP points line + footer band.
- **Notify Me / wishlist** — `[data-wishlist]`, `[data-notify-me]` hooks for heart + back‑in‑stock.
- **Shopify Subscriptions** (or Recharge) — for the new Subscribe & Save.
- **Shopify Search & Discovery** — powers collection filters.
- **Rebuy** *(optional)* — cart‑drawer/upsell widget id field exists; native recs used otherwise.

**Store data to create:**
- **Metafields** (Products): `custom.material`, `custom.size`, `custom.finish`,
  `custom.material_name` (drive the Details & Materials accordion + material subtitle).
- **Collections** with these exact handles: `best-sellers`, `new-in`, `stackables`,
  `vanity`, `lounge` (+ your category collections). Badges and the bundle modules read them.
- **Product Types / Template** assignment per the routing table in the README.
- **Discounts** per §2 (prefer Automatic).
- **Policies** (Settings → Policies) — the footer auto‑pulls them.
- **Menus**: main nav + footer (the header/footer read your linklists).

**Content placeholders that read as real claims — now neutralized (fill in before launch):**
The fabricated stats/claims that previously shipped as defaults have been replaced with
clearly‑labelled placeholders ("Add a stat", "Add a label", "Publication", empty review
counts) plus `info` notes reminding you to use only real, verifiable figures. Affected
sections: `rv-results-strip`, `rv-device-credibility`, `rv-product-device-results`,
`rv-device-derm` (the invented dermatologist quote/name is gone), `rv-product-reviews`
(manual fallback counts/review now blank — Loox is the default source), `rv-testimonial-band`
(the "12,400+ reviews" anchor is removed), and `rv-press-bar` (VOGUE/ALLURE/ELLE/BAZAAR →
"Publication"). The homepage (`templates/index.json`) was also scrubbed of the baked‑in
press logos and review count. **You still must enter your own real stats/press/reviews
before launch** — shipping fabricated FDA/percentage/review/endorsement claims is a
legal/ad‑standards risk. (Ideally drive review numbers from Loox/metafields.)

**Functional gaps worth knowing:**
- **No `customers/*` or `gift_card` JSON templates** — these stay `.liquid` (form pages).
  Editable in code, not in the editor. Standard, but flagged for completeness.
- **Header/footer are now section groups** (`sections/header-group.json` +
  `footer-group.json`). The announcement bar, header, footer columns and the global
  drawers/popups are editable in the theme editor, and you can add/remove sections in those
  regions. (This also fixed a latent bug: rendered as static `{% section %}` with no stored
  data, the announcement + footer blocks were rendering empty.)
- **Self‑hosted fonts.** Google Fonts load remotely (3 theme‑check `RemoteAsset` warnings).
  Fine, but self‑hosting shaves a little CLS/latency and is more privacy‑robust.
- **Newsletter popup / footer signup** post to Shopify's customer form; if you use Klaviyo,
  point them at Klaviyo instead.

---

## 4) Flaws & things to consider before packaging

1. **Theme‑editor assignment is now manual per product.** The trade‑off for editability:
   you (or staff) must set each product's **Template**. Bulk‑edit via the Admin product
   list (Bulk editor → Theme template column) makes this fast.
2. **Inline `<script>`/`<style>` per section.** Great for portability, but it means CSS/JS
   isn't minified/bundled and a little duplicates across sections. Acceptable for this scale;
   revisit if Lighthouse perf becomes a priority.
3. **`all_products` lookups in routine/bundle modules** require those products to be picked
   in the editor; empty pickers fall back to friendly "add products to collection X" copy.
4. **Cart drawer re‑fetches `/cart.js` after each add** (one redundant round‑trip). Minor;
   left as‑is for reliability.
5. **One branch ↔ one theme** with the GitHub integration (see README). Don't point two
   live themes at the same branch.
6. **QA matrix before publish:** mobile nav overlay, sticky ATC, cart drawer open‑on‑add,
   variant switch price update, quick‑add (now single‑fire), each of the 6 PDP templates,
   predictive search, discount math at checkout (the real number, not the button estimate).

---

## TL;DR
- Theme is clean (0 theme‑check errors) and now **fully editable in the theme editor**.
- The **discount mechanism works but leaks/persists/can't‑stack by default** — switch the
  new **auto‑discount toggle ON** and create **scoped Automatic discounts**; that's the
  single most important pre‑launch action.
- **Subscribe & Save is now real** but needs the Subscriptions app + selling plans.
- Replace the **placeholder stats/claims** before launch (FDA / review counts).
- Use Shopify's **GitHub integration** to install — cleanest, keeps editor edits in git.
