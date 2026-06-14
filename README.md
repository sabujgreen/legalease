# LegalEase 2.0 ⚖️

LegalEase is an AI-powered legal assistance platform that bridges the gap between citizens and legal professionals. It allows users to submit legal problems, uses AI to categorize and analyze them, and intelligently matches them with the most suitable lawyers.

## 🚀 Key Features

### 🔐 Authentication & Security
- **Secure Auth**: JWT-based authentication with HTTP-only cookies.
- **Role-Based Access**: Distinct portals for Users, Lawyers, and Admins.
- **Email Verification**: OTP-based email verification using Nodemailer.

### 🧑‍⚖️ Lawyer Management
- **Onboarding Workflow**: Lawyers can register and submit credentials.
- **Admin Approval**: Admins review and approve/reject lawyer applications.
- **Profile Management**: Lawyers can manage their specialization, experience, and availability.

### 📂 Smart Case Management
- **Case Submission**: Users can submit detailed legal queries.
- **Status Tracking**: Track cases from `NEW` → `AI_PROCESSED` → `ASSIGNED` → `ACCEPTED` → `CLOSED`.
- **Dashboard**: Dedicated dashboards for users to track cases and lawyers to manage requests.

### 🧠 AI & Intelligent Matching
- **AI Analysis**: Uses **Groq AI** to analyze case descriptions, identify legal categories, urgency, and relevant laws.
- **Smart Matching**: Deterministic algorithm matches cases to lawyers based on:
  - Specialization
  - Location
  - Experience
  - Availability
- **No Bias**: AI is used for analysis, but the matching logic is transparent and rule-based.

### 📸 Profile & File Handing
- **Cloudinary Integration**: Secure storage for profile pictures and document uploads.
- **Profile Customization**: Users and lawyers can update their profile pictures.

---

## 🧱 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & Bcrypt
- **AI Engine**: Groq SDK
- **Storage**: Cloudinary
- **Email**: Nodemailer

---

## ⚙️ Environment Setup

### 1. Backend Setup
Create a `.env` file in the `Backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AI Configuration
GROQ_API_KEY=your_groq_api_key

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 2. Frontend Setup
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Notes: `VITE_API_URL` defaults to `http://localhost:5000/api` if not set, but recommended for deployment)*

---

## ▶️ Running Locally

### Start Backend
```bash
cd Backend
npm install
npm run dev
```
*Server runs on: http://localhost:5000*

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: http://localhost:5173*

---

## 🚀 Deployment Guide

### Backend (Render / Railway)
1.  Push code to GitHub.
2.  Create a new Web Service on **Render** or **Railway**.
3.  Set **Root Directory** to `Backend`.
4.  Set **Build Command**: `npm install`
5.  Set **Start Command**: `npm start` (ensure `start` script exists in `package.json`, typically `node src/server.js`)
6.  Add all **Environment Variables** from the Backend setup section.

### Frontend (Vercel / Netlify)
1.  Push code to GitHub.
2.  Import project into **Vercel** or **Netlify**.
3.  Set **Root Directory** to `frontend`.
4.  Set **Build Command**: `npm run build`
5.  Set **Output Directory**: `dist`
6.  Add Environment Variable:
    -   `VITE_API_URL`: Your deployed backend URL (e.g., `https://legalease-backend.onrender.com/api`)

---

## 🧪 API Documentation

### Auth
- `POST /api/auth/register` - Register new user/lawyer
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Cases
- `POST /api/cases` - Submit a new case
- `GET /api/cases/my-cases` - Get user's cases
- `POST /api/cases/:id/analyze` - Trigger AI analysis

### User
- `POST /api/user/profile/photo` - Upload profile picture

---

## 👨‍💻 Author
**Sabuj Das**

---
*Built with ❤️ for a fairer legal system.*
