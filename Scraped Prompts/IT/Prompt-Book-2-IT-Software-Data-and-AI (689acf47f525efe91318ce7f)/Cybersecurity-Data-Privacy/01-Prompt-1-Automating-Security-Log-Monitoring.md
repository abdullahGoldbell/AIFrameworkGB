### **Prompt 1 — Automating Security Log Monitoring**

**Backstory:** You’re an IT administrator for a mid-sized company. Your security logs are massive, and manually scanning them for threats is impossible. Last year, you missed a brute-force attack because it got buried in the logs.

**Goal:** Create an automated pipeline that monitors security logs, flags suspicious activity, and sends real-time alerts.

**Prompt:

** "You are a **Cybersecurity Automation Engineer**. I want a script that scans server logs in real time and alerts me of suspicious activity such as failed login attempts, unusual IP addresses, or data spikes.

Your task:

  - Connect to the server log files via API or secure SSH.

  - Parse log entries and match against predefined threat patterns (failed logins >5 in 1 minute, foreign IP access, large file downloads).

  - Send an alert email/SMS if a threat is detected.

  - Store flagged events in a database for future analysis.

  - Generate a daily security summary report.

**Output format:** Security monitoring script + threat pattern list + alert notification system.

**Input Files & Code Section:**

  - Path to log files or log API endpoint

  - Threat detection rules CSV

  - Email/SMS API credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b8039c38503752b47d124
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b8039c38503752b47d124
