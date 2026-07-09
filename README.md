# Dentistry

**Doctor's Professional Portfolio & Reputation Platform**

Behance-inspired platform where doctors showcase their professional identity, medical experience, achievements, certifications, portfolio, and build trust with patients.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion
- **State:** TanStack Query, React Hook Form, Zod
- **Backend:** Firebase (Auth, Firestore, Storage) — Phase 2
- **Architecture:** Clean Architecture, Feature-First, SOLID

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/              → Next.js App Router pages & layouts
features/         → Feature modules (auth, doctor, review, etc.)
shared/           → Reusable UI components & utilities
entities/         → Domain entities & types
widgets/          → Composite UI blocks (Navbar, Footer)
providers/        → React context providers
config/           → App configuration
constants/        → Design system & constants
lib/              → Shared utilities
firebase/         → Firebase setup
types/            → Global TypeScript types
```

## Development Roadmap

### Phase 1 — Foundation ✅
- [x] Next.js 15 + TypeScript + Tailwind setup
- [x] Design system (colors, typography, tokens)
- [x] Folder structure (Clean Architecture)
- [x] Landing page (Hero + Featured Doctors)
- [x] Navbar + Footer + Dark mode

### Phase 1.5 — Mock UI ✅
- [x] Centralized mock doctor data (9 doctors)
- [x] Reusable DoctorCard with hover portfolio preview
- [x] Discover page (search, filters, grid)
- [x] Doctor Profile page (Behance-style, tabs, before/after)
- [x] Pricing page (mock plans)

### Phase 2 — Authentication
- [ ] Firebase setup
- [ ] Email/Google login
- [ ] Role-based access (Patient, Doctor, Admin)
- [ ] Protected routes

### Phase 3 — Doctor Profiles
- [ ] Profile CRUD
- [ ] Portfolio cases
- [ ] Certificates & education timeline
- [ ] Public profile page

### Phase 4 — Discovery & Search
- [ ] Discover page (masonry grid)
- [ ] Advanced filters
- [ ] Doctor cards with hover preview

### Phase 5 — Reputation System
- [ ] Reviews & ratings
- [ ] Follow & bookmark
- [ ] Reputation score
- [ ] Verification flow

### Phase 6 — Dashboards
- [ ] Doctor dashboard (analytics)
- [ ] Admin panel (moderation)
- [ ] Subscription plans (mock payment)

## Design Philosophy

Premium, minimal, trustworthy — inspired by Apple, Behance, Linear, and Stripe.

- Primary: `#2563EB`
- Large whitespace, soft shadows, rounded corners (16–24px)
- Inter typography, 8px grid system
- Glassmorphism navbar, smooth Framer Motion animations
