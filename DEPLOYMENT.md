# Production Deployment Guide: ExamPrep on Vercel

This repository is configured for modern, automated production deployment on [Vercel](https://vercel.com).

---

## 🌟 Architecture Overview

The ExamPrep platform consists of:
1. **Frontend (`client/`)**: High-performance React 19 SPA built with Vite, Tailwind CSS, Lucide icons, and modern dashboard views.
2. **Backend (`server/`)**: Express API with JWT authentication, MongoDB Atlas Mongoose integration, resilient in-memory fallback store, and full REST endpoints for subjects, study sessions, revision schedules, and analytics.

---

## 🚀 Deployment Options on Vercel

### Option A: Unified Full-Stack Deployment (Recommended — 1-Click)
Deploy the entire application (both frontend and backend) as a **single unified project** directly from the repository root:

- **Root Directory**: `.` (leave default)
- **Framework Preset**: Vite
- **Build Command**: `npm run build --workspace=client`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

**Why this is best:**
- Frontend and Backend run on the **exact same domain** (e.g. `https://your-exam-prep.vercel.app`).
- Zero CORS configuration required.
- `/api/*` requests route directly to the Vercel serverless function (`api/index.js`).
- Default `VITE_API_URL` resolves seamlessly to `/api`.

---

### Option B: Split Dual-Project Deployment

If you prefer two separate Vercel projects (e.g., `exam-prep-frontend` and `exam-prep-backend`):

#### 1. Backend Project (`exam-prep-backend`)
- **Root Directory**: `server`
- **Framework Preset**: Other
- **Build Command**: Leave empty (handled by `server/vercel.json`)
- **Output Directory**: Leave empty
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
  - `JWT_SECRET`: A secure random secret string
  - `JWT_EXPIRES_IN`: `7d`
  - `FRONTEND_URL`: URL of your deployed frontend (e.g., `https://exam-prep-frontend.vercel.app`)

#### 2. Frontend Project (`exam-prep-frontend`)
- **Root Directory**: `client`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Backend URL with `/api` path (e.g., `https://exam-prep-backend.vercel.app/api`)

---

## 🔐 Environment Variables Reference

| Variable | Scope | Purpose | Example |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | Backend | Cloud MongoDB Atlas database connection string | `mongodb+srv://user:pass@cluster0.mongodb.net/exam_prep?retryWrites=true&w=majority` |
| `JWT_SECRET` | Backend | Secret key for signing and verifying authentication tokens | `production_secure_jwt_token_secret_xyz123` |
| `JWT_EXPIRES_IN`| Backend | Token expiration duration | `7d` |
| `FRONTEND_URL` | Backend | Permitted frontend origins for CORS (comma-separated if multiple) | `https://exam-prep.vercel.app` |
| `VITE_API_URL` | Frontend | Backend API base endpoint (leave blank for same-origin unified deployment) | `https://exam-prep-backend.vercel.app/api` |

> [!NOTE]
> If `MONGODB_URI` is omitted or temporarily unavailable, the backend automatically activates a resilient in-memory fallback store seeded with sample subjects, topics, and study sessions so you can explore immediately without downtime.

---

## 🛠️ CLI Deployment via Vercel Token

If deploying from the command line:

```bash
# 1. Unified Root Deployment
npx vercel --prod --token <YOUR_VERCEL_TOKEN> --scope taruna-sravanthis-projects

# 2. Or Frontend Only
cd client
npx vercel --prod --token <YOUR_VERCEL_TOKEN> --scope taruna-sravanthis-projects

# 3. Or Backend Only
cd ../server
npx vercel --prod --token <YOUR_VERCEL_TOKEN> --scope taruna-sravanthis-projects
```
