# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Create directories for frontend and backend
RUN mkdir -p frontend backend

# Copy package files first for better caching
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
WORKDIR /app/frontend
RUN npm install
WORKDIR /app/backend
RUN npm install

# Copy source files
WORKDIR /app
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build applications
WORKDIR /app/backend
RUN npm run build

WORKDIR /app/frontend
RUN npm run build

# Set final working directory
WORKDIR /app

# Expose port
EXPOSE 7860

# Start the server
CMD ["node", "backend/dist/server.js"]