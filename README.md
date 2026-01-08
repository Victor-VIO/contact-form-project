# AI-Powered Contact Form System

An intelligent contact form that uses AI (Groq) to automatically generate personalized email responses.

## 🌟 Features

- Modern, responsive contact form
- AI-powered automatic responses using Groq LLM
- Email notifications via SMTP
- Data storage in Google Sheets
- Workflow automation with n8n

## 🛠️ Tech Stack

**Frontend:**

- HTML5
- CSS3
- Vanilla JavaScript

**Backend:**

- Node.js
- Express.js
- Axios for HTTP requests

**Automation & AI:**

- n8n (workflow automation)
- Groq API (LLama 3.3 70B model)
- Gmail SMTP
- Google Sheets API

## 📋 Prerequisites

- Node.js (v16+)
- n8n instance (self-hosted or cloud)
- Groq API key
- Gmail account with App Password
- Google Sheets

## 🚀 Installation

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/yourusername/contact-form-project.git
cd contact-form-project
\`\`\`

### 2. Install backend dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Configure environment variables

\`\`\`bash
cp .env.example .env

# Edit .env with your actual values

\`\`\`

### 4. Start the backend server

\`\`\`bash
npm start
\`\`\`

### 5. Open frontend

Open \`frontend/index.html\` in your browser

## 🔧 Configuration

### Backend (.env)

\`\`\`
N8N_WEBHOOK_URL=your_n8n_webhook_url
PORT=3000
\`\`\`

### n8n Workflow

Import the workflow from \`n8n-workflow.json\` (if provided)

## 📸 Screenshots

[Add screenshots of your form, n8n workflow, etc.]

## 🎯 How It Works

1. User submits contact form
2. Frontend sends data to Express backend
3. Backend validates and forwards to n8n webhook
4. n8n workflow:
   - Calls Groq API for AI response
   - Sends personalized email
   - Saves to Google Sheets
5. User receives automated reply

## 📝 License

MIT License

## 👤 Author

Victor - [Your Portfolio/LinkedIn]

## 🙏 Acknowledgments

- Anthropic Claude for development assistance
- Groq for fast AI inference
- n8n community
  \`\`\`

---
