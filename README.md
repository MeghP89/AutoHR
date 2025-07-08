# AutoHR – Automated HR Ticketing from Gmail using IBM Granite on Ollama

AutoHR is an intelligent HR assistant that reads incoming Gmail messages and automatically creates structured HR tickets. It uses the IBM Granite 3.2 8B Instruct model locally via [Ollama](https://ollama.com) to understand message content and generate relevant ticket information. Built with a Node.js + Express backend and a React frontend, AutoHR streamlines employee issue reporting without manual triage.

---

## 🚀 Features

- 🔁 Gmail Inbox Integration
- 🧠 AI-Powered Ticket Summarization using IBM Granite 3.2 8B (via Ollama)
- 📄 Ticket Management Dashboard
- 🗃️ MongoDB Database for Ticket Storage
- ✉️ Auto-scan Gmail messages and trigger AI parsing

---

## ⚙️ Prerequisites

Before setting up the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [Ollama](https://ollama.com) (for running the Granite model)
- A Google Cloud Project with Gmail API enabled

---

## 🧩 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/autohr.git
cd autohr
```
### 2. Setup the Backend
```bash
cd server
npm init -y
npm install
```

### 3. Setup the Frontend
```bash
cd client
npm install
```

### 4. Setup the server/config/.env
MONGO_URI=your_mongodb_connection_string
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=your_redirect_uri
REFRESH_TOKEN=your_google_refresh_token




