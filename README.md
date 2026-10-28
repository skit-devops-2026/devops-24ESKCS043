# Warranty Vault — DevOps Project

Warranty Vault is a web-based warranty management application that helps users manage products, warranty information, service history, documents, and warranty expiry dates.

## Live Deployment

- **Application:** https://devops-24eskcs043-production.up.railway.app
- **Docker Hub:** https://hub.docker.com/r/ananya5105/warranty-vault
- **Docker Image:** `ananya5105/warranty-vault:latest`

## Features

- User registration and login
- Product and warranty management
- Warranty expiry tracking
- Service history and document management
- Analytics and user settings
- Admin dashboard and user management

## Technologies Used

- HTML, CSS, JavaScript
- Node.js and Vite
- Docker and Docker Compose
- Prometheus and Grafana
- Kubernetes and kubectl
- Git and GitHub
- Railway deployment

## Project Structure

```text
.
├── backend/
│   ├── Dockerfile
│   └── server.js
├── docs/
│   ├── prometheus-metrics.jpeg
│   ├── prometheus-targets.jpeg
│   └── kubernetes-pods.jpeg
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
├── monitoring/
│   ├── grafana-dashboard.json
│   └── prometheus.yml
├── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```


## Run the Website Locally (without Docker)

You need Node.js 18+ and the MongoDB connection string in `backend/.env`.

```bash
# 1. Backend API (http://localhost:5000)
cd backend
npm install
npm start

# 2. Frontend (http://localhost:5173) — in a second terminal, from the project root
npm install
npm run dev
```

### Admin login

There is exactly **one** admin account. It is created automatically the first time the backend
starts, from these values in `backend/.env`:

```
ADMIN_EMAIL=admin@warrantyvault.io
ADMIN_PASSWORD=Admin@Vault2026
```

Change the password in `.env` **before** the first start (or log in and change it under Settings).
Public sign-up always creates a normal user, and normal users have no way to reach admin pages.

If the frontend should talk to an API on another address, set `VITE_API_URL`
(e.g. `VITE_API_URL=https://my-api.example.com`) before `npm run dev` / `npm run build`.

## Run Locally (Docker)

Install Docker Desktop and start it first.

Build and start the application and monitoring services:

```bash
docker compose up --build -d
```

Services:

| Service | Local URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend health | http://localhost:3001/api/health |
| Backend metrics | http://localhost:3001/metrics |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

The local Grafana credentials configured in Docker Compose are `admin` / `admin123`. These are for local coursework use only; change them before any public deployment.

Stop the services:

```bash
docker compose down
```

## Docker Hub

Pull the published frontend image:

```bash
docker pull ananya5105/warranty-vault:latest
```

Run it locally:

```bash
docker run --rm -p 8080:80 ananya5105/warranty-vault:latest
```

Open http://localhost:8080.

## Monitoring

Prometheus configuration is available in `monitoring/prometheus.yml`. It scrapes the backend's `/metrics` endpoint.

The Grafana dashboard definition is available in `monitoring/grafana-dashboard.json`. Import this file into Grafana and select the configured Prometheus data source if the dashboard has not already been imported.

Screenshots of Prometheus targets and metrics are stored in `docs/`.

## Kubernetes

The Kubernetes manifests are in `k8s/`.

For a local Kind cluster, build and load the image, then deploy:

```bash
docker build -t warranty-vault:latest .
kind load docker-image warranty-vault:latest --name warranty-vault
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/warranty-vault
kubectl get pods
kubectl get services
```

To access the application locally:

```bash
kubectl port-forward service/warranty-vault-service 8081:80
```

Open http://localhost:8081 while port forwarding is running.

## Author

Ananya Dubey

## Project Status

Developed as part of DevOps Practices and Principles coursework.

## Docker Image

Docker Hub Repository: https://hub.docker.com/r/ananya5105/warranty-vault

Image: ananya5105/warranty-vault:latest

Pull command: docker pull ananya5105/warranty-vault:latest

## Live Deployment

Live Application URL: https://devops-24eskcs043-production.up.railway.app
