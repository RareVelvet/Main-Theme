# Rare Velvet — Automatic Discount Spec (for the bundle/upsell modules)

This is the exact Admin configuration to pair with the bundle modules when you run them
in **auto‑discount mode** (recommended). See `AUDIT-AND-RECOMMENDATIONS.md §2` for *why*
this is safer than the code‑via‑URL approach.

## How it fits together
1. In each bundle section (theme editor) turn ON **"Use an automatic discount (recommended)."**
   The module then just adds the selected items to the cart — no code in the URL.
2. You create one **Automatic discount** per module in **Admin → Discounts → Create discount
   → Automatic**, scoped to that module's collection.
3. Keep the discount **%** equal to the section's **Discount %** setting so the on‑button
   "save $X" estimate matches what the shopper actually pays.

> Native automatic discounts apply whenever the qualifying items are in the cart and the
> minimum is met — not only when added through the module. That's intentional and *better*:
> a shopper who builds the same stack by hand still gets the deal, and it can't be gamed by
> a URL. Use a **minimum quantity** to make sure it only triggers for a real bundle.

---

## The four discounts

> Type to choose in Admin: **"Amount off products"** → Method **Automatic** →
> Discount value **Percentage** → Applies to **Specific collections**.

| Module (section) | Toggle in editor | Automatic discount name | Applies to collection | Value | Minimum (Discounts UI) |
|---|---|---|---|---|---|
| **Stack It With** (`rv-product-stack-with`) | auto ON, Discount % = 15 | `Stack & Save 15%` | `stackables` | 15% off those products | **Min quantity of items: 2** |
| **Complete The Set** (`rv-product-complete-set`) | auto ON, Discount % = 10 | `Complete the Set 10%` | `lounge` | 10% off those products | **Min quantity of items: 2** |
| **Complete Your Vanity** (`rv-product-vanity-upsell`) | auto ON, Discount % = 10 | `Vanity Bundle 10%` | `vanity` | 10% off those products | **Min quantity of items: 2** |
| **Routine Builder** (`rv-routine-builder`) | auto ON, Discount % = 15 | `Morning Glow Routine 15%` | a `routine-glow` collection* | 15% off those products | **Min quantity of items: 2** (or 3) |

\* The routine module pulls products you pick in the editor, not a collection. Create a
small collection (e.g. handle `routine-glow`) containing the three routine SKUs and scope
the discount to it, so the discount only touches routine products.

### Step‑by‑step (do this 4×, once per row)
1. **Admin → Discounts → Create discount → Amount off products.**
2. **Method:** Automatic. **Title:** the name from the table (shoppers see this at checkout).
3. **Value:** Percentage → enter the % from the table.
4. **Applies to:** Specific collections → pick the collection from the table.
5. **Minimum purchase requirements:** *Minimum quantity of items* → **2** (or 3 for the routine).
6. **Combinations:** see below.
7. **Active dates:** set start; leave end empty for evergreen.
8. **Save.** Repeat for the next row.

---

## Combination strategy (so upsells actually stack)
On each automatic discount, under **Combinations**, decide deliberately:

- **Product discounts:** turn **ON** "combines with other product discounts" if you want a
  shopper who builds *two* bundles (e.g. a stack **and** a vanity set) to get *both*. This
  is the main reason to use automatic discounts — codes can't do this. Leave OFF if you
  only ever want one bundle deal per order.
- **Order discounts** (e.g. a sitewide "WELCOME10" order code): usually **ON**, so a bundle
  saving and a welcome code can coexist.
- **Shipping discounts:** **ON** (free‑ship threshold etc. is unaffected anyway).

> Caveat: two *percentage* product discounts that both apply to the **same item** don't
> compound on that item — Shopify applies the better one per line. With min‑quantity = 2 and
> distinct collections, that overlap is rare. If you need true "buy 2 get 15%, buy 4 get
> 25%" tiers, use **Shopify Functions** (a discount app) or separate tiered automatic
> discounts.

## If you keep CODE mode instead (auto toggle OFF)
Create codes `STACK15 / LOUNGE10 / VANITY10 / GLOW15`, each **scoped to its collection**
(Discounts → code → Applies to → Specific collections) **and** with a **minimum quantity of
2**. Without scope + minimum you get the whole‑cart leak / persistence / gaming described in
the audit. Note codes still **can't combine** with each other — only one applies per order.

## Verify (before launch)
For each module: open a matching PDP, add the bundle, go to checkout, and confirm the
**actual** discount line equals the on‑button estimate. Then test the *negative* case:
add a single item (below the minimum) and confirm **no** discount applies.
