# Technical Context: Ablo Image Generator

## Technologies Used

### Backend

- **Node.js**: JavaScript runtime for server-side logic
- **Express**: Web framework for handling HTTP requests
- **TypeScript**: Typed superset of JavaScript for improved code quality
- **Sharp**: High-performance image processing library for Node.js
- **@huggingface/inference**: Official SDK for Hugging Face AI models
- **@story-protocol/core-sdk**: Official SDK for Story Protocol blockchain integration
- **Viem**: Ethereum library for blockchain interactions

### Frontend (Anticipated)

- **React**: Frontend UI library
- **Ethers.js** or **wagmi**: Blockchain interaction libraries for frontend
- **Web3Modal** or similar: For wallet connection

### Development Tools

- **Jest**: Testing framework
- **TypeScript**: Type checking
- **Docker**: Containerization for consistent deployment

### External Services

- **Hugging Face**: AI model provider for text-to-image generation
- **Story Protocol**: Blockchain protocol for IP registration and management
- **Base Sepolia**: Ethereum-compatible testnet for development

## Frontend Architecture

### Core Technologies

- React with TypeScript for type safety
- Vite as the build tool
- Tailwind CSS for styling
- shadcn/ui for component library
- Zustand for state management
- React Hook Form with Zod for form handling and validation
- Sonner for toast notifications
- Web3-Onboard for wallet connection
- Viem for blockchain interactions

### Component Structure

1. Layout Components (`/src/components/layout/`)

   - `Layout.tsx`: Main layout wrapper
   - `Header.tsx`: App header with wallet connection
   - `Footer.tsx`: App footer with copyright

2. Feature Components (`/src/components/`)

   - `ImageGenerationForm.tsx`: Form for image generation
   - `GeneratedImage.tsx`: Display and actions for generated images

3. UI Components (`/src/components/ui/`)
   - Shadcn/ui components (button, card, form, input, textarea, dialog)

### State Management

- Zustand store in `src/lib/store.ts`
- Manages:
  - Wallet connection state
  - Image generation state
  - Generated image data

### Styling

- Tailwind CSS with custom configuration
- Custom color scheme using CSS variables
- Dark mode support
- Responsive design patterns

### Form Handling

- React Hook Form for form state
- Zod for schema validation
- Custom form components with error handling
- Style selection with datalist

### API Integration

- Fetch API for backend communication
- Error handling with toast notifications
- Loading states during API calls

### Web3 Integration

1. Wallet Connection

   - Web3-Onboard for multi-wallet support
   - Injected wallet provider (MetaMask, etc.)
   - Connection state management with Zustand
   - Automatic reconnection support

2. Network Configuration

   - Base Sepolia testnet
   - Chain ID: 0x14a34
   - RPC URL: https://sepolia.base.org
   - Network switching support (planned)

3. Components

   - `useWallet` hook for wallet state management
   - Wallet connection button in Header
   - Connection status display
   - Address display with truncation

4. State Management
   - Wallet connection status
   - Connected address
   - Network status
   - Transaction state

## Development Setup

1. **Environment Variables**:

   - `HUGGINGFACE_ACCESS_TOKEN`: API key for Hugging Face
   - `HUGGINGFACE_MODEL`: Default text-to-image model
   - `PORT`: Server port
   - `CORS_ORIGIN`: Allowed origins for CORS
   - `PRIVATE_KEY`: Blockchain wallet private key (for testing only)
   - `CHAIN_ID`: Blockchain network ID
   - `RPC_URL`: Blockchain node RPC URL

2. **Local Development**:

   ```bash
   # Backend
   cd backend
   npm install
   npm run dev

   # Frontend
   cd frontend
   npm install
   npm run dev
   ```

3. **Docker Setup**:
   ```bash
   # Run the entire application with Docker
   ./docker-run.sh
   ```

## Dependencies

The key dependencies include:

```json
// Backend dependencies (from package.json)
{
  "dependencies": {
    "@huggingface/inference": "^3.0.2",
    "@story-protocol/core-sdk": "1.3.0-rc.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.3",
    "express-validator": "^7.0.1",
    "sharp": "^0.33.2"
  }
}
```

### Frontend Dependencies

- React and React DOM
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand for state management
- React Hook Form and Zod
- Sonner for notifications
- Web3-Onboard (pending implementation)

