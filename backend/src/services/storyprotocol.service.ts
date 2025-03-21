import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { config } from '../config/env';
import { IpfsService } from './ipfs.service';
import { logger } from '../utils/logger';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { toHex } from 'viem';
import axios from 'axios';

interface ImageMetadata {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
        trait_type: string;
        value: string;
    }>;
}

interface IpMetadata {
    ipMetadataURI: string;
    ipMetadataHash: `0x${string}`;
    nftMetadataURI: string;
    nftMetadataHash: `0x${string}`;
}

/**
 * Service for handling Story Protocol blockchain interactions
 */
export class StoryProtocolService {
    private static instance: StoryProtocolService;
    private client: StoryClient;
    private ipfsService: IpfsService;

    constructor(ipfsService: IpfsService) {
        if (!config.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY is required for Story Protocol service");
        }

        const account = privateKeyToAccount(config.PRIVATE_KEY);
        const storyConfig: StoryConfig = {
            transport: http(config.RPC_URL),
            account,
            chainId: "aeneid", // Story Protocol testnet
        };

        this.client = StoryClient.newClient(storyConfig);
        this.ipfsService = ipfsService;
        logger.info('StoryProtocolService initialized');
    }

    /**
     * Get singleton instance of the service
     */
    public static async getInstance(): Promise<StoryProtocolService> {
        if (!StoryProtocolService.instance) {
            StoryProtocolService.instance = new StoryProtocolService(await IpfsService.getInstance());
        }
        return StoryProtocolService.instance;
    }

    /**
     * Register an image as an IP Asset
     * @param imageUrl The URL of the image
     * @param prompt The prompt used to generate the image
     * @param style The style of the image
     * @returns Transaction hash
     */
    public async registerImage(imageUrl: string, prompt: string, style?: string): Promise<string> {
        try {
            // Download image from URL to buffer
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);

            // Upload image to IPFS
            const imageHash = await this.ipfsService.storeFile(imageBuffer);
            if (!imageHash) {
                throw new Error("Failed to upload image to IPFS");
            }

            // Create and upload metadata
            const metadata: ImageMetadata = {
                name: "AI Generated Image",
                description: prompt,
                image: `ipfs://${imageHash}`,
                attributes: [
                    {
                        trait_type: "Prompt",
                        value: prompt,
                    },
                    {
                        trait_type: "Style",
                        value: style || "Default",
                    },
                ],
            };

            // Upload metadata to IPFS
            const metadataHash = await this.ipfsService.storeMetadata(metadata);
            if (!metadataHash) {
                throw new Error("Failed to upload metadata to IPFS");
            }

            // Register with Story Protocol
            const tx = await this.client.ipAsset.mintAndRegisterIp({
                spgNftContract: config.SPG_NFT_CONTRACT,
                ipMetadata: {
                    ipMetadataURI: `ipfs://${metadataHash}`,
                    ipMetadataHash: toHex(metadataHash, { size: 32 }),
                    nftMetadataURI: `ipfs://${metadataHash}`,
                    nftMetadataHash: toHex(metadataHash, { size: 32 }),
                },
                txOptions: {
                    waitForTransaction: true,
                },
            });

            if (!tx.txHash) {
                throw new Error("Transaction hash not found in response");
            }

            logger.info('IP Asset registered successfully', { txHash: tx.txHash });
            return tx.txHash;
        } catch (error) {
            logger.error("Error in registerImage:", error);
            throw error;
        }
    }

    /**
     * Retrieves IP asset details using Story Protocol's HTTP API
     * @see https://docs.story.foundation/reference/post_api-v3-assets
     */
    async getAssetDetails(tokenId: string) {
        try {
            // Use the HTTP API to get asset details since the SDK doesn't expose a direct method
            const response = await axios.get(`${config.RPC_URL}/api/v3/assets/${config.SPG_NFT_CONTRACT}/${tokenId}`);
            return response.data;
        } catch (error) {
            logger.error("Error in getAssetDetails:", error);
            throw error;
        }
    }
} 