import dotenv from "dotenv";
import { cleanEnv, str, port, url } from "envalid";

dotenv.config();

export const config = cleanEnv(process.env, {
  // Server Configuration
  PORT: port({ default: 3000 }),
  CORS_ORIGIN: str({ default: "http://localhost:5173" }),

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

  // IPFS Configuration (TODO: Implement)
  IPFS_API_KEY: str({
    desc: "IPFS API Key (e.g., Pinata)",
    default: ""
  }),
  IPFS_API_SECRET: str({
    desc: "IPFS API Secret",
    default: ""
  }),
  IPFS_GATEWAY: url({
    desc: "IPFS Gateway URL",
    default: "https://gateway.pinata.cloud"
  })
});
