# Hugging Face Image Generator with Story Protocol Integration

![Mountain Sunset](./mountain_sunset.png)

### Quick start with Docker

For quickly testing out the app:

```bash
git clone https://github.com/proofoftom/hf-image-monorepo image-wizard
cd image-wizard
. ./docker-run.sh
```

For development, see below.

## [Backend](./backend)

### Overview

Express.js server handling AI image generation workflows using text-to-image models hosted on Hugging Face, with Story Protocol integration for registering generated images as IP assets on the blockchain. Manages API requests, model inference, blockchain interactions, and response handling.

### Structure

```
src/
├── __tests__/                   - Jest test suites
├── config/                      - Environment configuration
│   └── env.ts                   - Config validation and setup
├── controllers/                 - Route handlers
│   ├── image.controller.ts      - Image processing endpoints
│   └── ipAsset.controller.ts    - IP asset registration endpoints
├── middlewares/                 - Express middleware
│   ├── error.middleware.ts      - Global error handler
│   ├── rateLimit.middleware.ts  - Request throttling
│   └── validation.middleware.ts - Request validation
├── routes/                      - API endpoint definitions
│   └── api.ts                   - Main router configuration
├── services/                    - Business logic layer
│   ├── huggingface.service.ts   - Hugging Face model integration
│   ├── storyprotocol.service.ts - Story Protocol integration
│   └── ipfs.service.ts          - IPFS storage service
├── types/                       - TypeScript type definitions
│   └── requests.d.ts            - API request payload types
└── server.ts                    - Main application entry point
```

### Starting the server

```bash
cd backend
pnpm install
cp .env.example .env # Update with your Hugging Face Access Token, Story Protocol, and IPFS settings
pnpm dev
```

### Configuration

**Environment variables (via `.env`):**

- PORT: Server port (default: 3000)
- CORS_ORIGIN: Allowed origins (default: localhost:5173)
- HUGGINGFACE_ACCESS_TOKEN: Access token for AI services
- HUGGINGFACE_MODEL: Model identifier (used as fallback if not provided in request)
- PRIVATE_KEY: Blockchain wallet private key
- RPC_URL: Base Sepolia RPC URL
- CHAIN_ID: Blockchain network ID (84532 for Base Sepolia)
- SPG_NFT_CONTRACT: Story Protocol NFT contract address
- IPFS_DATA_DIR: Local directory for IPFS data
- IPFS_GATEWAY: IPFS gateway URL
- IPFS_PIN_METADATA: Whether to pin metadata by default

### API Documentation

#### Middleware stack

- CORS with configurable origins
- 10MB JSON payload limit
- URL-encoded body parsing
- Rate limiting
- Request validation
- Error handling with structured responses

#### Health Check Endpoint

Ensure the API is running and responsive.

POST `/api/health-check`

#### Generate Image Endpoint

POST `/api/generate`

**Request Body:**

```json
{
  "model": "string (optional, default from .env)",
  "prompt": "string (required, max 500 chars)",
  "negativePrompt": "string (optional, max 500 chars)",
  "width": "number (optional, 256-1024)",
  "height": "number (optional, 256-1024)",
  "format": "string (optional, 'jpeg' or 'png')"
}
```

#### Register IP Asset Endpoint

POST `/api/register`

**Request Body:**

```json
{
  "imageId": "string (required)",
  "name": "string (required)",
  "description": "string (optional)",
  "attributionText": "string (optional)",
  "commercialTerms": {
    "commercialRevShare": "number (optional, default: 50)",
    "attributionRequired": "boolean (optional, default: true)",
    "derivativesAllowed": "boolean (optional, default: true)"
  }
}
```

**Example Negative Prompts:**

- For portraits: "blurry, distorted face, extra fingers"
- For landscapes: "low quality, oversaturated, unrealistic"
- For objects: "poorly drawn, cartoonish, low detail"

### Story Protocol Integration

The application integrates with Story Protocol to register generated images as IP assets on the blockchain. Key features include:

- Automatic IPFS storage for images and metadata
- IP asset registration with configurable license terms
- Support for commercial revenue sharing
- Attribution and derivatives configuration
- Base Sepolia testnet integration

### IPFS Integration

Images and metadata are stored using IPFS with the following features:

- Persistent local storage with filesystem blockstore
- Content pinning support
- Gateway fallback for content verification
- Configurable retry mechanism
- Automatic directory management

### Testing

```bash
cd backend
pnpm test
```

- Jest test framework
- Tests located in `backend/src/__tests__/` directory

## [Frontend](./frontend)

![App Screenshot](./screenshot.png)

### Overview

React application built with TypeScript, providing a modern UI for image generation and NFT minting. Features include:

- Text-to-image generation with style selection
- Web3 wallet integration
- NFT minting with Story Protocol
- Real-time transaction tracking
- IPFS content viewing

### Structure

```
frontend/
├── src/
│   ├── components/     - Reusable UI components
│   │   ├── GeneratedImage.tsx    - Image display and minting
│   │   ├── ImageGenerationForm.tsx - Prompt input and generation
│   │   └── MintDialog.tsx        - NFT minting status
│   ├── lib/           - Utilities and services
│   │   ├── hooks/     - Custom React hooks
│   │   ├── services/  - API and blockchain services
│   │   └── store/     - State management
│   ├── App.tsx        - Main application component
│   └── main.tsx       - Application entry point
└── vite.config.ts     - Build configuration
```

### Technology Stack

- TypeScript 5.x
- React 18+
- Vite
- Tailwind CSS
- shadcn/ui
- Web3-Onboard
- Zustand

### Starting the frontend

After [starting the server](#starting-the-server):

```bash
cd frontend
pnpm install
pnpm dev
```

### Development Standards

- Strict TypeScript usage throughout
- Component-first architecture
- Tailwind for styling
- Modular state management
- Clean import paths via aliases

## Potential Future Features

- Store and display generated image history
- Advanced IP licensing features
- Multi-network support
- Account abstraction for easier onboarding
- Advanced royalty configuration

## Contact

Looking for a rock-star Backend AI/Web3 Engineer? [Let's connect!](mailto:hf-image-monorepo.prowling715@passinbox.com)

[LinkedIn](https://linkedin.com/in/proofoftom)

---

**Note:** This project is under active development. Please report any issues or suggestions in the [issues section](https://github.com/proofoftom/hf-image-monorepo/issues).
