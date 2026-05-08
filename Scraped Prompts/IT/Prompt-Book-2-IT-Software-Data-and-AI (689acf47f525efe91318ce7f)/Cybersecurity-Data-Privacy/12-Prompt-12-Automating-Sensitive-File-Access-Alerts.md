### **Prompt 12 — Automating Sensitive File Access Alerts**

**Backstory:** You store financial reports in a shared drive, and last quarter a contractor downloaded files they weren’t supposed to access.

**Goal:** Set up real-time alerts for access to sensitive files.

**Prompt:

** "You are a **File Access Monitoring Specialist**. I want an automation that detects and alerts whenever certain high-security files are accessed.

Your task:

  - Connect to Google Drive API or internal file server API.

  - Monitor access logs for the target file/folder.

  - Trigger an alert when access is detected outside approved user list.

  - Record details: user ID, timestamp, IP address.

  - Send an incident report to the security team.

**Output format:** File access monitoring script + alerting system + incident report format.

**Input Files & Code Section:**

  - File/folder ID list CSV

  - Approved user list CSV

Email/SMS API credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b81ceb87848cc98bd2732
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b81ceb87848cc98bd2732
