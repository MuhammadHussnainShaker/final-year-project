# Event Discovery & Community Engagement Platform — Prototype Specification

**Project:** CS619 Final Year Project  
**Assignment:** Prototype (Deadline: Wed Aug 26, 2026)  
**Group ID:** S26PROJECTC0D01  
**Supervisor:** Amjad Iqbal Khan  

---

## 1. Overview

Build a frontend prototype of the Event Discovery & Community Engagement Platform using **Next.js** (frontend) + **Strapi v5** (CMS/backend) with **NextAuth.js** + **JWT** authentication. The prototype focuses on UI, navigation, responsive design, and a basic auth flow (register → login → logout). No advanced features like RSVP, map, or admin dashboard are required for this assignment — those belong to the final deliverable.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Backend / CMS | Strapi v5 (Headless CMS) |
| Authentication | NextAuth.js v5 + Strapi JWT |
| Database | SQLite (Strapi default for dev) |
| Package Manager | npm |
| Deployment (dev) | Local development only |

### Why this stack?
- shadcn/ui is the fastest path to a polished, modern UI with minimal custom CSS
- Strapi v5 provides a ready-made admin panel for managing events and categories
- NextAuth.js handles the JWT-based auth flow cleanly with Strapi
- SQLite requires zero setup for the prototype

---

## 3. Project Structure (Monorepo)

