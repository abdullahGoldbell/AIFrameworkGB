### **Prompt 13 — Automating Invoice Payment Reminders**

**Backstory:** You run a small design agency. Clients often delay payments, and manually sending reminders eats up your evenings. You want an automated reminder system that sends polite follow-ups.

**Goal:** Build an API-based automation that sends reminders at 7, 14, and 21 days after invoice due date.

**Prompt:

** "You are a **Business Workflow Automation Specialist**. I want to automate client payment reminders using QuickBooks API and Gmail API.

Your task:

  - Pull unpaid invoice data from QuickBooks API with due dates.

  - Identify invoices past due by 7, 14, or 21 days.

  - Send a customised reminder email based on how late the payment is.

  - Log all sent reminders in a Google Sheet.

  - Mark the invoice in QuickBooks with “reminder sent” status.

**Output format:** Automated reminder script + email template files + logging spreadsheet.

**Input Files & Code Section:**

  - QuickBooks API credentials

  - Google API credentials for Gmail & Sheets

email_templates/ folder with HTML templates for 7, 14, 21 days"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: API Integration & Automation
Source chapter: 689b77ee17698e31a6a7b108
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b77ee17698e31a6a7b108
