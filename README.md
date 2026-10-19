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

## Run Locally

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
