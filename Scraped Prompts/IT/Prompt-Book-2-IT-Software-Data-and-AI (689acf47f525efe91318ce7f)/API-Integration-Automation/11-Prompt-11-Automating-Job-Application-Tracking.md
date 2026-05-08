### **Prompt 11 — Automating Job Application Tracking**

**Backstory:** You’re a 28-year-old marketing professional in Singapore applying to multiple companies at once. Keeping track of applications manually is messy — you often forget where you applied, the status, or the interview schedule. You want AI and APIs to track everything automatically.

**Goal:** Build an automation that pulls application data from job portals (LinkedIn, JobStreet) and updates it into a single Google Sheet dashboard daily.

**Prompt:

** "You are a **Job Search Workflow Automation Engineer**. I want an automated job application tracker that consolidates applications from LinkedIn Jobs and JobStreet Singapore using their APIs/webhooks.

Your task:

  - Authenticate with LinkedIn API and JobStreet’s developer API (or scrape data if no API exists).

  - Fetch job title, company name, date applied, status (applied, shortlisted, interview scheduled), and job link.

  - Push this data into a Google Sheet in structured columns.

  - Highlight rows where the application has been idle for >14 days.

  - Send me a daily email digest of new application updates.

**Output format:** Google Sheet dashboard + email digest example + API scripts.

**Input Files & Code Section:**

  - API credentials for LinkedIn and JobStreet

  - Google Sheet ID and credentials JSON

  - Email SMTP settings for sending daily digest"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: API Integration & Automation
Source chapter: 689b77c7dfab0b1ffb2a7a52
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b77c7dfab0b1ffb2a7a52