```
event-discovery-platform/
├── frontend/                  # Next.js app
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout (navbar, footer)
│   │   ├── page.tsx           # Landing / Home page
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── register/
│   │   │   └── page.tsx       # Register page
│   │   ├── events/
│   │   │   ├── page.tsx       # Events listing page
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Event detail page
│   │   ├── categories/
│   │   │   └── page.tsx       # Categories page
│   │   └── dashboard/
│   │       └── page.tsx       # User dashboard
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── layout/            # Navbar, Footer, etc.
│   │   ├── events/            # EventCard, EventGrid, etc.
│   │   └── auth/              # Auth-related components
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # NextAuth config
│   │   ├── strapi.ts          # Strapi API helpers
│   │   └── utils.ts           # General utilities
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   ├── public/                # Static assets
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── backend/                   # Strapi v5 project
│   ├── src/
│   │   ├── api/
│   │   │   ├── event/         # Event content type
│   │   │   ├── category/      # Category content type
│   │   │   └── ...
│   │   └── ...
│   ├── config/
│   ├── database/              # SQLite db files
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 4. Pages (7 Required)

### 4.1 Landing / Home Page (`/`)
- **Hero section:** Large banner with headline ("Discover Events Near You"), subtitle, and CTA button ("Browse Events")
- **Featured Events section:** Horizontal scrollable row or card grid (2–4 featured events). Each card shows: event image, title, category badge, date, short description, "View Details" link
- **Categories preview:** Grid of 6 category cards with icons (Music, Sports, Technology, Art & Culture, Food & Drink, Community). Each links to the Categories page
- **How It Works section:** 3-step explainer (Browse → RSVP → Attend)
- **Footer:** Links, copyright, social icons

### 4.2 Login Page (`/login`)
- Centered card with email + password fields
- "Login" button
- "Don't have an account? Register" link
- Error message display (invalid credentials)
- Success: redirects to dashboard or homepage

### 4.3 Register Page (`/register`)
- Centered card with: Name, Email, Password, Confirm Password fields
- "Register" button
- "Already have an account? Login" link
- Client-side validation: email format, password match, required fields
- Error message display (duplicate email, validation errors)
- Success: auto-login and redirect to dashboard

### 4.4 Events Listing Page (`/events`)
- **Search bar** at the top (text input with search icon)
- **Category filter chips/buttons** (All, Music, Sports, Technology, Art & Culture, Food & Drink, Community) — clickable to toggle filter
- **Event grid:** Responsive card grid (3 cols desktop, 2 cols tablet, 1 col mobile)
- Each **EventCard** shows:
  - Event image (placeholder)
  - Category badge (colored)
  - Event title
  - Date and time
  - Venue/city
  - Short description (truncated)
  - "View Details" link
- Search and filtering are **client-side** (fetch all events once, filter in browser)
- "No events found" message when filters return empty results
- Optional: "Clear Filters" button

### 4.5 Event Detail Page (`/events/[id]`)
- Breadcrumb navigation: Home > Events > [Event Name]
- Hero image (full-width)
- Event title, category badge, date/time
- Full description
- Venue/address with "Get Directions" link (opens Google Maps)
- Organizer contact info
- Ticket info (price or "Free")
- Image gallery (if multiple images — placeholder for now)
- Related events section (optional, show 3 events from same category)

### 4.6 Categories Page (`/categories`)
- Grid of category cards (6 categories)
- Each card: category icon, name, event count, "Browse Events" link
- Clicking a category filters the Events Listing page

### 4.7 User Dashboard (`/dashboard`)
- **Single scrollable page** (no tabs) with sections:
- **Welcome section:** User name, email, profile avatar placeholder
- **My RSVPs section:** List of RSVP'd events (placeholder/empty state for prototype)
- **Saved Events section:** List of bookmarked events (placeholder/empty state for prototype)
- **Submitted Events section:** Events the user submitted (placeholder/empty state for prototype)
- **Profile Settings section:** Update name, change password form
- **Logout button**
- Redirect to login if not authenticated

---

## 5. Authentication Flow

### Registration
1. User fills name, email, password, confirm password
2. Frontend validates (email format, password match, required fields)
3. POST to Strapi `/api/auth/local/register` with `{ username, email, password }`
4. On success: store JWT in httpOnly cookie via NextAuth, redirect to dashboard
5. On failure: display Strapi error message (e.g., "Email already taken")

### Login
1. User enters email + password
2. POST to Strapi `/api/auth/local` with `{ identifier, password }`
3. Receive JWT + user data
4. Create NextAuth session with JWT, store in httpOnly cookie
5. Redirect to dashboard
6. On failure: "Invalid email or password"

### Logout
1. User clicks logout in profile dropdown
2. NextAuth signOut() clears session
3. Redirect to homepage

### Session Management
- JWT stored via NextAuth.js in httpOnly cookies
- Session includes: user id, name, email, jwt token
- Protected routes: `/dashboard` — redirect to `/login` if no session
- API calls to Strapi include `Authorization: Bearer <jwt>` header

---

## 6. Strapi Backend Setup

### Content Types

#### Event
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | Text | Yes | Event name |
| description | Rich Text | Yes | Full event description |
| shortDescription | Text | Yes | Truncated summary for cards |
| date | Date | Yes | Event date |
| time | Text | Yes | Event time (e.g., "2:00 PM - 5:00 PM") |
| venue | Text | No | Venue name |
| city | Text | No | City name |
| address | Text | No | Full address |
| imageUrl | Text | Yes | Placeholder image URL |
| ticketPrice | Text | No | Price or "Free" |
| organizerContact | Text | No | Email or phone |
| category | Relation (many-to-one) | Yes | Link to Category |
| isFeatured | Boolean | No | Default: false |

#### Category
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | Text | Yes | Unique category name |
| slug | Text | Yes | URL-friendly slug |
| icon | Text | No | Icon identifier or emoji |
| description | Text | No | Short category description |

### Permissions
- **Public role:** Read-only access to events (status: published) and categories
- **Authenticated role:** Same as public + ability to create events (for future use)
- **Admin:** Full CRUD via Strapi admin panel

### Seed Data
Create a seed script (`backend/src/index.ts` or manual Strapi bootstrap) that populates:
- **6 categories:** Music, Sports, Technology, Art & Culture, Food & Drink, Community
- **10–15 sample events** across categories with:
  - Realistic titles ("Summer Music Festival", "React Workshop 2026", "Community Clean-Up Drive", etc.)
  - Placeholder images from Unsplash (e.g., `https://images.unsplash.com/photo-...?w=800`)
  - Various dates (mix of upcoming and past)
  - Pakistani cities (Lahore, Islamabad, Karachi, etc.) for realism
  - 2–3 events marked as `isFeatured: true`

---

## 7. Design Guidelines

### Visual Style
- **Modern tech startup aesthetic** (think Eventbrite / Meetup)
- Light mode only (no dark mode for prototype)
- Clean, spacious layout with generous whitespace

### Color Palette
- **Primary:** Indigo (`#6366f1`) or Violet (`#7c3aed`)
- **Background:** White (`#ffffff`) and Light Gray (`#f8fafc`)
- **Text:** Dark Gray (`#1e293b`) for headings, Medium Gray (`#64748b`) for body
- **Accent colors** for category badges:
  - Music: Rose (`#f43f5e`)
  - Sports: Emerald (`#10b981`)
  - Technology: Blue (`#3b82f6`)
  - Art & Culture: Amber (`#f59e0b`)
  - Food & Drink: Orange (`#f97316`)
  - Community: Teal (`#14b8a6`)

