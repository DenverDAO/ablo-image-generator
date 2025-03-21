import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { FsBlockstore } from 'blockstore-fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { logger } from '../utils/logger';
import { config } from '../config/env';
import axios from 'axios';

export class IpfsService {
    private static instance: IpfsService;
    private helia: any;
    private fs: any;
    private blockstore: FsBlockstore;

    private constructor() {
        // Create a persistent blockstore in the configured data directory
        this.blockstore = new FsBlockstore(join(process.cwd(), config.IPFS_DATA_DIR));
    }

    public static async getInstance(): Promise<IpfsService> {
        if (!IpfsService.instance) {
            IpfsService.instance = new IpfsService();
            await IpfsService.instance.initialize();
        }
        return IpfsService.instance;
    }

    private async initialize() {
        try {
            // Ensure the data directory exists
            const dataDir = join(process.cwd(), config.IPFS_DATA_DIR);
            await mkdir(dataDir, { recursive: true });
            logger.info(`Ensured IPFS data directory exists at: ${dataDir}`);

            // Create a Helia node with persistent storage
            this.helia = await createHelia({
                blockstore: this.blockstore
            });

            // Create a filesystem to store files
            this.fs = unixfs(this.helia);

            logger.info('IPFS service initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize IPFS service:', error);
            throw error;
        }
    }

    /**
     * Check if a CID exists and is accessible
     * @param cid Content Identifier to check
     * @returns boolean indicating if the CID is accessible
     */
    public async exists(cid: string): Promise<boolean> {
        try {
            // Try to get the data stats without downloading the full content
            await this.fs.stat(cid);
            return true;
        } catch {
            // If local check fails, try the gateway
            try {
                const response = await axios.head(`${config.IPFS_GATEWAY}${cid}`);
                return response.status === 200;
            } catch {
                return false;
            }
        }
    }

    /**
     * Upload data to IPFS and optionally pin it
     * @param data Buffer or string data to upload
     * @param pin Whether to pin the data (default: false)
     * @returns CID (Content Identifier) of the uploaded data
     */
    public async uploadData(data: Buffer | string, pin: boolean = false): Promise<string> {
        try {
            // Convert string to Buffer if needed
            const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);

            // Add the data to IPFS
            const cid = await this.fs.addBytes(buffer);
            const cidString = cid.toString();

            if (pin) {
                await this.pin(cidString);
            }

            logger.info(`Data uploaded to IPFS with CID: ${cidString}`);
            return cidString;
        } catch (error) {
            logger.error('Failed to upload data to IPFS:', error);
            throw error;
        }
    }

    /**
     * Upload metadata object to IPFS
     * @param metadata Object containing metadata
     * @param pin Whether to pin the metadata (uses IPFS_PIN_METADATA from config)
     * @returns CID of the uploaded metadata
     */
    public async uploadMetadata(metadata: Record<string, any>, pin: boolean = config.IPFS_PIN_METADATA): Promise<string> {
        try {
            const metadataString = JSON.stringify(metadata);
            return await this.uploadData(metadataString, pin);
        } catch (error) {
            logger.error('Failed to upload metadata to IPFS:', error);
            throw error;
        }
    }

    /**
     * Pin data to ensure it persists
     * @param cid Content Identifier to pin
     */
    public async pin(cid: string): Promise<void> {
        try {
            await this.helia.pins.add(cid);
            logger.info(`Pinned CID: ${cid}`);
        } catch (error) {
            logger.error(`Failed to pin CID ${cid}:`, error);
            throw error;
        }
    }

    /**
     * Unpin data if it's no longer needed
     * @param cid Content Identifier to unpin
     */
    public async unpin(cid: string): Promise<void> {
        try {
            await this.helia.pins.rm(cid);
            logger.info(`Unpinned CID: ${cid}`);
        } catch (error) {
            logger.error(`Failed to unpin CID ${cid}:`, error);
            throw error;
        }
    }

    /**
     * Retrieve data from IPFS by CID with timeout and retries
     * @param cid Content Identifier
     * @param timeout Timeout in milliseconds (from config)
     * @param retries Number of retries (from config)
     * @returns Retrieved data as Buffer
     */
    public async getData(
        cid: string,
        timeout: number = config.IPFS_TIMEOUT_MS,
        retries: number = config.IPFS_MAX_RETRIES
    ): Promise<Buffer> {
        let lastError: Error | null = null;

        for (let i = 0; i < retries; i++) {
            try {
                const chunks: Uint8Array[] = [];
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                try {
                    for await (const chunk of this.fs.cat(cid, { signal: controller.signal })) {
                        chunks.push(chunk);
                    }
                } finally {
                    clearTimeout(timeoutId);
                }

                return Buffer.concat(chunks);
            } catch (error) {
                lastError = error as Error;
                logger.warn(`Attempt ${i + 1} failed to retrieve data from IPFS for CID ${cid}:`, error);

                // If it's not the last attempt, wait before retrying
                if (i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                }
            }
        }

        logger.error(`Failed to retrieve data from IPFS for CID ${cid} after ${retries} attempts:`, lastError);
        throw lastError;
    }

    /**
     * Retrieve and parse metadata from IPFS
     * @param cid Content Identifier
     * @returns Parsed metadata object
     */
    public async getMetadata<T>(cid: string): Promise<T> {
        try {
            // First check if the CID exists
            const exists = await this.exists(cid);
            if (!exists) {
                throw new Error(`CID ${cid} does not exist or is not accessible`);
            }

            const data = await this.getData(cid);
            return JSON.parse(data.toString()) as T;
        } catch (error) {
            logger.error(`Failed to retrieve metadata from IPFS for CID ${cid}:`, error);
            throw error;
        }
    }
} 