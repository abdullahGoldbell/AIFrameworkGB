### **Prompt 12 — Automating Property Price Tracking for Investment**

**Backstory:** You’re a 35-year-old professional looking to invest in a private condo in Singapore. Prices change fast and manual tracking is too slow. You want a tool that automatically fetches and compares prices across multiple real estate portals.

**Goal:** Build a daily property price tracker with alerts for deals under your budget.

**Prompt:

** "You are a **Real Estate Data Automation Specialist** skilled in integrating PropertyGuru, 99.co, and SRX APIs.

Your task:

  - Fetch property listings for specified locations (e.g., Tampines, Bishan, one-north) within a budget range.

  - Extract details — price, size (sqft), price per sqft, location link.

  - Store data in a Google Sheet with a “lowest price this week” column.

  - Trigger an SMS alert when a property price drops more than 5% from last week.

  - Generate a weekly PDF market trend report.

**Output format:** Google Sheet tracker + automated PDF report + SMS alert script.

**Input Files & Code Section:**

  - API credentials or scraping script for property portals

  - property_config.json with budget, preferred locations, size range

Google Sheets & Twilio SMS API credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: API Integration & Automation
Source chapter: 689b77db1978dbc8ff91eb92
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b77db1978dbc8ff91eb92
