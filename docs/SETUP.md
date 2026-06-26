# Rare Velvet — Store Setup Checklist

Do these in Shopify Admin after the theme is installed. Order matters a little.

## 1. Install the theme
- Easiest/cleanest: **Online Store → Themes → Add theme → Connect from GitHub** (see README).
- Or upload a zip of the repo root, or `shopify theme push`.

## 2. Metafield definitions (Settings → Custom data → Products)
Create these (single‑line text unless noted):
- `custom.material`, `custom.size`, `custom.finish` → drive the Details & Materials accordion
- `custom.material_name` → the small "material" subtitle under product titles

## 3. Collections (Products → Collections) — handles must match exactly
- `best-sellers` → powers the "Best Seller" badge + Best Sellers grid
- `new-in` → "New In" badge + New Arrivals
- `stackables` → Stack‑It‑With module
- `vanity` → Complete‑Your‑Vanity upsell
- `lounge` → Complete‑the‑Set module
- plus your category collections (Skincare, Beauty, Jewelry, Interior, Gifts…)
- Enable **Search & Discovery** app for filters.

## 4. Assign PDP templates (per product)
Admin → Products → *(product)* → **Theme template** → choose:
`product` (default/box), `product.jewelry`, `product.skincare`, `product.device`,
`product.bundle`, or `product.lounge`. Use the **bulk editor** (add the "Theme template"
column) to do many at once.

## 5. Discounts (Discounts) — read docs/AUDIT §2 first
**Recommended:** in each bundle section turn ON *"Use an automatic discount (recommended)"*,
then create matching **Automatic** discounts, each **scoped to its collection**:
- Stackables → e.g. "15% off Stackables when 2+ in cart"
- Routine (skincare) → 15% off the routine products
- Vanity/storage → 10% off `vanity`
- Lounge set → 15% off `lounge`
Set combination rules deliberately (product/order/shipping). Keep each discount's **%**
equal to the section's **Discount %** so the on‑screen "save $X" is truthful.

If you instead keep code mode: create codes `STACK15 / GLOW15 / VANITY10 / LOUNGE15 / COLLECT15`,
**scope each to its collection**, and add **minimum quantity/subtotal** to prevent gaming.

## 6. Apps
- **Loox** (reviews) · **LoyaltyLion** (points) · **Notify Me / wishlist** ·
  **Shopify Subscriptions** (for Subscribe & Save) · **Search & Discovery** (filters).
- Optional: **Rebuy** (paste widget id into the Cart Upsell section).

## 7. Subscriptions (for Subscribe & Save)
Install **Shopify Subscriptions** → create a selling plan group (e.g. "Refill every 2
months — 15% off") → attach to serum/device products. The PDP shows One‑time vs Subscribe
automatically once a plan is attached.

## 8. Global settings (Online Store → Customize → Theme settings)
- **Cart & shipping → Free shipping threshold** (default $50) — drives cart + drawer + bar.
- **Colors**, **Social media** handles, **Product info (PDP accordions)** defaults.

## 9. Content & legal
- Settings → **Policies** (footer auto‑pulls them).
- Main menu + footer menus (Navigation).
- **Replace placeholder stats/claims** (FDA / review counts / press logos) — see AUDIT §3.
- Swap placeholder imagery for real photography.

## 10. Pre‑publish QA
Mobile nav, sticky ATC, cart drawer open‑on‑add, variant price update, single‑fire
quick‑add, all 6 PDP templates, predictive search, and **verify real discount math at
checkout** (not just the button estimate). Then **Publish**.
