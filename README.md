# WFH Attendance — Dexa Group Take-home Test

A web app for recording employees' work-from-home attendance.

- **HRD Admin** manages employee data.
- **Employees** clock in their WFH attendance.

| Part     | Stack                         | Folder                   | URL                   |
| -------- | ----------------------------- | ------------------------ | --------------------- |
| Frontend | Next.js, TypeScript, Ant Design | [frontend/](frontend/) | http://localhost:3000 |
| Backend  | NestJS, TypeScript            | [backend/](backend/)     | http://localhost:4000 |
| Database | PostgreSQL 17                 | —                        | localhost:5432        |

---

## Demo accounts

| Role     | Username                      | Password      |
| -------- | ----------------------------- | ------------- |
| HR Admin | `admin`                       | `admin123`    |
| Employee | `giorno`, `diego` or `johnny` | `password123` |

---

# How To Run

## Option 1: Run with Docker (recommended)

**Requirements:** [Docker](https://docs.docker.com/get-docker/) with Docker Compose.

```bash
git clone <this-repo-url>
cd dexagroup-test
docker compose up --build
```

Open http://localhost:3000 once all three containers are up. The backend container applies
database migrations and seeds the demo accounts automatically on startup.

To stop: `Ctrl+C`, then `docker compose down`.
To also delete the database data: `docker compose down -v`.

> On older Docker installs, use `docker-compose` (with a hyphen) instead of `docker compose`.

---

## Option 2: Run manually

**Requirements:** Node.js 20.19+ (22 or 24 recommended) and npm, plus a PostgreSQL database.

### 1. Start PostgreSQL

Either start only the database container:

```bash
docker compose up -d db
```

or use your own local PostgreSQL and create a database named `wfh_attendance`.

### 2. Start the backend

```bash
cd backend
cp .env.example .env    
npm install             
npm run db:migrate      
npm run db:seed         
npm run start:dev
```

The API runs on http://localhost:4000.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

---

## Troubleshooting

- **Port already in use (3000, 4000 or 5432):** stop whatever is using that port, or change the
  left-hand port number in [docker-compose.yml](docker-compose.yml) (for example `"5433:5432"`).
- **`npm install` fails in the backend:** the backend includes an `.npmrc` with
  `legacy-peer-deps=true`; make sure you run `npm install` from inside the `backend/` folder.
