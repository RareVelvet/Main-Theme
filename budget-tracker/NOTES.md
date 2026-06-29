# Intentional Budget Tracker — Notes & Best Practices

Two audiences below: **buyers** (the people who use the workbook) and **you, the
reseller** (the person selling it). Hand the buyer section to customers; keep the
reseller section for yourself.

---

## For the buyer — how to get the most from this workbook

**Getting started**
1. Open **Start Here** and replace every honey-shaded cell with your own numbers.
   Only honey cells are editable — everything else is a formula and is locked.
2. Use **net (take-home)** income for budgeting. Gross is there for context only.
3. Work the tabs left to right. They build on each other.

**Monthly rhythm (10 minutes)**
- Update **Monthly Spending → Actual** for each category.
- Aim to get **Left to assign** to `$0` — give every dollar a job.
- Add one row to **Net Worth Log** (same day each month — consistency beats precision).
- Skim **Monthly Review** and jot one change for next month.

**Quarterly / yearly**
- Use **Quarterly Review** to check you're on track for your work-optional year.
- Refresh **Annual Vision** each January.

**Reading your numbers**
- **Freedom Number** = the invested assets that make paid work optional.
- **Breathing Number** = a lighter milestone — enough to cover a calmer baseline.
- **Savings rate** is the single most predictive number here. 20%+ is strong.
- **Timeline**: the honey row is the year your balance first crosses the Freedom
  Number at your current pace. Use **What if…** to test extra contributions.
- **Debts**: the +$200/mo columns show how much interest and time an extra
  payment saves. Avalanche (highest APR first) saves the most money.

**Don't break it**
- Formula cells are locked. To unlock everything: **Review ▸ Unprotect Sheet**
  (there is no password). Re-protect the same way if you want the guardrails back.
- Adding rows: **Net Worth** and **Net Worth Log** allow inserting rows. If you
  add rows elsewhere, extend the `SUM`/chart ranges to match.

---

## For the reseller — selling this as a product

**License & ownership**
- This is a self-contained `.xlsx`. You may rebrand and resell the *output file*.
- Decide your license terms (e.g. "personal use, no redistribution of the file
  itself"). State them on a tab or in your listing.

**A required disclaimer (add before you sell)**
> This workbook is an educational tool, not financial, tax, or investment advice.
> Projections are estimates based on the assumptions you enter and are not
> guarantees. Consult a qualified professional for decisions about your money.

Put that on the **Read Me** tab or your sales page. It protects you and sets
honest expectations.

**Currency (non-USD buyers)**
- Number formats are hard-coded to `$`. Excel can't reliably swap the symbol from
  a cell. For non-USD customers, either: (a) ship a per-currency variant, or
  (b) tell buyers to select all cells → **Format Cells ▸ Currency** and pick their
  symbol. The `Currency` dropdown on Start Here is a label only.

**Google Sheets compatibility**
- Importing works: **File ▸ Import ▸ Upload**. Formulas, named ranges, and charts
  carry over. Two caveats to mention to buyers:
  - Sheet protection is weaker in Sheets — treat locking as "guardrails," not security.
  - `NPER`/`FV`/`CEILING`/`SUMIF` all exist in Sheets, so the math is identical.

**Protection / passwords**
- Sheets are protected with **no password** on purpose, so buyers can unlock to
  customize. If you want stronger lock-in, set a password in
  `build_tracker.py → protect()` (use `ws.protection.password = "yourpw"`), but
  keep a master copy unlocked for yourself.

**Rebranding**
- Colors and fonts live at the top of `build_tracker.py` (the palette + font
  constants). Change those, re-run `python build_tracker.py`, and the whole
  workbook re-themes. Swap the title text in `title_block(...)` calls.

**Quality / delivery checklist before each sale**
- [ ] Run `python build_tracker.py` and open the file once to confirm it's clean.
- [ ] Confirm the acceptance test: change `AnnualExpenses` on **Start Here** →
      Freedom Number, timeline, and progress all update.
- [ ] Clear the sample numbers if you want buyers to start blank, OR keep them as
      a worked example and say so (recommended — examples reduce support questions).
- [ ] Add your branding, disclaimer, and license tab.
- [ ] Test-import to Google Sheets once so you can answer buyer questions.

**Reducing support load**
- Keep the seeded sample data — it doubles as a tutorial.
- The **Read Me** tab answers the most common "how do I edit this?" questions.
- Offer a short Loom/video walkthrough; it dramatically cuts refund requests.

**Versioning**
- Tag releases (e.g. `v1.0`). When you change formulas, bump the version on the
  Read Me tab so buyers know which edition they have.

---

## For the developer — rebuilding

```bash
pip install openpyxl
python build_tracker.py        # writes "Intentional Budget Tracker.xlsx"
```

- One function per sheet; palette and fonts are constants at the top.
- Named ranges are registered at the end of `main()` and drive every cross-sheet
  formula, so moving input cells only requires updating their `named_cells` ref.
- No macros, no external data connections — pure `.xlsx`.
