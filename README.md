# ViralBoost AI

Full-stack MERN scaffold for a creator-brand SaaS platform with role-based dashboards, AI content generation, campaigns, wallet flows, subscriptions, chat, scheduling, and admin tooling.

## Structure

- `backend/` Express + MongoDB API on port `8080`
- `frontend/` React + Vite app on port `3001`

## Setup

1. Copy `backend/.env.example` to `backend/.env` and fill in your real credentials.
2. Copy `frontend/.env.example` to `frontend/.env` and set the API and Razorpay public key.
3. Start the backend:

```bash
cd backend
npm install
npm run dev
```

4. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

## Demo Accounts

Seed a full demo dataset for recruiter/brand, creator, admin, and one extra creator applicant:

```bash
cd backend
npm run seed:demo
```

Demo credentials after seeding:

- Recruiter/Brand: `demo.recruiter@viralboost.local` / `Demo@12345`
- Creator: `demo.creator@viralboost.local` / `Demo@12345`
- Admin: `demo.admin@viralboost.local` / `Demo@12345`
- Extra creator applicant: `demo.applicant@viralboost.local` / `Demo@12345`

## Notes

- The frontend uses lazy-loaded routes to keep the initial bundle smaller.
- Razorpay is initialized lazily on the backend so missing env vars do not crash module import.
- AI generation expects a Hugging Face text generation model that returns JSON-like output.
