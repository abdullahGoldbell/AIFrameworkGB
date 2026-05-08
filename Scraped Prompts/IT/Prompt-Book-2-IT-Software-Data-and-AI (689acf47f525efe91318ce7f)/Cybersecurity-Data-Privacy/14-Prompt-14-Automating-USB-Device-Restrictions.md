### **Prompt 14 — Automating USB Device Restrictions**

**Backstory:** An employee once copied sensitive data onto a personal USB drive without permission.

**Goal:** Automatically detect and block unapproved USB devices.

**Prompt:

** "You are an **Endpoint Device Control Automation Specialist**. I want a system that blocks all USB devices except approved company drives.

Your task:

  - Detect when a USB device is connected.

  - Compare its serial number against the approved list.

  - Block access if not approved.

  - Send an alert to the IT security team.

  - Log all USB connection attempts.

**Output format:** USB restriction script + approved device list + alert and log system.

**Input Files & Code Section:**

  - Approved USB device serial number list CSV

  - Endpoint monitoring API credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b81fa1978dbc8ff943270
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b81fa1978dbc8ff943270
