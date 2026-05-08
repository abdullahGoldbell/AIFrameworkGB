### **Prompt 18 — Automating Daily Stock Market Newsletter**

**Backstory:** You run a Telegram channel for stock market updates. Manually collecting news, stock prices, and analysis every morning is slow.

**Goal:** Generate and send a daily market summary via email and Telegram using APIs.

**Prompt:

** "You are a **Financial Automation Developer**. I want a daily 7:30 AM SGT newsletter combining stock prices, market news, and a short AI-generated analysis.

Your task:

  - Connect to Yahoo Finance API for the Straits Times Index (STI), SGX top 10 stocks, and key regional benchmarks data.

  - Pull top 5 market news headlines from News API.

  - Use GPT API to generate a 150-word market analysis.

  - Send the report via Gmail API and post to a Telegram channel via Telegram Bot API.

  - Store all reports in a Google Drive folder for archiving.

**Output format:** Automated newsletter script + Telegram bot setup + daily report template.

**Input Files & Code Section:**

  - Yahoo Finance API key

  - News API key

  - OpenAI GPT API key

Gmail API and Telegram Bot credentials"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: API Integration & Automation
Source chapter: 689b78561978dbc8ff920618
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b78561978dbc8ff920618
