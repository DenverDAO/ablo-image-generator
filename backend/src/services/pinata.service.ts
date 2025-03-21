import { env } from '../config/env';
import { logger } from '../utils/logger';

interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
}

interface PinataMetadata {
    name?: string;
    keyvalues?: Record<string, string>;
}

export class PinataService {
    private static instance: PinataService;
    private readonly jwt: string;
    private readonly gatewayUrl: string;
    private readonly useDedicatedGateway: boolean;

    private constructor() {
        this.jwt = env.PINATA_JWT;
        this.gatewayUrl = env.PINATA_GATEWAY_URL;
        this.useDedicatedGateway = env.PINATA_DEDICATED_GATEWAY;
    }

    public static getInstance(): PinataService {
        if (!PinataService.instance) {
            PinataService.instance = new PinataService();
        }
        return PinataService.instance;
    }

    /**
     * Pins a file to IPFS via Pinata
     * @param file Buffer or ReadStream of the file to pin
     * @param metadata Optional metadata for the pin
     * @returns CID of the pinned file
     */
    async pinFile(file: Buffer, metadata?: PinataMetadata): Promise<string> {
        try {
            const formData = new FormData();
            formData.append('file', new Blob([file]));

            if (metadata) {
                formData.append('pinataMetadata', JSON.stringify(metadata));
            }

            const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.jwt}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to pin file: ${response.statusText}`);
            }

            const data = await response.json() as PinataResponse;
            logger.info(`File pinned successfully with CID: ${data.IpfsHash}`);
            return data.IpfsHash;
        } catch (error) {
            logger.error('Error pinning file to Pinata:', error);
            throw error;
        }
    }

    /**
     * Pins JSON metadata to IPFS via Pinata
     * @param metadata The metadata object to pin
     * @param pinataMetadata Optional Pinata-specific metadata
     * @returns CID of the pinned metadata
     */
    async pinJSON(metadata: object, pinataMetadata?: PinataMetadata): Promise<string> {
        try {
            const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.jwt}`
                },
                body: JSON.stringify({
                    pinataContent: metadata,
                    pinataMetadata
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to pin JSON: ${response.statusText}`);
            }

            const data = await response.json() as PinataResponse;
            logger.info(`JSON pinned successfully with CID: ${data.IpfsHash}`);
            return data.IpfsHash;
        } catch (error) {
            logger.error('Error pinning JSON to Pinata:', error);
            throw error;
        }
    }

    /**
     * Retrieves content from IPFS using Pinata gateway
     * @param cid The CID of the content to retrieve
     * @returns The content as a string
     */
    async getContent(cid: string): Promise<string> {
        try {
            const baseUrl = this.useDedicatedGateway
                ? `https://${this.gatewayUrl}`
                : 'https://gateway.pinata.cloud';

            const response = await fetch(`${baseUrl}/ipfs/${cid}`);

            if (!response.ok) {
                throw new Error(`Failed to retrieve content: ${response.statusText}`);
            }

            return response.text();
        } catch (error) {
            logger.error('Error retrieving content from Pinata:', error);
            throw error;
        }
    }

    /**
     * Unpins content from Pinata
     * @param cid The CID of the content to unpin
     */
    async unpin(cid: string): Promise<void> {
        try {
            const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.jwt}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to unpin content: ${response.statusText}`);
            }

            logger.info(`Content unpinned successfully: ${cid}`);
        } catch (error) {
            logger.error('Error unpinning content from Pinata:', error);
            throw error;
        }
    }

    /**
     * Gets the gateway URL for a CID
     * @param cid The CID to get the URL for
     * @returns The full gateway URL
     */
    getGatewayUrl(cid: string): string {
        const baseUrl = this.useDedicatedGateway
            ? `https://${this.gatewayUrl}`
            : 'https://gateway.pinata.cloud';
        return `${baseUrl}/ipfs/${cid}`;
    }
} 