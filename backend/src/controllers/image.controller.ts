import { Response } from "express";
import { HfService } from "../services/huggingface.service";
import { StoryProtocolService } from "../services/storyprotocol.service";
import { GenerateImageRequest, RegisterImageRequest } from "../types/requests";

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
    } = req.body;

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

export const registerImage = async (
  req: RegisterImageRequest,
  res: Response
) => {
  try {
    const {
      imageData,
      prompt,
      model,
      format = "jpeg",
      creator,
    } = req.body;

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageData, 'base64');

    // Register image as IP Asset
    const result = await StoryProtocolService.getInstance().registerImage(
      imageBuffer,
      prompt,
      model,
      format,
      creator
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "IP Asset registration failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
