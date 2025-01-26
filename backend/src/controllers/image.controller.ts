import { Response } from "express";
import { HfService } from "../services/huggingface.service";
import { GenerateImageRequest } from "../types/requests";

export const generateImage = async (
  req: GenerateImageRequest,
  res: Response
) => {
  try {
    const {
      model,
      prompt,
      negativePrompt,
      width = 512,
      height = 512,
      format = "jpeg",
    } = req.body as {
      model?: string;
      prompt: string;
      negativePrompt?: string;
      width?: number;
      height?: number;
      format?: string;
    };

    const imageBuffer = await HfService.generateImage({
      model,
      prompt,
      negativePrompt,
      width,
      height,
      format,
    });

    res.json({
      image: imageBuffer.toString("base64"),
      mimeType: format === "png" ? "image/png" : "image/jpeg",
    });
  } catch (error) {
    res.status(500).json({
      error: "Image generation failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
