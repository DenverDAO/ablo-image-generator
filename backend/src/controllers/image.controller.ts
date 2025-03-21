import { Request, Response } from 'express';
import { HfService } from '../services/huggingface.service';
import { StoryProtocolService } from '../services/storyprotocol.service';
import { logger } from '../utils/logger';

interface GenerateImageRequest extends Request {
  body: {
    prompt: string;
    style?: string;
    model?: string;
    format?: string;
    negativePrompt?: string;
    width?: number;
    height?: number;
  };
}

interface RegisterImageRequest extends Request {
  body: {
    imageData: string;
    prompt: string;
    style?: string;
    model?: string;
    format?: string;
    creator?: string;
  };
}

/**
 * Generate an image using Hugging Face's text-to-image model
 */
export const generateImage = async (req: GenerateImageRequest, res: Response) => {
  try {
    const {
      prompt,
      style,
      model,
      format = "jpeg",
      negativePrompt,
      width = 512,
      height = 512,
    } = req.body;

    const imageBuffer = await HfService.generateImage({
      prompt,
      model,
      format,
      negativePrompt,
      width,
      height,
    });

    res.json({
      image: imageBuffer.toString('base64'),
      mimeType: format === 'png' ? 'image/png' : 'image/jpeg',
    });
  } catch (error) {
    logger.error('Error generating image:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Register an image as an IP Asset on Story Protocol
 */
export const registerImage = async (req: RegisterImageRequest, res: Response) => {
  try {
    const {
      imageData,
      prompt,
      style,
      model,
      format = "jpeg",
      creator,
    } = req.body;

    // Get Story Protocol service instance
    const storyProtocolService = await StoryProtocolService.getInstance();

    // Register image as IP Asset
    const result = await storyProtocolService.registerImage(
      imageData,
      prompt,
      style
    );

    res.json({
      success: true,
      transactionHash: result,
    });
  } catch (error) {
    logger.error('Error registering image:', error);
    res.status(500).json({
      error: 'Failed to register image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
