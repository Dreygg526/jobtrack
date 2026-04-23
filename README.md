# JobTrack — Job Application Tracker

A full-stack job application tracker built with Next.js, Supabase, and deployed on Vercel.

---

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, React
- **Backend:** Next.js API Routes, Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Vercel

---

## Project Structure

### FRONTEND (UI & Pages)
- `src/app/auth/page.tsx` — Login & Sign up page
- `src/app/dashboard/page.tsx` — Main dashboard page
- `src/app/dashboard/layout.tsx` — Dashboard layout with navbar
- `src/components/NavBar.tsx` — Top navigation bar
- `src/components/KanbanBoard.tsx` — Drag and drop kanban board
- `src/components/ApplicationCard.tsx` — Individual application card
- `src/components/AddApplicationModal.tsx` — Modal form to add applications
- `src/types/index.ts` — TypeScript types

### BACKEND (API & Database)
- `src/app/api/applications/route.ts` — GET and POST applications
- `src/app/api/applications/[id]/route.ts` — PATCH and DELETE application
- `src/lib/supabase/client.ts` — Supabase browser client
- `src/lib/supabase/server.ts` — Supabase server client
- `src/lib/supabase/session.ts` — Session management

---

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Create `.env.local` with your Supabase keys
4. Run `npm run dev`
5. Open `http://localhost:3000`