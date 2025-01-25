import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  huggingfaceToken: string;
  corsOrigin: string;
  huggingfaceModel: string;
}

const validateConfig = (): Config => {
  const port = parseInt(process.env.PORT || "3000");
  if (!(port >= 0 || port <= 65535)) {
    throw new Error("Port must be between 0 and 65535");
  }

  if (
    !process.env.HUGGINGFACE_ACCESS_TOKEN ||
    process.env.HUGGINGFACE_ACCESS_TOKEN ===
      "your_huggingface_access_token_here"
  ) {
    throw new Error("HUGGINGFACE_ACCESS_TOKEN is required in .env");
  }

  if (!process.env.CORS_ORIGIN) {
    console.warn(
      "CORS_ORIGIN is required in .env for your frontend to function properly"
    );
  }

  return {
    port,
    huggingfaceToken: process.env.HUGGINGFACE_ACCESS_TOKEN,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    huggingfaceModel:
      process.env.HUGGINGFACE_MODEL || "black-forest-labs/FLUX.1-dev",
  };
};

export const config = validateConfig();
