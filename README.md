# LegalEase Backend ⚖️

LegalEase is an AI-powered legal assistance backend that helps users submit legal problems, intelligently matches them with suitable lawyers, and manages the complete case lifecycle.

This repository contains the backend service for LegalEase, built with a clean, scalable, and production-ready architecture.

---

## 🚀 Key Features

### 🔐 Authentication & Roles
- User registration with OTP verification
- Secure login using JWT
- Role-based access control:
  - USER
  - LAWYER
  - ADMIN

---

### 🧑‍⚖️ Lawyer Onboarding
- Users can apply to become lawyers
- Admin approval workflow
- Lawyer profile management
- Lawyers are only active after admin approval

---

### 📂 Case Management
- Users can submit legal cases
- Each case has a unique case ID
- Case lifecycle tracking:
  NEW → AI_PROCESSING → AI_PROCESSED → ASSIGNED → ACCEPTED → CLOSED

---

### 🧠 AI Case Analysis
- AI-powered legal case classification using Groq
- Extracts:
  - Case type
  - Sub-category
  - Urgency
  - Suggested legal specializations
  - Location importance
  - Confidence score
- AI is used only for analysis, not decision-making

---

### 🤝 Intelligent Lawyer Matching
- Deterministic backend matching (no AI bias)
- Lawyers ranked based on:
  - Specialization match
  - Location relevance
  - Experience
  - Availability
  - Case urgency
- Top 5 best-matched lawyers suggested per case

---

### 📸 Profile Photo Upload
- Users (and lawyers) can upload profile photos
- Images stored securely on Cloudinary
- Only image URLs are stored in the database
- Same profile photo is used across user & lawyer views

---

### 🛡️ Security & Best Practices
- Environment-based configuration
- Secrets never committed to Git
- Modular folder structure
- Clean separation of concerns
- Future-ready architecture

---

## 🧱 Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Groq AI
- Cloudinary
- Multer

---

## 📁 Project Structure

src/
├── config/
├── middlewares/
├── models/
├── modules/
│   ├── auth
│   ├── user
│   ├── lawyer
│   ├── admin
│   └── case
├── services/
│   ├── ai
│   └── matching
├── app.js
└── server.js

---

## ⚙️ Environment Setup

Create a .env file in the project root.

### 🔑 Environment Variables

PORT=4000  
NODE_ENV=development  

MONGO_URI=your_mongodb_connection_string  

JWT_SECRET=your_jwt_secret  
JWT_EXPIRES_IN=7d  

GROQ_API_KEY=your_groq_api_key  

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name  
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret  

⚠️ Never commit the .env file to GitHub.

---

## ▶️ Running the Project Locally

npm install  
npm run dev  

Server runs at:  
http://localhost:4000  

Health check:  
GET /health

---

## 🧪 Important APIs

Upload profile photo  
POST /api/user/profile/photo  

Analyze case (AI + matching)  
POST /api/cases/:caseId/analyze  

Assign lawyer  
POST /api/cases/:caseId/assign  

Lawyer dashboard  
GET /api/lawyer/cases  

---

## 📈 Future Enhancements
- Document uploads (Bar certificate, ID proof)
- In-app notifications
- Lawyer ratings & reviews
- User–lawyer chat
- Frontend integration
- Production deployment

---

## 👨‍💻 Author
Chirag Jain

---

## 📜 License
This project is for educational and demonstration purposes.
