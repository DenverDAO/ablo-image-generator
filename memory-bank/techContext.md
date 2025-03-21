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

## Technical Constraints

### Story Protocol Integration Constraints

1. **Network Support**: Story Protocol currently only supports Base Mainnet and Base Sepolia testnet.
2. **Gas Fees**: Users will need Base ETH to pay for gas fees when registering IP Assets.
3. **Transaction Signing**: Users must sign blockchain transactions through a connected wallet.
4. **Metadata Size**: There are limits to how much metadata can be stored directly on-chain.

### Hugging Face API Constraints

1. **Rate Limits**: Free tier has usage limits per model and account.
2. **Latency**: Image generation can take several seconds depending on model size.
3. **Model Availability**: Some models may be temporarily unavailable.
4. **Cost**: Higher usage may require paid API plans.

### Application Constraints

1. **Image Storage**: Need to determine how long to store generated images.
2. **Authentication**: Balancing Web2 and Web3 authentication methods.
3. **Cross-Device Experience**: Ensuring wallet connections work across different devices.
4. **Performance**: Handling potentially long blockchain confirmation times.

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

- Using Helia IPFS client with filesystem-based blockstore
- Persistent data storage in configurable directory
- Singleton service pattern with async initialization
- Configurable gateway fallback for content resolution

### Features

- File and metadata storage with CID generation
- Content pinning for persistence
- Automatic directory creation and management
- Retry mechanism with configurable timeout
- Gateway fallback for content verification
- Metadata parsing and validation

### Configuration

- Configurable via environment variables:
  - IPFS_GATEWAY: Gateway URL for content resolution
  - IPFS_DATA_DIR: Local storage location
  - IPFS_PIN_METADATA: Auto-pinning control
  - IPFS_TIMEOUT_MS: Operation timeout
  - IPFS_MAX_RETRIES: Retry attempts
  - IPFS_API_KEY/SECRET: Optional external service integration

### Error Handling

- Graceful initialization failure recovery
- Timeout handling for network operations
- Retry logic for transient failures
- Detailed error logging
- Gateway fallback for content verification

## Story Protocol Integration

- IP Asset Registration using `mintAndRegisterIpAssetWithPilTerms`
- IPFS metadata storage and retrieval
- License terms configuration
- Environment variable validation

## Development Setup

- Using Story Protocol's Aeneid testnet
- IPFS gateway configured for metadata storage
- Environment variables required for blockchain interaction

## Dependencies

- @story-protocol/core-sdk: Latest version
- helia: IPFS client
- @helia/unixfs: IPFS filesystem operations
- blockstore-fs: Persistent storage
- viem: Blockchain interactions
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
- Secure metadata storage and retrieval
