import { Response } from "express";
import { HfService } from "../services/huggingface.service";
import { GenerateImageRequest } from "../types/requests";

export const generateImage = async (
  req: GenerateImageRequest,
  res: Response
) => {
  try {
    const { prompt, negativePrompt, width = 512, height = 512 } = req.body;

    const imageBuffer = await HfService.generateImage({
      prompt,
      negativePrompt,
      width,
      height,
    });

    res.json({
      image: imageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    });
  } catch (error) {
    res.status(500).json({
      error: "Image generation failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
