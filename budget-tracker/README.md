# Intentional Budget Tracker (Excel edition)

A multi-tab, formula-driven budget workbook. The buyer types their own numbers on
**Start Here** and every derived figure — Freedom Number, savings rate, net worth,
timeline, debt payoff — recalculates live via native Excel formulas. No macros
(pure `.xlsx`), so it opens in Excel, LibreOffice, and Google Sheets.

## Build

```bash
pip install openpyxl
python build_tracker.py
# -> "Intentional Budget Tracker.xlsx"          (USD, flagship)
# -> variants/Intentional Budget Tracker — GBP.xlsx, … EUR, JPY, INR, BRL, SEK, CHF
```

## Currency variants

One workbook is generated per currency (symbol baked into every number format and
the Start Here default): **USD $, GBP £, EUR €, JPY ¥, INR ₹, BRL R$, SEK kr, CHF**.
USD lives at the top level; the rest are in `variants/`. To add a currency, append a
`(code, symbol, format)` row to the `CURRENCIES` list in `build_tracker.py` and re-run.

## Tabs

| Tab | What it does |
|---|---|
| Read Me | How to use the workbook + good habits |
| Start Here | All inputs (honey cells) + your headline numbers |
| Monthly Spending | Conscious Spending Plan — budget vs. actual, savings rate |
| Net Worth | Assets − liabilities, and where your money lives |
| Net Worth Log | One row per month + growth chart |
| Freedom Number | The number that makes work optional + reflection |
| Freedom Timeline | 30-year projection, chart, and what-if panel |
| Debts | Payoff months, interest, and what +$200/mo saves |
| Annual Vision / Monthly Review / Quarterly Review / Reflection Prompts | Free-text planning space |

## Notes

- All inputs are **honey-shaded** and unlocked; formula cells are locked (no password).
- Named ranges drive every cross-sheet formula.
- Currency is hard-coded to `$` — see `NOTES.md` for non-USD handling.
- **Verified:** recalculated end-to-end (incl. the acceptance test — changing
  `AnnualExpenses` updates Freedom Number, timeline, and progress).

See **`NOTES.md`** for buyer best practices and reseller guidance (licensing,
disclaimer, currency, Google Sheets, rebranding).
