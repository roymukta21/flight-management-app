# Flight Management App ✈️

A responsive Flight Management web application where passengers can search and book flights, select seats, and manage their bookings.

**Live Demo:** https://flight-management-app-phi.vercel.app

---

## Tech Stack

- **Frontend & API:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL + Realtime)
- **State Management:** Zustand with persist middleware
- **Styling:** Tailwind CSS

---

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/flight-management-app.git
cd flight-management-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Set up Supabase
- Create a new project at [supabase.com](https://supabase.com)
- Run the migration files in order from `/supabase/migrations/` in the Supabase SQL Editor:
  1. `20240101000000_initial_schema.sql` — creates all tables, RLS policies, RPC functions
  2. `20240101000001_seed.sql` — seeds 8 flights and seat maps

### 5. Run the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Test Account
| Field | Value |
|-------|-------|
| Email | test@flightapp.com |
| Password | Test@1234 |

---

## Supabase Project Config

- **Project URL:** https://prjsbocepvipetgvautd.supabase.co
- **Region:** ap-southeast-1 (Singapore)
- **RLS:** Enabled on all tables
- **Realtime:** Enabled on `seats` table for live seat map updates

---

## Zustand Store Structure

### `useFlightStore` (persisted)
Manages the active booking journey:

| State | Type | Persisted |
|-------|------|-----------|
| `searchQuery` | `{ origin, destination, date }` | ✅ Yes |
| `selectedFlightId` | `string \| null` | ✅ Yes |
| `selectedSeat` | `Seat \| null` | ✅ Yes |
| `bookingStep` | `number` | ✅ Yes |
| `passengerForm.fullName` | `string` | ✅ Yes |
| `passengerForm.nationality` | `string` | ✅ Yes |
| `passengerForm.passportNo` | `string` | ❌ **Excluded** (sensitive) |

`partialize` is used to exclude `passportNo` from localStorage — passport numbers are never persisted.

`resetBooking()` clears all booking state — called on cancellation.

### `useUserStore` (persisted)
Manages auth session and cached bookings:

| State | Type | Persisted |
|-------|------|-----------|
| `session.access_token` | `string` | ✅ Yes |
| `session.refresh_token` | `string` | ✅ Yes |
| `cachedBookings` | `Booking[]` | ❌ Excluded |

Only the session tokens are persisted — cached bookings are always re-fetched fresh.

`reset()` clears session and bookings on logout.

---

## Key Features

- **Flight Search** — filter by origin and destination
- **Interactive Seat Map** — color-coded by class (First / Business / Economy) with live Realtime updates via Supabase
- **Seat Locking** — `lock_seat` RPC prevents double-booking race conditions
- **Booking Confirmation** — generates unique PNR code
- **Booking Management** — view all bookings with status badges
- **Cancellation** — 2-hour rule enforced at DB level via trigger
- **Zustand Persistence** — in-progress bookings survive tab close; sensitive data excluded

---

## Trade-offs & What I'd Do Differently

- **Auth not fully implemented** — Supabase Auth is configured but login/signup UI is not complete. Given more time, I would add a proper auth flow with protected routes.
- **Reschedule UI** — the `reschedules` table and RPC are in place but the frontend reschedule flow is incomplete. I would add a modal to pick an alternative flight on the same route.
- **PWA** — would configure `next-pwa` with StaleWhileRevalidate for flight results and CacheFirst for static assets, and add an offline fallback page.
- **TypeScript** — some `any` types remain in the codebase that I would replace with proper types given more time.