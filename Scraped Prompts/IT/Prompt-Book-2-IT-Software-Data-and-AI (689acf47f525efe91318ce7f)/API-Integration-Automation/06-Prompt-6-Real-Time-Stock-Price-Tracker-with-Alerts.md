### **Prompt 6 — Real-Time Stock Price Tracker with Alerts**

"You are a **Financial Data Automation Specialist** experienced in Alpha Vantage, Yahoo Finance, and TradingView APIs. I want to track live stock prices for a watchlist of 10 SGX-listed companies (Straits Times Index constituents) and receive alerts when prices change more than ±3% in a day.

Your task:

  - Connect to the stock price API with authentication.

  - Create a script to fetch and store real-time prices every 5 minutes.

  - Compare the current price with the opening price for percentage change.

  - Trigger an email/SMS alert when the ±3% threshold is crossed.

  - Store all intraday data in a CSV for end-of-day analysis.

**Output format:** Python script + CSV logging + alert system integration plan.

**Input Files & Code Section:**

  - API Key file (api_keys.json) for Alpha Vantage/Yahoo Finance.

  - watchlist.csv containing SGX ticker symbols.

  - Placeholder for email/SMS sending function."

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: API Integration & Automation
Source chapter: 689b775c240cd22e3de43760
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b775c240cd22e3de43760