### Typography
- Use Inter font (via Google Fonts or Next.js font optimization)
- Headings: Bold, 1.5x–2.5x sizes
- Body: Regular weight, 14–16px

### Responsive Breakpoints (Tailwind defaults)
- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px–1024px (2-column grid)
- Desktop: > 1024px (3-column grid, sidebar possible)

### Navigation Bar
- Logo/app name on left
- Nav links: Home, Events, Categories
- Right side: Login/Register buttons (if logged out) OR Profile dropdown (if logged in)
- Profile dropdown: Dashboard, Logout
- Mobile: hamburger menu

### Footer
- 3-column layout: About, Quick Links, Contact
- Social media icons (placeholder)
- Copyright text

---

## 8. Key Features Checklist

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1 | Responsive layout (mobile-first) | Required | — |
| 2 | Navigation bar with auth state | Required | — |
| 3 | Footer | Required | — |
| 4 | Home page with hero, featured events, categories | Required | — |
| 5 | User registration with validation | Required | — |
| 6 | User login with JWT via NextAuth | Required | — |
| 7 | Profile dropdown after login | Required | — |
| 8 | Logout functionality | Required | — |
| 9 | Events listing page with event cards | Required | — |
| 10 | Category filtering (client-side, 6+ categories) | Required | — |
| 11 | Search box (client-side filtering) | Required | — |
| 12 | Event detail page | Required | — |
| 13 | Categories page | Required | — |
| 14 | User dashboard (RSVPs, Saved, Profile) | Required | — |
| 15 | Featured events section on homepage | Required | — |
| 16 | Placeholder images for events | Required | — |
| 17 | Strapi backend with Event/Category content types | Required | — |
| 18 | Seed data (10-15 events, 6 categories) | Required | — |
| 19 | Map view | Out of scope | — |
| 20 | RSVP functionality | Out of scope | — |
| 21 | Admin dashboard | Out of scope | — |
| 22 | Dark mode | Out of scope | — |

---

## 9. Development Sequence

### Phase 1: Project Setup
1. Initialize Next.js project with App Router + TypeScript + Tailwind CSS
2. Install and configure shadcn/ui
3. Initialize Strapi v5 project in `backend/`
4. Create Event and Category content types in Strapi
5. Set up API permissions (Public: read, Authenticated: read)
6. Create seed script and populate sample data

### Phase 2: Core Layout & Auth
7. Build root layout (Navbar + Footer components)
8. Build Login page with form + Strapi auth integration
9. Build Register page with form + validation + Strapi registration
10. Configure NextAuth.js with JWT + Strapi credentials provider
11. Implement protected route middleware (redirect /dashboard to /login)

### Phase 3: Content Pages
12. Build Home page (hero, featured events, categories preview)
13. Build Events Listing page (fetch from Strapi, event cards grid)
14. Implement client-side search + category filtering
15. Build Event Detail page (dynamic route with full info)
16. Build Categories page (category grid with event counts)

### Phase 4: Dashboard & Polish
17. Build User Dashboard page (profile info, placeholder sections)
18. Add profile dropdown in navbar (logged-in state)
19. Responsive testing and adjustments
20. Error handling and loading states
21. Final polish (animations, empty states, 404 page)

---

## 10. API Endpoints Used

### Public (no auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all published events |
| GET | `/api/events/:id` | Get single event |
| GET | `/api/categories` | List all categories |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/local/register` | Register new user |
| POST | `/api/auth/local` | Login, returns JWT |

### Authenticated (with Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |

---

## 11. Environment Variables

### Frontend (`.env.local`)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
STRAPI_URL=http://localhost:1337
```

### Backend (`.env`)
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
```

---

## 12. Constraints & Notes

- **No backend for auth is optional** — the assignment NOTE says Strapi/Next.js students must use Strapi + NextAuth + JWT (which this spec follows)
- **No deployment** — local development only for the prototype
- **No RSVP, map, or admin panel** — those are for the final deliverable (Oct 27, 2026)
- **Client-side filtering** is sufficient — no need for Strapi query parameter filtering
- **SQLite** is fine for the prototype — PostgreSQL can be used in the final version
- **The prototype is a ZIP submission** with source code + README — no live deployment required
