# XE Property Ad Form

Fullstack app for creating and browsing property listings. Built for the xe.gr web developer challenge.

## Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL

## What it does

- Form to create a property ad (title, type, area, price, description)
- Area field uses the xe.gr autocomplete API, starts searching after 3 characters
- Debounce (300ms) so it doesn't fire on every keystroke
- Backend caches autocomplete results for 5 minutes to avoid hammering the external API
- Keyboard navigation on the dropdown (arrows, enter, escape)
- Submitted ads are saved to PostgreSQL and shown in a listings page
- Delete listing with confirmation modal
- Basic validation on both ends

## Prerequisites

- Node.js 18+
- PostgreSQL installed locally

## Setup

### 1. Database

**Mac/Linux:**
```bash
createdb xe_property
psql xe_property < server/src/db/schema.sql
```

**Windows, psql needs the full path:**
```bash
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres xe_property
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d xe_property -f server/src/db/schema.sql
```
Change `18` to whatever version you have installed.

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/xe_property
PORT=3001
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Project structure

```
xe-property-form/
├── client/
│   └── src/
│       ├── components/    # AdForm, AdList, AreaAutocomplete
│       ├── hooks/         # useDebounce, useAreaSearch
│       └── types/
└── server/
    └── src/
        ├── routes/        # autocomplete.ts, ads.ts
        └── db/            # schema.sql, queries.ts
```

## Dependencies

**Frontend:** react, react-dom, vite, @vitejs/plugin-react, typescript, lucide-react

**Backend:** express, pg, cors, dotenv, tsx, typescript