## Integration Points

### Hugging Face Integration

- Uses `@huggingface/inference` package
- Implemented in `services/huggingface.service.ts`
- Handles text-to-image model inference

### Story Protocol Integration

- Will use `@story-protocol/core-sdk` package
- Will be implemented in a new service file `services/storyprotocol.service.ts`
- Will handle IP Asset registration and metadata management

## Future Technical Considerations

1. **Scaling**: As usage grows, need to consider caching strategies and image storage solutions
2. **Mainnet Migration**: Planning for migration from testnet to mainnet
3. **Multiple Networks**: Supporting multiple blockchain networks
4. **Account Abstraction**: Implementing more user-friendly wallet interactions
5. **Advanced IP Features**: Adding licensing, royalties, and derivative work tracking

## Story Protocol Integration

### Working Features

- IP Asset Registration using `mintAndRegisterIpAssetWithPilTerms`
- IPFS metadata storage and retrieval
- License terms configuration
- Environment variable validation

### Known Limitations

- Asset retrieval methods not clearly documented in SDK
- Type definitions may be incomplete or outdated
- Need to implement local caching for asset details

## Development Setup

- Using Story Protocol's Aeneid testnet
- IPFS gateway configured for metadata storage
- Environment variables required for blockchain interaction

## Dependencies

- @story-protocol/core-sdk: Latest version
- viem: Required for blockchain interactions
- envalid: Environment validation
- winston: Logging

## Technical Constraints

- Story Protocol SDK limitations in asset retrieval
- Need to maintain local cache of registered assets
- Blockchain transaction latency considerations
- IPFS gateway reliability and performance

## Security Considerations

- Private key management
- API key protection
- Rate limiting for blockchain interactions
- Error handling for failed transactions

## IPFS Integration

### Architecture

- Helia IPFS client with filesystem blockstore
- Pinata service for reliable pinning
- Local node for quick access
- Gateway fallback for reliability

### Features

- Persistent data storage
- Content pinning via Pinata
- Automatic directory management
- Retry mechanism with timeouts
- Gateway fallback for content verification
- Dedicated and public gateway support

### Configuration

- Environment-based setup
- Configurable data directory
- Pinata JWT authentication
- Gateway URL configuration
- Timeout and retry settings
- Optional dedicated gateway

### Error Handling

- Graceful degradation
- Multiple retrieval attempts
- Detailed error logging
- CID verification
- Gateway fallback

### Security

- JWT-based authentication for Pinata
- Environment variable protection
- Local data encryption (planned)
- Access control (planned)

## Story Protocol Integration

### Architecture

- SDK-based integration
- HTTP API fallback for asset retrieval
- Base Sepolia testnet support
- Environment-based configuration

### Features

- IP asset registration
- Metadata storage
- License term configuration
- Asset retrieval via HTTP API
- Transaction management

### Configuration

- Network settings
- Contract addresses
- Private key management
- API endpoints

### Error Handling

- Transaction failure recovery
- Detailed error logging
- Retry mechanisms
- Validation checks

## Development Setup

### Dependencies

- Node.js and pnpm
- TypeScript
- Express.js
- Story Protocol SDK
- Helia IPFS client
- Pinata SDK
- Winston logger

### Environment

- Development on Base Sepolia
- Local IPFS node
- Pinata for production storage
- Configurable gateways

## Technical Constraints

### IPFS

- Content availability depends on pinning
- Gateway response times vary
- Local node storage limits
- Network bandwidth requirements

### Blockchain

- Transaction costs
- Network congestion
- Block confirmation times
- Contract deployment costs

### Security

- Private key management
- API key protection
- Rate limiting
- Access control

## Monitoring & Logging

### Logging System

- Winston logger
- Structured log format
- Environment-based levels
- Error context preservation

### Metrics (Planned)

- Transaction success rates
- IPFS operation latency
- Gateway response times
- Storage usage tracking

## Future Considerations

### Scalability

- Load balancing
- Caching layer
- Queue system
- Multiple IPFS nodes

### Security

- Enhanced access control
- Rate limiting
- API key rotation
- Audit logging

### Features

- Batch operations
- Content verification
- Automated pinning policies
- Advanced search capabilities
