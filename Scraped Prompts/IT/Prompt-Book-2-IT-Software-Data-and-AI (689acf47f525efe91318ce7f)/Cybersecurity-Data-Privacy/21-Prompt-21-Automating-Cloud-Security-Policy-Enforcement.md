### **Prompt 21 — Automating Cloud Security Policy Enforcement**

**Backstory:** Your cloud storage contains sensitive client contracts, but some employees make files public by mistake.

**Goal:** Automatically detect and fix misconfigured cloud permissions.

**Prompt:

** "You are a **Cloud Security Automation Specialist**. I want a system that scans all files in Google Drive/AWS S3 for public access and restricts them to approved users only.

Your task:

  - Connect to the cloud storage API.

  - Identify files/folders with public sharing enabled.

  - Automatically remove public access.

  - Notify the file owner about the change.

  - Log all permission changes for audits.

**Output format:** Permission scan script + remediation log + owner notification email template.

**Input Files & Code Section:**

  - Cloud storage API credentials

  - Approved user list CSV

  - Notification email template"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b82a8ba8b153e1893b192
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b82a8ba8b153e1893b192
