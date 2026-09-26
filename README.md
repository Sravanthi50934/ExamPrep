# 🎓 ExamPrep — High-Performance Exam Preparation & Revision Tracker

A modern, full-stack web application designed for students and test takers preparing for competitive exams, university finals, and certifications. Built with **React.js**, **Tailwind CSS v3**, **Express.js**, **JWT authentication**, and **MongoDB Atlas**.

---

## 🌟 Key Features

1. **Target Exam Countdown & Readiness Gauge**:
   - Live visual countdown clock (Days, Hours, Minutes, Seconds) until your target exam.
   - Composite **Exam Readiness Index** (0–100%) calculated dynamically from:
     - Syllabus completion percentage (45% weight)
     - Mock test accuracy average (40% weight)
     - Daily study consistency streak (15% weight)

2. **Hierarchical Syllabus Tracker**:
   - Organize exam preparation by **Subject Modules** and **Topics**.
   - Topic status workflow: `Not Started` ➔ `In Progress` ➔ `Completed` ➔ `Needs Revision`.
   - Difficulty rating (`Easy`, `Medium`, `Hard`) and estimated vs. logged study hours.
   - Interactive formula cheat sheets and core concept study notes per topic.
   - Micro-interaction celebration with **confetti** upon completing topics!

3. **Spaced Repetition Engine (Active Recall)**:
   - Implements Ebbinghaus forgetting curve scheduling:
     - 1st revision: 3 days after completion
     - 2nd revision: 7 days
     - 3rd revision: 14 days
     - 4th revision: 30 days
   - Interactive review queue showing topics due today.
   - 3D flip **Flashcards modal** for rapid formula & key concept recall.

4. **Deep Work Pomodoro Study Timer**:
   - Built-in study timer with **Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)** modes.
   - Automated audio chime on timer completion using browser **Web Audio API** (no external audio files required).
   - Tag study blocks with subject, topic, focus rating (1–5 stars), and session takeaways.
   - Auto-logs time directly against topic hours and personal study history.

5. **Mock Test & Accuracy Progression Tracker**:
   - Log mock test attempts with total marks, score, time taken, and test date.
   - Automated accuracy percentage calculation and visual trajectory graph.
   - Identifies **Weak Topics / Questions Missed** and surfaces them on the dashboard.

6. **JWT Authentication & Profile Customization**:
   - Secure token-based registration and login with bcrypt password hashing.
   - Personalized exam milestone configuration: Target Exam Name, Target Exam Date, Daily Study Goal Hours, Target Score.
   - 1-Click Demo Login (`alex@example.com` / `password123`) pre-seeded with sample subjects and tests.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast, modular component architecture |
| **Styling** | Tailwind CSS v3 | Custom glassmorphism, responsive dark theme, and micro-animations |
| **Icons & Effects** | Lucide React + Canvas Confetti | Modern UI icons and celebration micro-animations |
| **Backend** | Express.js (Node.js) | RESTful API architecture with modular routers and controllers |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs | Secure stateless auth with Bearer tokens and password hashing |
| **Database** | MongoDB Atlas / Mongoose | Production-grade cloud schema with automatic offline fallback |

---

## 🚀 Getting Started

### 1. Backend Setup (`server`)
```bash
cd server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

#### Configure MongoDB Atlas:
Edit `server/.env` with your MongoDB Atlas cluster connection string:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/exam_prep_tracker?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```
*(Note: If no Atlas URI is provided, the backend seamlessly operates with a resilient in-memory local fallback store so you can test all features immediately without interruption!)*

### 2. Frontend Setup (`client`)
```bash
cd client
npm install
npm run dev
```
The client will run on `http://127.0.0.1:5173`.

---

## 🔑 Demo Account Credentials
For quick exploration, click the **"1-Click Fill Demo Credentials"** button on the Login page or use:
- **Email:** `alex@example.com`
- **Password:** `password123`

---

## 📂 Project Structure
```text
ExamPrep/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Atlas connection & resilient fallback
│   │   ├── controllers/
│   │   │   ├── authController.js     # JWT register, login, profile
│   │   │   ├── subjectController.js  # Subjects, topics, spaced repetition
│   │   │   ├── sessionController.js  # Pomodoro study logs
│   │   │   ├── mockTestController.js # Mock test scores and weak areas
│   │   │   └── analyticsController.js# Readiness index & dashboard metrics
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT bearer token verification
│   │   ├── models/
│   │   │   ├── User.js               # User schema & targets
│   │   │   ├── Subject.js            # Subject & embedded topic schema
│   │   │   ├── StudySession.js       # Study session logs
│   │   │   └── MockTest.js           # Mock test scores & notes
│   │   ├── routes/                   # Express API route handlers
│   │   └── server.js                 # Express app entrypoint
│   ├── .env.example
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx            # Header, streak, DB status, quick timer
    │   │   ├── Sidebar.jsx           # Tab navigation
    │   │   ├── StatCard.jsx          # Reusable metric card with progress
    │   │   ├── CountdownTimer.jsx    # Target exam countdown banner
    │   │   ├── PomodoroModal.jsx     # Focus timer with Web Audio chime
    │   │   ├── SubjectModal.jsx      # Add/edit subject with colors
    │   │   ├── TopicModal.jsx        # Add/edit topic with formulas
    │   │   ├── MockTestModal.jsx     # Log mock test result
    │   │   └── FlashcardModal.jsx    # 3D interactive flashcard review
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global JWT session state
    │   ├── pages/
    │   │   ├── Login.jsx             # Sign in with demo prefill
    │   │   ├── Register.jsx          # Sign up with exam milestone goals
    │   │   ├── Dashboard.jsx         # Mission control & overview
    │   │   ├── SyllabusTracker.jsx   # Syllabus breakdown & topics
    │   │   ├── RevisionQueue.jsx     # Spaced repetition engine
    │   │   ├── StudySessionsPage.jsx # Pomodoro & study logs history
    │   │   ├── MockTestTracker.jsx   # Test score progression graph
    │   │   ├── Analytics.jsx         # Readiness & status distribution
    │   │   └── Settings.jsx          # Exam targets & DB connection guide
    │   ├── services/
    │   │   └── api.js                # Unified REST API client
    │   ├── App.jsx                   # Main application layout
    │   ├── index.css                 # Tailwind directives & glassmorphism
    │   └── main.jsx
    ├── tailwind.config.js            # Tailwind v3 theme configuration
    └── package.json
```
