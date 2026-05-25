# Job Application Tracker (MERN)

A full-stack MERN app for tracking job applications with a clean Kanban-style UI, drag & drop, and JWT auth.

## Stack

- **Frontend:** React + Vite + TailwindCSS + @dnd-kit + axios + react-router
- **Backend:** Node + Express + Mongoose
- **Auth:** JWT + bcryptjs

## Prerequisites

- Node.js 18+
- A running MongoDB instance — local at `mongodb://localhost:27017` by default
  - Install MongoDB Community Server, or run `mongod` in another terminal

## Run

```bash
# 1) Backend
cd backend
cp .env.example .env   # already created — adjust JWT_SECRET in prod
npm install
npm run dev            # http://localhost:5000

# 2) Frontend (in another terminal)
cd frontend
npm install
 npm run dev           # http://localhost:5173
```

Vite proxies `/api` to `http://localhost:5000`, so no CORS headaches in dev.

## API

| Method | Path               | Auth | Description         |
| ------ | ------------------ | ---- | ------------------- |
| POST   | /api/auth/register | No   | Create account      |
| POST   | /api/auth/login    | No   | Log in, returns JWT |
| GET    | /api/auth/profile  | Yes  | Current user        |
| GET    | /api/jobs          | Yes  | List jobs (owned)   |
| POST   | /api/jobs          | Yes  | Create job          |
| GET    | /api/jobs/:id      | Yes  | Get job by id       |
| PUT    | /api/jobs/:id      | Yes  | Update job          |
| DELETE | /api/jobs/:id      | Yes  | Delete job          |

## Project layout

```
backend/
  config/db.js
  controllers/{authController,jobController}.js
  middleware/{authMiddleware,errorMiddleware}.js
  models/{User,Job}.js
  routes/{authRoutes,jobRoutes}.js
  utils/generateToken.js
  server.js

frontend/
  src/
    components/{Sidebar,JobCard,KanbanColumn,JobModal,ProtectedRoute,Loader}.jsx
    pages/{Login,Signup,Dashboard,JobDetails}.jsx
    context/AuthContext.jsx
    services/{api,authService,jobService}.js
    App.jsx
    main.jsx
```
