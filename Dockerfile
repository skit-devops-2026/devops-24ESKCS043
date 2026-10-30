# Build the React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Install backend dependencies and run the full 
application
FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./backend/
COPY --from=frontend-build /frontend/dist 
./backend/public/

ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
