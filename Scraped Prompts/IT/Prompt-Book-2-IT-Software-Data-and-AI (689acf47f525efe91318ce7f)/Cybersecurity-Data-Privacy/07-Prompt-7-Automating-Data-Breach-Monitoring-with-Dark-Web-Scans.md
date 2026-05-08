### **Prompt 7 — Automating Data Breach Monitoring with Dark Web Scans**

**Backstory:** A client’s credentials were leaked on the dark web, and you only found out weeks later. You want to monitor this proactively.

**Goal:** Create an automation that scans the dark web for stolen company credentials.

**Prompt:

** "You are a **Threat Intelligence Automation Engineer**. I want to integrate HaveIBeenPwned API and a dark web monitoring API to scan for leaked email/password combinations.

Your task:

  - Fetch employee email list from HR database.

  - Query APIs for data breaches linked to these emails.

  - Flag and notify affected employees to reset passwords.

  - The store results in an encrypted database.

  - Send a monthly summary to the security team.

**Output format:** Breach monitoring script + notification template + encrypted breach database.

**Input Files & Code Section:**

  - API keys for HaveIBeenPwned and dark web monitoring tool

  - Employee email list CSV

Email SMTP settings for alerts"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b810985435601f1ea30a2
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b810985435601f1ea30a2
