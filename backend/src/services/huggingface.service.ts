import { HfInference } from "@huggingface/inference";
import { config } from "../config/env";

class HfService {
  private static instance: HfInference;

  static {
    this.instance = new HfInference(config.HUGGINGFACE_MODEL);
  }

  static async generateImage(params: {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
    format?: string;
    model?: string;
  }): Promise<Buffer> {
    try {
      const response = await this.instance.textToImage({
        model: params.model || config.HUGGINGFACE_MODEL,
        inputs: params.prompt,
        negative_prompt: params.negativePrompt,
        parameters: {
          width: params.width,
          height: params.height,
        },
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert to PNG if requested
      if (params.format === "png") {
        const sharp = require("sharp");
        return await sharp(buffer).png().toBuffer();
      }

      return buffer;
    } catch (error) {
      throw new Error(
        `Hugging Face API error: ${error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export { HfService };
