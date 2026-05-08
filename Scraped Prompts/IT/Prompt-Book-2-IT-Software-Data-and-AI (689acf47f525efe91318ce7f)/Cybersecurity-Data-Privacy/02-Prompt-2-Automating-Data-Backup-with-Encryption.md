### **Prompt 2 — Automating Data Backup with Encryption**

**Backstory:** You manage sensitive medical records for a clinic. If your system crashes or is hacked, you can’t risk losing unencrypted patient data.

**Goal:** Automate daily backups to cloud storage with strong encryption.

**Prompt:

** "You are a **Data Security Engineer**. I want an automated backup system that encrypts files before uploading them to cloud storage (AWS S3, Google Drive).

Your task:

  - Identify sensitive folders for backup.

  - Compress and encrypt files using AES-256 encryption.

  - Upload encrypted backups to cloud storage via API.

  - Store encryption keys securely in a password vault.

  - Maintain a backup log with timestamps and checksum hashes.

**Output format:** Encrypted backup script + cloud upload integration + key storage instructions.

**Input Files & Code Section:**

  - Encryption key file (secure vault reference)

  - Cloud API credentials

  - List of file/folder paths for backup"

---
Source course: Prompt Book 2: IT, Software, Data and AI
Source module: Cybersecurity & Data Privacy
Source chapter: 689b80a7138568d5eea314cd
Source URL: https://community.aifiesta.ai/web/courses/689acf47f525efe91318ce7f?chapter=689b80a7138568d5eea314cd
