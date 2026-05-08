### **Prompt 10 — Automating SSL Certificate Expiry Alerts**

**Backstory:** One of your client websites went down because the SSL certificate expired — and nobody noticed in time.

**Goal:** Monitor SSL expiry dates and send alerts before expiration.

**Prompt:

** "You are a **Web Security Automation Engineer**. I want a system that checks SSL certificate expiry dates for a list of domains.

Your task:

  - Fetch SSL certificate details for each domain.

  - Identify expiry dates within the next 30 days.

  - Send alert emails with renewal instructions.

  - Update a tracking sheet with expiry status.

  - Repeat the check daily.

**Output format:** SSL monitoring script + expiry alert template + tracking spreadsheet.

**Input Files & Code Section:**

  - Domain list CSV

  - Email SMTP settings

  - Google Sheets API credentials"

### **Prompt 11 — Automating Endpoint Device Compliance Checks**

**Backstory:** Your company has a Bring Your Own Device (BYOD) policy, but many employees connect with outdated or unpatched devices, creating security gaps.

**Goal:** Automatically check if employee devices meet compliance requirements before allowing network access.

**Prompt:

** "You are an **Endpoint Security Automation Engineer**. I want a system that verifies employee device compliance (OS version, antivirus status, firewall enabled) every time they connect to the company network.

Your task:

  - Integrate with an endpoint management API (e.g., Microsoft Intune, Jamf).

  - Collect device compliance data in real time.

  - Block network access if the device fails checks.

  - Notify the employee with steps to fix compliance issues.

  - Log all non-compliant devices for security audits.

**Output format:** Compliance check script + access control API integration + remediation email template.

**Input Files & Code Section:**

  - Endpoint management API credentials

  - Compliance rule configuration file (JSON)

  - Network access control API credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b813f0ed5aef039a5fed3
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b813f0ed5aef039a5fed3
