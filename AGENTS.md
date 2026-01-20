# Re7 - Recipe Sharing App

> "Re7" reads as "recette" (recipe) in French. A lightweight recipe sharing app for family and friends.

## Project Overview

A fast, accessible, mobile-first web application for sharing recipes within a small circle of family and friends. The UI is in French, codebase in English.

## Tech Stack

### Backend

- **Framework**: FastAPI
- **Database**: SQLite with WAL mode
- **Image Storage**: Local filesystem (`/uploads` directory)
- **Authentication**: Username/password with admin-generated invite links

### Frontend

- **Framework**: React with Tanstack Start
- **Styling**: TailwindCSS, Lucide icons
- **UI Components**: React Aria (accessibility-first, use for 99% of UI work)
- **State/Data**: Tanstack stack (Query, Router, etc.)
- **React Compiler**: Enabled

### Tooling

- **Package Manager**: Bun
- **Deployment**: Docker (later, focus on standalone development first)

## Architecture Principles

1. **Mobile-first**: Design for kitchen/mobile use, scale up to desktop
2. **Accessibility-first**: React Aria for all interactive components
3. **Performance**: Server components where possible, prefetching for navigation
4. **Simplicity**: Lightweight, no over-engineering

## Data Models

### User

- `id`: UUID
- `username`: string (unique)
- `password_hash`: string
- `is_admin`: boolean (only one admin)
- `created_at`: datetime

### InviteLink

- `id`: UUID
- `token`: string (unique)
- `created_by`: User ID (admin)
- `used_by`: User ID (nullable)
- `expires_at`: datetime
- `created_at`: datetime

### Recipe

- `id`: UUID
- `title`: string
- `description`: string (backstory)
- `image_path`: string (nullable)
- `prep_time_minutes`: integer (nullable)
- `cook_time_minutes`: integer (nullable)
- `servings`: integer
- `difficulty`: enum (easy, medium, hard)
- `source`: string (nullable, origin/attribution)
- `author_id`: User ID
- `created_at`: datetime
- `updated_at`: datetime

### Ingredient

- `id`: UUID
- `recipe_id`: Recipe ID
- `quantity`: decimal (nullable for "to taste" items)
- `unit`: string (nullable)
- `name`: string
- `is_scalable`: boolean (default true)
- `order`: integer

### Step

- `id`: UUID
- `recipe_id`: Recipe ID
- `order`: integer
- `instruction`: string
- `timer_minutes`: integer (nullable)
- `note`: string (nullable)

### Category

- `id`: UUID
- `name`: string (unique)
- `slug`: string (unique)

### RecipeCategory (junction)

- `recipe_id`: Recipe ID
- `category_id`: Category ID

### Like

- `user_id`: User ID
- `recipe_id`: Recipe ID
- `created_at`: datetime

### Bookmark

- `user_id`: User ID
- `recipe_id`: Recipe ID
- `created_at`: datetime

## Features by Phase

### Phase 1 - Core

- [ ] Admin authentication + invite link generation
- [ ] User registration via invite + login
- [ ] Recipe CRUD (create, read, update, delete)
- [ ] Structured ingredients with quantity/unit/name
- [ ] Structured steps with optional timers
- [ ] Single image upload per recipe
- [ ] Browse all recipes
- [ ] Search recipes
- [ ] Responsive mobile-first UI

### Phase 2 - Engagement

- [ ] Like recipes
- [ ] Bookmark recipes
- [ ] Categories/tags
- [ ] Filter by category
- [ ] Print-friendly recipe view

### Phase 3 - Sharing & Polish

- [ ] Share recipe via WhatsApp/social
- [ ] Performance optimizations
- [ ] UI polish

## Design Direction

- **Vibe**: Book-like, family warmth, cozy
- **Colors**: Light theme, orange-ish warm palette
- **Typography**: Readable, slightly traditional/serif feel for headings
- **Mobile**: Primary target, works in kitchen context

## Project Structure

```
Re7/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── uploads/
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── CLAUDE.md
└── README.md
```

## Development Workflow

1. **Initialize**: Set up Tanstack Start frontend + FastAPI backend
2. **UI/UX Research**: Explore design patterns, iterate on visual direction
3. **Implement phases**: Core → Engagement → Sharing

## Code Conventions

### Python (Backend)

- Use type hints everywhere
- Pydantic for request/response schemas
- Async endpoints where beneficial
- SQLAlchemy for ORM

### TypeScript (Frontend)

- Strict TypeScript
- React Aria for all interactive UI
- Tanstack Query for server state
- Server components for static content
- Prefetch on hover/focus for navigation

### UI Text

- All user-facing text in French
- Code comments, variable names, commits in English

## Commands

```bash
# Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
bun install
bun run dev
```

## Notes

- Single admin user manages invite links
- No comments feature (not planned)
- No meal planning or shopping lists
- Focus on speed and simplicity
