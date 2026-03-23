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

### Task Completion Requirements

- All of `bun fmt`, `bun lint`, and `bun typecheck` must pass before considering tasks completed.

### Tooling

- **Package Manager**: Bun
- **Deployment**: Docker (later, focus on standalone development first)

## Architecture Principles

1. **Mobile-first**: Design for kitchen/mobile use, scale up to desktop
2. **Accessibility-first**: React Aria for all interactive components
3. **Performance**: Server components where possible, prefetching for navigation
4. **Simplicity**: Lightweight, no over-engineering

## Design Direction

- **Vibe**: Book-like, family warmth, cozy
- **Colors**: Light theme, orange-ish warm palette
- **Typography**: Readable, slightly traditional/serif feel for headings
- **Mobile**: Primary target, works in kitchen context

## Core Priorities

1. Performance first.
2. Reliability first.
3. Keep behavior predictable under load and during failures.

If a tradeoff is required, choose correctness and robustness over short-term convenience.

## Maintainability

Long term maintainability is a core priority. If you add new functionality, first check if there is shared logic that can be extracted to a separate module. Duplicate logic across multiple files is a code smell and should be avoided. Don't be afraid to change existing code. Don't take shortcuts by just adding local logic to solve a problem.

## Code Conventions

### Python (Backend)

- Use type hints everywhere
- Pydantic for request/response schemas
- Async endpoints where beneficial
- SQLAlchemy for ORM

### TypeScript (Frontend)

- React Aria for all interactive UI
- Tanstack Query for server state
- Server components for static content
- Prefetch on hover/focus for navigation

### UI Text

- All user-facing text in French
- Code comments, variable names, commits in English
