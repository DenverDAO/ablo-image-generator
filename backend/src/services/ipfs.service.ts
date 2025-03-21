import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { FsBlockstore } from 'blockstore-fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { logger } from '../utils/logger';
import { config } from '../config/env';
import axios from 'axios';
import { PinataService } from './pinata.service';
import { createLibp2p } from 'libp2p';

export class IpfsService {
    private static instance: IpfsService;
    private helia: any;
    private fs: any;
    private pinataService: PinataService;
    private readonly dataDir: string;
    private readonly maxRetries: number;
    private readonly timeoutMs: number;

    private constructor() {
        this.dataDir = config.IPFS_DATA_DIR;
        this.maxRetries = config.IPFS_MAX_RETRIES;
        this.timeoutMs = config.IPFS_TIMEOUT_MS;
        this.pinataService = PinataService.getInstance();
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
            // Ensure data directory exists
            await mkdir(this.dataDir, { recursive: true });
            logger.info(`IPFS data directory ensured at: ${this.dataDir}`);

            // Initialize Helia with filesystem blockstore
            const blockstore = new FsBlockstore(join(this.dataDir, 'blocks'));
            const libp2p = await createLibp2p();

            this.helia = await createHelia({
                libp2p,
                blockstore
            });

            this.fs = unixfs(this.helia);
            logger.info('IPFS service initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize IPFS service:', error);
            throw error;
        }
    }

    /**
     * Stores a file in IPFS and pins it to Pinata
     * @param content File content as Buffer
     * @param options Optional metadata for Pinata
     * @returns CID of the stored file
     */
    async storeFile(content: Buffer, options?: { name?: string; metadata?: Record<string, string> }): Promise<string> {
        try {
            // Store in local IPFS node
            const cid = await this.fs.addBytes(content);
            logger.info(`File stored in local IPFS with CID: ${cid}`);

            // Pin to Pinata for persistence
            const pinataCid = await this.pinataService.pinFile(content, {
                name: options?.name,
                keyvalues: options?.metadata
            });

            if (cid.toString() !== pinataCid) {
                logger.warn(`CID mismatch: Local ${cid}, Pinata ${pinataCid}`);
            }

            return pinataCid;
        } catch (error) {
            logger.error('Error storing file:', error);
            throw error;
        }
    }

    /**
     * Stores metadata in IPFS and pins it to Pinata
     * @param metadata Metadata object
     * @param options Optional Pinata metadata
     * @returns CID of the stored metadata
     */
    async storeMetadata(metadata: object, options?: { name?: string }): Promise<string> {
        try {
            const content = JSON.stringify(metadata);
            const contentBuffer = Buffer.from(content);

            // Store in local IPFS node
            const cid = await this.fs.addBytes(contentBuffer);
            logger.info(`Metadata stored in local IPFS with CID: ${cid}`);

            // Pin to Pinata for persistence
            const pinataCid = await this.pinataService.pinJSON(metadata, {
                name: options?.name
            });

            if (cid.toString() !== pinataCid) {
                logger.warn(`CID mismatch: Local ${cid}, Pinata ${pinataCid}`);
            }

            return pinataCid;
        } catch (error) {
            logger.error('Error storing metadata:', error);
            throw error;
        }
    }

    /**
     * Retrieves content from IPFS with fallback to Pinata gateway
     * @param cid Content identifier
     * @returns Content as string
     */
    async getContent(cid: string): Promise<string> {
        let content: string | undefined;
        let error: Error | undefined;

        // Try local IPFS node first
        try {
            const chunks = [];
            for await (const chunk of this.fs.cat(cid)) {
                chunks.push(chunk);
            }
            content = Buffer.concat(chunks).toString();
            logger.info(`Content retrieved from local IPFS: ${cid}`);
            return content;
        } catch (e) {
            error = e as Error;
            logger.warn(`Failed to retrieve from local IPFS: ${e.message}`);
        }

        // Fallback to Pinata gateway
        try {
            content = await this.pinataService.getContent(cid);
            logger.info(`Content retrieved from Pinata gateway: ${cid}`);
            return content;
        } catch (e) {
            logger.error('Failed to retrieve content from both local and Pinata:', e);
            throw error || e;
        }
    }

    /**
     * Gets metadata from IPFS
     * @param cid Content identifier
     * @returns Parsed metadata object
     */
    async getMetadata(cid: string): Promise<any> {
        const content = await this.getContent(cid);
        try {
            return JSON.parse(content);
        } catch (error) {
            logger.error('Error parsing metadata:', error);
            throw new Error('Invalid metadata format');
        }
    }

    /**
     * Gets the gateway URL for a CID
     * @param cid The CID to get the URL for
     * @returns The Pinata gateway URL
     */
    getGatewayUrl(cid: string): string {
        return this.pinataService.getGatewayUrl(cid);
    }
} 