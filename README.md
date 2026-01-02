# Notes Collaboration Suite

Full-stack demo that mirrors how I ship collaborative tools: a React frontend, Express API, Docker Compose workflow, and integration tests that gate deployments. The backend serves both the API and the compiled frontend bundle in production images.

## TL;DR quick start

```bash
docker compose up --build -d
node scripts/integration-test.js
open http://localhost:5173
```

The script waits for the backend + frontend, posts a note, fetches it through the API, and ensures the frontend serves the compiled bundle—mirroring what the CI pipeline does.

## Architecture

- **Frontend (`frontend/`)** – React + Vite app that hits `/api/notes` and `/api/health`. Vitest covers rendering and fetch mocks.
- **Backend (`backend/`)** – Express API storing in-memory notes, enforcing validation, and surfacing `/api/health` for readiness probes.
- **Docker Compose (`docker-compose.yml`)** – Spins up the backend (Node) and a build container for the frontend to mimic CI.
- **Integration tests (`scripts/integration-test.js`)** – Wait for the Compose stack, create a note via the API, and confirm the frontend serves the compiled bundle. The test walks the same path users do: HTTP client → backend API → in-memory store → frontend build output.

## Local development

```bash
# Frontend
(cd frontend && npm install && npm run dev)
# Backend
(cd backend && npm install && npm run dev)
```

Frontend runs on Vite's default port (5173) and proxies to the backend on `8080` while `npm run dev` is active.

## Docker workflow

```bash
docker compose up --build -d
node scripts/integration-test.js
```

Stop containers with `docker compose down`. The production `Dockerfile` uses multi-stage builds to compile the React app once and copy the assets into the backend image.

## Quality gates

- `frontend/` – `npm run test` (Vitest) plus `npm run build` to ensure the bundle compiles cleanly.
- `backend/` – `npm run lint` (eslint) and `npm test` (node test runner + Supertest).
- `notes_collaboration_suite` job in `.github/workflows/portfolio.yml` executes the same install/test/build steps on GitHub Actions, then runs the integration script against a Compose stack for parity with staging.

## Deployment model

1. Build the full image via `docker build -t registry.example.com/notes-suite:TAG .`.
2. Deploy to Kubernetes/ECS/Swarm with a single container—the backend serves static assets from `/app/backend/public`.
3. Use `/api/health` for readiness/liveness probes and to feed uptime dashboards.

The README outlines the flow, while code comments and scripts show how to enforce contract tests before promoting a release.
