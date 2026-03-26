# Thimar — Goal & Task Management for Muslims

> 🏆 Winner — Supabase Launch Week 14 Hackathon (Nouakchott, 2025)

Thimar is a productivity app built specifically for Muslims, combining goal setting, task management, and habit tracking with Islamic context — including prayer time awareness and faith-aligned goal recommendations powered by AI.

---

## Features

- **Goal Management** — Set and track short and long-term goals with progress tracking
- **Task Management** — Break goals into actionable tasks with priorities and deadlines
- **Habit Tracking** — Build consistent daily habits aligned with your goals
- **AI Recommendations** — Get intelligent, faith-aware goal suggestions powered by AI
- **Prayer Time Integration** — Schedule tasks and habits around daily prayer times
- **Real-Time Sync** — Seamless cross-device experience powered by Supabase

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Django REST Framework, Python |
| Database & Auth | Supabase (PostgreSQL) |
| Real-Time | Supabase Realtime |
| AI | Claude API |

---

## Project Structure

```
thimar/
├── frontend/       # React + TypeScript app
└── backend/        # Django REST API
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # add your Supabase keys
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # add your config
python manage.py migrate
python manage.py runserver
```

---

## Environment Variables

### Frontend `.env.local`

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend `.env`

```
SECRET_KEY=your_django_secret_key
DEBUG=True
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

---

## About

Thimar (ثمار) means "fruits" or "results" in Arabic — a name that reflects the app's purpose: turning intentions into outcomes.

Built in 10 days for the Supabase Launch Week 14 Hackathon and selected as a winner at the official community meetup in Nouakchott, Mauritania.
