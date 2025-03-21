import dotenv from "dotenv";
import { cleanEnv, str, port, url, num, bool, makeValidator } from "envalid";
import { isAddress } from "viem";

dotenv.config();

const ethereumAddress = makeValidator<`0x${string}`>((input) => {
  if (!input) throw new Error('Missing required environment variable');
  if (!isAddress(input)) throw new Error(`Invalid Ethereum address: ${input}`);
  return input as `0x${string}`;
});

const ethereumKey = makeValidator<`0x${string}`>((input) => {
  if (!input) throw new Error('Missing required environment variable');
  const key = input.startsWith('0x') ? input : `0x${input}`;
  return key as `0x${string}`;
});

export const config = cleanEnv(process.env, {
  // Server Configuration
  PORT: num({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  CORS_ORIGIN: str({ default: '*' }),

  // Hugging Face Configuration
  HUGGINGFACE_ACCESS_TOKEN: str(),
  HUGGINGFACE_MODEL: str({ default: "stabilityai/stable-diffusion-2" }),

  // Story Protocol Configuration
  PRIVATE_KEY: ethereumKey({
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
  SPG_NFT_CONTRACT: ethereumAddress({
    desc: "Story Protocol SPG NFT Contract",
    example: "0x1234..."
  }),
  ROYALTY_POLICY: ethereumAddress({
    desc: "Royalty Policy Contract Address",
    example: "0x1234..."
  }),
  WIP_TOKEN: ethereumAddress({
    desc: "WIP Token Address",
    example: "0x1234..."
  }),
  NFT_CONTRACT_ADDRESS: ethereumAddress(),

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
  WALLET_PRIVATE_KEY: ethereumKey(),
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
