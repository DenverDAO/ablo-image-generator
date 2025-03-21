import { createStoryClient } from '@story-protocol/core-sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { config } from '../config/env';
import sharp from 'sharp';
import crypto from 'crypto';

/**
 * Service for handling Story Protocol blockchain interactions
 */
export class StoryProtocolService {
    private static instance: StoryProtocolService;
    private storyClient: any; // TODO: Add proper type from SDK
    private readonly pilTerms = {
        transferable: true,
        royaltyPolicy: config.royaltyPolicy,
        defaultMintingFee: 0n,
        expiration: 0n,
        commercialUse: true,
        commercialAttribution: true,
        commercializerChecker: '0x0000000000000000000000000000000000000000',
        commercializerCheckerData: '0x0000000000000000000000000000000000000000',
        commercialRevShare: 50, // 50% revenue share
        commercialRevCeiling: 0n,
        derivativesAllowed: true,
        derivativesAttribution: true,
        derivativesApproval: false,
        derivativesReciprocal: true,
        derivativeRevCeiling: 0n,
        currency: config.wipToken,
        uri: '',
    };

    private constructor() {
        this.initializeClient();
    }

    /**
     * Initialize the Story Protocol client with wallet and network configuration
     */
    private initializeClient(): void {
        try {
            const account = privateKeyToAccount(config.privateKey as `0x${string}`);
            const walletClient = createWalletClient({
                account,
                chain: baseSepolia,
                transport: http(config.rpcUrl)
            });

            this.storyClient = createStoryClient({
                chain: baseSepolia,
                account,
                walletClient,
                rpcUrl: config.rpcUrl
            });
        } catch (error) {
            throw new Error(`Failed to initialize Story Protocol client: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get singleton instance of the service
     */
    public static getInstance(): StoryProtocolService {
        if (!StoryProtocolService.instance) {
            StoryProtocolService.instance = new StoryProtocolService();
        }
        return StoryProtocolService.instance;
    }

    /**
     * Hash an image buffer for unique identification
     */
    private async hashImage(imageBuffer: Buffer): Promise<string> {
        return crypto.createHash('sha256').update(imageBuffer).digest('hex');
    }

    /**
     * Create metadata for an IP Asset
     */
    private async createMetadata(
        imageBuffer: Buffer,
        prompt: string,
        model: string,
        format: string,
        creator: string,
        imageUrl: string
    ) {
        const imageInfo = await sharp(imageBuffer).metadata();
        const imageHash = await this.hashImage(imageBuffer);

        return {
            title: `AI Generated Image: ${prompt.substring(0, 30)}...`,
            description: prompt,
            prompt,
            model,
            creator,
            creationDate: new Date().toISOString(),
            width: imageInfo.width,
            height: imageInfo.height,
            format,
            imageHash,
            imageUrl,
            license: 'Creative Commons with Attribution',
            attributionText: `AI image created by ${creator} using ${model}`
        };
    }

    /**
     * Register an image as an IP Asset on Story Protocol
     */
    public async registerImage(
        imageBuffer: Buffer,
        prompt: string,
        model: string,
        format: string,
        creator: string
    ) {
        try {
            // TODO: Implement IPFS upload
            const mockImageUrl = 'https://placeholder-for-ipfs-url.com';

            // Create and prepare metadata
            const metadata = await this.createMetadata(
                imageBuffer,
                prompt,
                model,
                format,
                creator,
                mockImageUrl
            );

            // Hash metadata for blockchain storage
            const metadataHash = crypto.createHash('sha256')
                .update(JSON.stringify(metadata))
                .digest('hex') as `0x${string}`;

            // TODO: Upload metadata to IPFS
            const mockMetadataUrl = 'https://placeholder-for-ipfs-metadata-url.com';

            // Register as IP Asset
            const response = await this.storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms({
                spgNftContract: config.spgNftContract,
                licenseTermsData: [{ terms: this.pilTerms }],
                ipMetadata: {
                    ipMetadataURI: mockMetadataUrl,
                    ipMetadataHash: `0x${metadataHash}`,
                    nftMetadataHash: `0x${metadataHash}`,
                    nftMetadataURI: mockMetadataUrl,
                },
                txOptions: { waitForTransaction: true },
            });

            return {
                success: true,
                ipAssetId: response.ipId,
                tokenId: response.tokenId,
                licenseTermsId: response.licenseTermsIds?.[0],
                transactionHash: response.txHash,
                metadata
            };
        } catch (error) {
            throw new Error(`Failed to register image as IP Asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
} 