import { StoryClient, StoryConfig, LicenseTerms } from '@story-protocol/core-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { http, toHex, zeroAddress } from 'viem';
import { config } from '../config/env';
import { IpfsService } from './ipfs.service';
import { logger } from '../utils/logger';

/**
 * Service for handling Story Protocol blockchain interactions
 */
export class StoryProtocolService {
    private static instance: StoryProtocolService;
    private client: StoryClient;
    private ipfsService!: IpfsService; // Using definite assignment assertion

    private constructor() {
        const account = privateKeyToAccount(config.PRIVATE_KEY as `0x${string}`);

        const storyConfig: StoryConfig = {
            transport: http(config.RPC_URL),
            account,
            chainId: 'aeneid', // Story Protocol testnet
        };

        this.client = StoryClient.newClient(storyConfig);
    }

    /**
     * Get singleton instance of the service
     */
    public static async getInstance(): Promise<StoryProtocolService> {
        if (!StoryProtocolService.instance) {
            StoryProtocolService.instance = new StoryProtocolService();
            StoryProtocolService.instance.ipfsService = await IpfsService.getInstance();
        }
        return StoryProtocolService.instance;
    }

    /**
     * Register an image as an IP Asset
     * @param imageData Base64 encoded image data
     * @param prompt The prompt used to generate the image
     * @param creator The creator of the image
     * @returns Transaction hash and asset ID
     */
    public async registerImage(imageData: Buffer, prompt: string, creator: string): Promise<{ ipId: string; tokenId: string }> {
        try {
            // Upload image and metadata to IPFS
            const imageIpfsHash = await this.ipfsService.uploadData(imageData);

            const ipMetadata = {
                title: prompt,
                description: `AI-generated image from prompt: ${prompt}`,
                image: `${config.IPFS_GATEWAY}${imageIpfsHash}`,
                imageHash: toHex(imageIpfsHash, { size: 32 }),
                mediaUrl: `${config.IPFS_GATEWAY}${imageIpfsHash}`,
                mediaHash: toHex(imageIpfsHash, { size: 32 }),
                mediaType: 'image/png',
                creators: [
                    {
                        name: creator,
                        address: creator,
                        description: 'AI Image Creator',
                        contributionPercent: 100
                    }
                ]
            };

            const nftMetadata = {
                name: prompt,
                description: `AI-generated image from prompt: ${prompt}`,
                image: `${config.IPFS_GATEWAY}${imageIpfsHash}`
            };

            const ipMetadataIpfsHash = await this.ipfsService.uploadMetadata(ipMetadata);
            const nftMetadataIpfsHash = await this.ipfsService.uploadMetadata(nftMetadata);

            const terms: LicenseTerms = {
                transferable: true,
                royaltyPolicy: config.ROYALTY_POLICY as `0x${string}`,
                defaultMintingFee: 0n,
                expiration: 0n,
                commercialUse: true,
                commercialAttribution: true,
                commercializerChecker: zeroAddress,
                commercializerCheckerData: zeroAddress,
                commercialRevShare: 10_000_000, // 10% revenue share (100_000_000 = 100%)
                commercialRevCeiling: 0n,
                derivativesAllowed: true,
                derivativesAttribution: true,
                derivativesApproval: false,
                derivativesReciprocal: true,
                derivativeRevCeiling: 0n,
                currency: config.WIP_TOKEN as `0x${string}`,
                uri: ''
            };

            // Register the image as an IP asset
            const response = await this.client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
                spgNftContract: config.SPG_NFT_CONTRACT as `0x${string}`,
                ipMetadata: {
                    ipMetadataURI: `${config.IPFS_GATEWAY}${ipMetadataIpfsHash}`,
                    ipMetadataHash: toHex(ipMetadataIpfsHash, { size: 32 }),
                    nftMetadataURI: `${config.IPFS_GATEWAY}${nftMetadataIpfsHash}`,
                    nftMetadataHash: toHex(nftMetadataIpfsHash, { size: 32 })
                },
                licenseTermsData: [{ terms }],
                allowDuplicates: true,
                txOptions: { waitForTransaction: true }
            });

            logger.info('IP Asset registered successfully', {
                txHash: response.txHash,
                ipId: response.ipId,
                tokenId: response.tokenId
            });

            return {
                ipId: response.ipId as string,
                tokenId: response.tokenId?.toString() as string
            };
        } catch (error) {
            logger.error('Failed to register IP asset', { error });
            throw error;
        }
    }

    /**
     * Retrieves IP asset details using Story Protocol's HTTP API
     * @see https://docs.story.foundation/reference/post_api-v3-assets
     */
    async getAssetDetails(assetId: string) {
        try {
            const response = await fetch('https://api.storyapis.com/api/v3/assets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    where: {
                        id: assetId
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch asset details: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data.data?.[0]) {
                throw new Error('Asset not found');
            }

            // If we have IPFS metadata, fetch it
            const asset = data.data[0];
            if (asset.ipMetadataURI) {
                const metadata = await this.ipfsService.getMetadata(asset.ipMetadataURI);
                return { ...asset, metadata };
            }

            return asset;
        } catch (error) {
            logger.error('Error getting IP asset details:', error);
            throw error;
        }
    }
} 