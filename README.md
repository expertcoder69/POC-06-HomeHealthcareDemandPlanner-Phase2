# Home Healthcare Demand Planner (Phase 2 - Cloud Mirror)

This repository contains the Phase 2 containerized environment for the Home Healthcare Demand Planner (POC 06). The application has been migrated from a local OS execution model to a strict containerized environment using Docker, ensuring 100% parity with future Azure Cloud deployments.

## Architecture
* **Frontend:** Next.js (Node 18 Alpine), configured with standalone output and internal API proxying.
* **Backend:** FastAPI (Python 3.11 Slim), bound to `0.0.0.0` for container networking.
* **Orchestration:** Docker Compose V2.

## Environment Configuration
No strict API keys are required for the base synthetic data generation. However, a `.env` file should be placed in the root directory for any future external API integrations (e.g., Mapbox tokens).

**Example `.env` (Root Directory):**
\`\`\`env
# NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
\`\`\`

## Startup Instructions & Docker Commands
Ensure Docker Desktop is installed and running with hardware virtualization enabled.

1. Clone this repository.
2. Open a terminal in the root directory.
3. Build and spin up the container stack:
   \`\`\`bash
   docker compose up --build
   \`\`\`
4. Access the Frontend Dashboard: [http://localhost:3000](http://localhost:3000)
5. Access the Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

To shut down the containers gracefully, use:
\`\`\`bash
docker compose down
\`\`\`

## Troubleshooting Notes
* **Port Conflicts:** If ports `3000` or `8000` are already in use, stop the conflicting local services before running `docker compose up`.
* **API Connection Errors:** The Next.js frontend is configured to proxy `/api` calls directly to the backend container via the Docker service network. Do not bypass this by hardcoding `localhost:8000` in the frontend code.
* **Virtualization Errors:** If Docker Desktop fails to start, ensure Virtualization is enabled in your BIOS/UEFI and WSL2/Virtual Machine Platform features are active in Windows.
