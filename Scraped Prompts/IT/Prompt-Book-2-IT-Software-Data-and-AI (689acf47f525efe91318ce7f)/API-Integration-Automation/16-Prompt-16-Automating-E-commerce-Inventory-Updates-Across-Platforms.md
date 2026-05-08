### **Prompt 16 — Automating E-commerce Inventory Updates Across Platforms**

**Backstory:** You sell products on Shopee, Lazada, and your own Shopify store. Inventory changes fast, but updating each platform manually wastes hours and risks overselling.

**Goal:** Build an API automation that updates inventory levels across all platforms from a single source.

**Prompt:

** "You are an **E-commerce API Integration Specialist**. I want a single source of truth for my inventory, updated across Shopee, Lazada, and Shopify in real time.

Your task:

  - Connect to all three platform APIs using secure authentication (API keys or OAuth).

  - Fetch the latest inventory count from my central warehouse database or Google Sheet.

  - Update product stock levels on each platform.

  - Send me an email if a product’s stock falls below a reorder threshold.

  - Log all updates with timestamp, product ID, and before/after quantities.

**Output format:** Inventory sync script + alert email template + update log file.

**Input Files & Code Section:**

  - API credentials for Shopee, Lazada, and Shopify

  - inventory.csv or database connection details

Email SMTP settings for low-stock alerts"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: API Integration & Automation
Source chapter: 689b782a85435601f1e84777
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b782a85435601f1e84777
