const API_BASE_URL = 'http://localhost:3000/api';

export interface GenerateImageRequest {
    prompt: string;
    style: string;
}

export interface GenerateImageResponse {
    imageUrl: string;
    ipfsHash: string;
}

export interface PrepareMetadataRequest {
    imageUrl: string;
    prompt: string;
    style: string;
}

export interface PrepareMetadataResponse {
    imageIpfsHash: string;
    metadataIpfsHash: string;
    ipMetadata: {
        ipMetadataURI: string;
        ipMetadataHash: string;
        nftMetadataURI: string;
        nftMetadataHash: string;
    };
}

export interface VerifyMintRequest {
    txHash: string;
}

export interface VerifyMintResponse {
    status: 'success' | 'pending' | 'failed';
    ipAssetId?: string;
    tokenId?: string;
    error?: string;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `API request failed with status ${response.status}`);
        }

        return response.json();
    }

    async generateImage(
        data: GenerateImageRequest
    ): Promise<GenerateImageResponse> {
        return this.request<GenerateImageResponse>('/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async prepareMetadata(
        data: PrepareMetadataRequest
    ): Promise<PrepareMetadataResponse> {
        return this.request<PrepareMetadataResponse>('/prepare-metadata', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async verifyMint(
        data: VerifyMintRequest
    ): Promise<VerifyMintResponse> {
        return this.request<VerifyMintResponse>('/verify-mint', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiService = new ApiService(); 