### **Prompt 15 — Automating Password Expiry Reminders**

**Backstory:** Employees often forget to change passwords on time, leading to expired accounts and downtime.

**Goal:** Send automated password change reminders.

**Prompt:

** "You are an **Account Security Automation Specialist**. I want to integrate with Active Directory (AD) to send reminders before password expiry.

Your task:

  - Connect to AD via API or LDAP.

  - Fetch users whose passwords expire within 10 days.

  - Send email reminders at 10, 5, and 2 days before expiry.

  - Track who changes passwords after reminders.

  - Generate a monthly compliance report.

**Output format:** Reminder script + email template + compliance tracking sheet.

**Input Files & Code Section:**

  - AD connection details

  - Email SMTP credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b820a46ac182d1f429066
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b820a46ac182d1f429066
