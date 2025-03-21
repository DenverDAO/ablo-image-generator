import { Request, Response } from 'express';
import { HfService } from '../services/huggingface.service';
import { StoryProtocolService } from '../services/storyprotocol.service';
import { IpfsService } from '../services/ipfs.service';
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

interface PrepareMetadataRequest extends Request {
  body: {
    imageUrl: string;
    prompt: string;
    style?: string;
  };
}

interface VerifyMintRequest extends Request {
  body: {
    txHash: string;
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

/**
 * Prepare metadata for an image, uploading it to IPFS and creating the necessary metadata
 */
export const prepareMetadata = async (req: PrepareMetadataRequest, res: Response) => {
  try {
    const { imageUrl, prompt, style } = req.body;

    // Convert base64 to buffer (assuming imageUrl is base64 encoded)
    const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Get IPFS service instance
    const ipfsService = await IpfsService.getInstance();

    // Upload image to IPFS
    const imageIpfsHash = await ipfsService.storeFile(imageBuffer, {
      name: `ai-generated-image-${Date.now()}`,
      metadata: {
        prompt,
        style: style || 'default'
      }
    });
    const imageIpfsUrl = `ipfs://${imageIpfsHash}`;

    // Create metadata
    const metadata = {
      name: `AI Generated Art: ${prompt.substring(0, 50)}...`,
      description: `AI generated image with prompt: ${prompt}${style ? ` in style: ${style}` : ''}`,
      image: imageIpfsUrl,
      attributes: [
        {
          trait_type: 'Prompt',
          value: prompt
        },
        {
          trait_type: 'Style',
          value: style || 'Default'
        },
        {
          trait_type: 'Generator',
          value: 'Ablo Image Generator'
        }
      ]
    };

    // Upload metadata to IPFS
    const metadataIpfsHash = await ipfsService.storeMetadata(metadata, {
      name: `ai-generated-metadata-${Date.now()}`
    });
    const metadataIpfsUrl = `ipfs://${metadataIpfsHash}`;

    // Create IP metadata for Story Protocol
    const ipMetadata = {
      ipMetadataURI: metadataIpfsUrl,
      ipMetadataHash: metadataIpfsHash,
      nftMetadataURI: metadataIpfsUrl,
      nftMetadataHash: metadataIpfsHash
    };

    res.json({
      imageIpfsHash,
      metadataIpfsHash,
      ipMetadata
    });
  } catch (error) {
    logger.error('Error preparing metadata:', error);
    res.status(500).json({
      error: 'Failed to prepare metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Verify a mint transaction and get IP Asset details
 */
export const verifyMint = async (req: VerifyMintRequest, res: Response) => {
  try {
    const { txHash } = req.body;

    // Get Story Protocol service instance
    const storyProtocolService = await StoryProtocolService.getInstance();

    // Wait for transaction to be mined and get the IP Asset details
    const assetDetails = await storyProtocolService.getAssetDetails(txHash);

    if (!assetDetails) {
      return res.json({
        status: 'pending',
        message: 'Transaction is still being processed'
      });
    }

    res.json({
      status: 'success',
      ipAssetId: assetDetails.ipAssetId,
      tokenId: assetDetails.tokenId
    });
  } catch (error) {
    logger.error('Error verifying mint:', error);
    res.status(500).json({
      status: 'failed',
      error: 'Failed to verify mint',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
