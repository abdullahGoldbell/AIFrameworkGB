### **Prompt 4 — Automating PayNow Payment Reconciliation**

Backstory:

 A café owner in Singapore accepts payments via multiple e-wallets and QR rails (PayNow, GrabPay, DBS PayLah!). End-of-month reconciliation is messy because transaction IDs differ between the café’s billing software and the bank statement. They want an automated way to match digital payments to daily sales.

Goal:

 Match PayNow and e-wallet transaction data with daily sales data to confirm no payments are missing.

Prompt:

 "You are a fintech reconciliation expert. Match the PayNow and e-wallet transaction log with the daily sales records for the month.

 Steps:

  - Standardize date/time format for both datasets.

  - Match transactions based on amount and nearest timestamp.

  - Highlight sales with no corresponding payment and vice versa.

  - Output a reconciliation report with unmatched entries for review."

Inputs Required:

  - PayNow / e-wallet transaction log (CSV/Excel)

  - Daily sales report from POS/billing system

  - Tolerance for time mismatch (minutes)

  - Any known discount or refund data

---
Source course: Prompt Book 10: Finance, Accounting, Investing & Fintech
Source module: Bookkeeping & reconciliation
Source chapter: 689db875dc96293c1334eab3
Source URL: https://community.aifiesta.ai/web/courses/689db470ea60103f76d86097?chapter=689db875dc96293c1334eab3
