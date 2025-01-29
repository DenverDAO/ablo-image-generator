import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  corsOrigin: string;
  huggingfaceToken: string;
  huggingfaceModel: string;
}

const validateConfig = (): Config => {
  const port = parseInt(process.env.PORT || "7860");
  if (!(port >= 0 || port <= 65535)) {
    throw new Error("Port must be between 0 and 65535");
  }

  if (
    !process.env.HUGGINGFACE_ACCESS_TOKEN ||
    process.env.HUGGINGFACE_ACCESS_TOKEN ===
      "your_huggingface_access_token_here"
  ) {
    console.warn(
      "HUGGINGFACE_ACCESS_TOKEN is required to access one's own services, you can get one at https://huggingface.co/settings/tokens"
    );
  }

  if (!process.env.CORS_ORIGIN) {
    console.warn(
      "If developing locally, CORS_ORIGIN is required in .env for your frontend to function properly"
    );
  }

  return {
    port,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    huggingfaceToken: process.env.HUGGINGFACE_ACCESS_TOKEN,
    huggingfaceModel:
      process.env.HUGGINGFACE_MODEL || "black-forest-labs/FLUX.1-schnell",
  };
};

export const config = validateConfig();
