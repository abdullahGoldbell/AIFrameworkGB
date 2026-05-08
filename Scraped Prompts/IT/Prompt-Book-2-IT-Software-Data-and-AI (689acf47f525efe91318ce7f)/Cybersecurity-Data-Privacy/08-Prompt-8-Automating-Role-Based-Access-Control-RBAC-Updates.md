### **Prompt 8 — Automating Role-Based Access Control (RBAC) Updates**

**Backstory:** Employees change departments often, but their access permissions stay the same, leaving old data vulnerable.

**Goal:** Automate RBAC updates based on HR records.

**Prompt:

** "You are an **Access Control Automation Expert**. I want an integration between our HR system and internal application APIs to update user permissions automatically.

Your task:

  - Fetch updated employee roles from HR system API.

  - Compare current permissions in application API.

  - Add/remove access rights based on role changes.

  - Log all changes with timestamps.

  - Notify IT admin for high-privilege changes.

**Output format:** RBAC sync script + permissions change log + alert email template.

**Input Files & Code Section:**

  - HR system API credentials

  - Application API credentials

Role-to-permission mapping JSON"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b811b8beba038b6deb705
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b811b8beba038b6deb705
