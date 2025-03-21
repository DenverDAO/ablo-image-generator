import dotenv from "dotenv";
import { cleanEnv, str, port, url, num, bool } from "envalid";

dotenv.config();

export const config = cleanEnv(process.env, {
  // Server Configuration
  PORT: num({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  CORS_ORIGIN: str({ default: '*' }),

  // Hugging Face Configuration
  HUGGINGFACE_ACCESS_TOKEN: str(),
  HUGGINGFACE_MODEL: str({ default: "stabilityai/stable-diffusion-2" }),

  // Story Protocol Configuration
  PRIVATE_KEY: str({
    desc: "Private key for the wallet (for testing only)",
    example: "0x1234..."
  }),
  RPC_URL: url({
    desc: "Base Sepolia RPC URL",
    default: "https://sepolia.base.org"
  }),
  CHAIN_ID: str({
    desc: "Base Sepolia Chain ID",
    default: "84532"
  }),
  SPG_NFT_CONTRACT: str({
    desc: "Story Protocol SPG NFT Contract",
    example: "0x1234..."
  }),
  ROYALTY_POLICY: str({
    desc: "Royalty Policy Contract Address",
    example: "0x1234..."
  }),
  WIP_TOKEN: str({
    desc: "WIP Token Address",
    example: "0x1234..."
  }),
  NFT_CONTRACT_ADDRESS: str(),

  // IPFS Configuration
  IPFS_API_KEY: str({
    desc: "IPFS API Key (e.g., Pinata)",
    default: ""
  }),
  IPFS_API_SECRET: str({
    desc: "IPFS API Secret",
    default: ""
  }),
  IPFS_GATEWAY: str({ default: 'https://ipfs.io/ipfs/' }),
  IPFS_DATA_DIR: str({ default: 'data/ipfs' }),
  IPFS_PIN_METADATA: bool({ default: true }),
  IPFS_TIMEOUT_MS: num({ default: 30000 }),
  IPFS_MAX_RETRIES: num({ default: 3 }),

  // Wallet Configuration
  WALLET_PRIVATE_KEY: str(),
  RPC_PROVIDER_URL: str(),

  // Pinata Configuration
  PINATA_JWT: str({
    desc: 'Pinata JWT token for API authentication',
    example: 'eyJhbGc...'
  }),
  PINATA_GATEWAY_URL: str({
    desc: 'Pinata dedicated gateway URL',
    example: 'your-gateway.mypinata.cloud',
    default: 'gateway.pinata.cloud'
  }),
  PINATA_DEDICATED_GATEWAY: bool({
    desc: 'Whether to use a dedicated Pinata gateway',
    default: false
  }),
});
