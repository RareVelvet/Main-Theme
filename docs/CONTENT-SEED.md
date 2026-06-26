# Rare Velvet — Content Seed (footer menus + announcement)

The theme's footer columns and announcement bar are pre‑seeded with your Claude Design
content. The **announcement copy and footer column headings are already in the theme**
(`sections/header-group.json`, `sections/footer-group.json`) — editable in
**Online Store → Customize**.

The footer **links** come from Shopify **navigation menus** (the theme can't create those —
they live in Admin). Create the two menus below and the footer fills in automatically; the
column blocks are already pointed at the handles `customer-care` and `company`.

## Announcement bar (already seeded — edit in Customize → Header)
1. Complimentary shipping over $50
2. Free 30‑day returns on every order
3. Earn Rare Velvet points on every purchase

## Footer menus to create — Admin → Online Store → Navigation → Add menu

### Menu 1 — title **"Customer Care"** (handle becomes `customer-care`)
| Label | Link to |
|---|---|
| Contact | Page: Contact (`/pages/contact`) |
| Shipping | Page: Shipping (`/pages/shipping`) |
| Returns | Page: Returns (`/pages/returns`) |
| FAQ | Page: FAQ (`/pages/faq`) |

### Menu 2 — title **"Company"** (handle becomes `company`)
| Label | Link to |
|---|---|
| Our Story | Page: Our Story (`/pages/our-story`) |
| Journal | Blog: Journal (`/blogs/journal`) |
| Affiliates | Page: Affiliates (`/pages/affiliates`) |

> If a menu title produces a different handle, just open the footer column block in
> Customize and re‑select the menu — the heading stays, only the menu pointer changes.

### Policies column (separate, built‑in)
The footer's **Policies** column is driven by its own *Policy menu* setting. Create the
pages/policies, build a menu (e.g. "Policies") with **Privacy Policy, Refund Policy,
Shipping Policy, Terms of Service**, then Customize → Footer → set **Policy menu** to it.
(Shopify's policy pages live at `/policies/...` once you fill Settings → Policies.)

## Pages/blog to exist for the links above
Create these (Admin → Pages, and Blog "Journal"): Contact, Shipping, Returns, FAQ,
Our Story (template `page.our-story`), Affiliates, and a **Journal** blog. The
`page.our-story.json` template is already in the theme — assign it to the Our Story page.
