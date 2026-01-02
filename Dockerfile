FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./public
RUN npm test

FROM node:18-alpine
WORKDIR /app/backend
ENV NODE_ENV=production PORT=8080
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./public
EXPOSE 8080
CMD ["node", "server.js"]
