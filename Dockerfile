# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json frontend/
COPY backend/package*.json backend/

# Install dependencies
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy project files
COPY frontend/ frontend/
COPY backend/ backend/

# Build server
RUN cd backend && npm run build

# Build React app
RUN cd frontend && npm run build

# Expose port
EXPOSE 7860

# Start the server
CMD ["node", "backend/dist/server.js"]