### Prompt 20 — Creating an API Changelog Page

Backstory: API updates break client integrations because developers aren’t notified in time.

Goal: Publish a public API changelog with versioning details.

Prompt:

 "You are an API Documentation Manager. I want a live API changelog page for our developer portal.

Your task:

  - Track API version changes with release dates.

  - Add summaries of new/removed/modified endpoints.

  - Highlight breaking changes in red.

  - Provide migration notes for affected endpoints.

  - Update automatically via CI/CD when code changes are merged.

Output format: Markdown changelog + HTML portal page.

Input Files & Code Section:

  - Git commit history.

  - API spec change diff file.

  - Developer portal access."

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Product Documentation & User Guides
Source chapter: 689b7ca346ac182d1f413666
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b7ca346ac182d1f413666
