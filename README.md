<div align="center">

# 🚀 HirePilot AI

### AI-Powered Recruitment Platform for Modern Hiring

An end-to-end recruitment platform that leverages Artificial Intelligence to streamline hiring workflows, improve candidate-job matching, automate resume screening, and simplify recruiter operations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-blue)
![Status](https://img.shields.io/badge/status-Production-success)

**🌐 Live Demo:** https://hirepilot-ai-ten.vercel.app

</div>

---

# 📌 Overview

HirePilot AI is a full-stack AI-powered recruitment platform that helps recruiters identify top talent while enabling candidates to optimize resumes, receive AI-driven job recommendations, and track applications throughout the hiring lifecycle.

The platform provides complete recruitment management including authentication, company management, job posting, resume parsing, AI-powered ATS analysis, candidate profiling, interview scheduling, notifications, and intelligent job matching.

---

# ✨ Features

## 👤 Authentication

- Secure JWT Authentication
- Refresh Token Rotation
- Role Based Authorization
- Recruiter & Candidate Accounts
- Password Reset
- Email Verification Ready

---

## 👨‍💼 Candidate Portal

- Dashboard
- Resume Upload
- AI Resume Analysis
- ATS Score
- Candidate Profile
- Job Matching
- Job Applications
- Interview Tracking
- Notifications

---

## 🏢 Recruiter Portal

- Recruiter Dashboard
- Company Management
- Job Posting
- Applicant Tracking
- Resume Preview
- AI Candidate Screening
- Interview Scheduling
- Hiring Pipeline
- Analytics Dashboard

---

## 🤖 AI Features

- Resume Parsing
- ATS Resume Analysis
- AI Resume Summary
- Resume Skills Extraction
- Missing Skills Detection
- Job Matching Score
- Cover Letter Generation
- Candidate Recommendation

---

# 🏗 Architecture

```
Candidate
        │
        ▼
React Frontend (Vite)
        │
 Axios + JWT + Socket.io
        │
        ▼
Node.js + Express API
        │
 ├── Authentication
 ├── Candidate Module
 ├── Recruiter Module
 ├── Company Module
 ├── Resume Module
 ├── Job Module
 ├── AI Services
 ├── Notifications
 └── Dashboard
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL (Neon)
        │
        ├── Cloudinary
        └── Gemini AI
```
<img width="2752" height="1536" alt="Gemini_Generated_Image_ybjaz8ybjaz8ybja" src="https://github.com/user-attachments/assets/5f54c8d5-434c-4f15-9afb-cb4e7f3df205" />

---

# User Flow
<img width="2816" height="1536" alt="Gemini_Generated_Image_h7qt10h7qt10h7qt" src="https://github.com/user-attachments/assets/cad7a61b-2947-4352-b67c-7a3683355c7b" />

---
# 🧠 Tech Stack

## Frontend

- React 19
- Vite
- React Router
- React Hook Form
- Zod
- Axios
- Tailwind CSS
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Bcrypt
- Socket.io
- Multer
- Cloudinary

---

## AI

- Google Gemini API
- PDF Parsing
- Resume Analysis
- Job Matching
- ATS Optimization

---

## Database

- PostgreSQL
- Prisma ORM
- Neon Database

---

## Cloud

- Cloudinary
- Render
- Vercel

---

# 📂 Project Structure

```
HirePilot-AI
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── providers
│   ├── api
│   └── routes
│
├── server
│   ├── src
│   │   ├── modules
│   │   ├── middleware
│   │   ├── routes
│   │   ├── utils
│   │   └── config
│   │
│   ├── prisma
│   └── uploads
│
└── README.md
```

---

# ⚙ Installation

Clone repository

```bash
git clone https://github.com/AdityaBhosale22/HirePilot-AI.git
```

```
cd HirePilot-AI
```

---

## Backend

```
cd server
npm install
```

Create

```
.env
```

```
DATABASE_URL=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

CLIENT_ORIGIN=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Run

```
npm run dev
```

---

## Frontend

```
cd client
npm install
```

Create

```
.env
```

```
VITE_API_BASE_URL=http://localhost:5000/api/v1

VITE_SOCKET_URL=http://localhost:5000
```

Run

```
npm run dev
```

---

# 🚀 Deployment

Frontend

- Vercel

Backend

- Render

Database

- Neon PostgreSQL

File Storage

- Cloudinary

---

# 🔒 Security

- JWT Authentication
- Refresh Token Rotation
- Password Hashing (bcrypt)
- Protected Routes
- Role Based Access Control
- Zod Request Validation
- Prisma ORM
- Secure Cookies

---

# 📈 Future Enhancements

- OAuth Login
- AI Interview Assistant
- Video Interview Integration
- Email Service
- Resume Versioning
- Candidate Ranking
- AI Chat Assistant
- Calendar Integration
- Multi-company Support

---

# ⭐ Support

If you found this project useful,

⭐ Star the repository

🍴 Fork it

🤝 Contribute

---
