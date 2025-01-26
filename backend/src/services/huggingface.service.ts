import { HfInference } from "@huggingface/inference";
import { config } from "../config/env";

class HfService {
  private static instance: HfInference;

  static {
    this.instance = new HfInference(config.huggingfaceToken);
  }

  static async generateImage(params: {
    prompt: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
  }): Promise<Buffer> {
    try {
      const response = await this.instance.textToImage({
        model: config.huggingfaceModel,
        inputs: params.prompt,
        parameters: {
          negative_prompt: params.negativePrompt,
          width: params.width,
          height: params.height,
        },
      });

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      throw new Error(
        `Hugging Face API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export { HfService };
