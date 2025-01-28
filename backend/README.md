# Hugging Face Image Generator Backend

## Project Overview

Express.js server handling AI image generation workflows using text-to-image models hosted on Hugging Face. Manages API requests, model inference, and response handling.

## Project Structure

```
src/
├── __tests__/                   - Jest test suites
├── config/                      - Environment configuration
│   └── env.ts                   - Config validation and setup
├── controllers/                 - Route handlers
│   └── image.controller.ts      - Image processing endpoints
├── middlewares/                 - Express middleware
│   ├── error.middleware.ts      - Global error handler
│   ├── rateLimit.middleware.ts  - Request throttling
│   └── validation.middleware.ts - Request validation
├── routes/                      - API endpoint definitions
│   └── api.ts                   - Main router configuration
├── services/                    - Business logic layer
│   └── huggingface.service.ts   - Hugging Face model integration
├── types/                       - TypeScript type definitions
│   └── requests.d.ts            - API request payload types
└── server.ts                    - Main application entry point
```

## Getting Started

```bash
pnpm install
cp .env.example .env # Update with your Hugging Face Access Token
pnpm dev
```

## Configuration

Environment variables (via `.env`):

- PORT: Server port (default: 7860)
- CORS_ORIGIN: Allowed origins (default: localhost:5173)
- HUGGINGFACE_ACCESS_TOKEN: Access token for AI services
- HUGGINGFACE_MODEL: Model identifier (used as fallback if not provided in request)

## API Documentation

### Middleware stack

- CORS with configurable origins
- 10MB JSON payload limit
- URL-encoded body parsing
- Rate limiting
- Request validation
- Error handling with structured responses

### Health Check Endpoint

Ensure the API is running and responsive.

POST `/api/health-check`

### Generate Image Endpoint

POST `/api/generate`

**Request Body:**

```json
{
  "prompt": "string (required, max 500 chars)",
  "negativePrompt": "string (optional, max 500 chars)",
  "width": "number (optional, 256-1024)",
  "height": "number (optional, 256-1024)",
  "format": "string (optional, 'jpeg' or 'png')"
}
```

**Example Negative Prompts:**

- For portraits: "blurry, distorted face, extra fingers"
- For landscapes: "low quality, oversaturated, unrealistic"
- For objects: "poorly drawn, cartoonish, low detail"

## Testing

```bash
pnpm test
```

- Jest test framework
- Tests located in `src/__tests__/` directory
