const API_BASE_URL = 'http://localhost:3000/api';

export interface GenerateImageRequest {
    prompt: string;
    style: string;
}

export interface GenerateImageResponse {
    imageUrl: string;
    ipfsHash: string;
}

export interface MintNftRequest {
    imageUrl: string;
    prompt: string;
    style: string;
    walletAddress: string;
}

export interface MintNftResponse {
    transactionHash: string;
    ipAssetId: string;
    nftTokenId: string;
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
            throw new Error(error.message || 'API request failed');
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

    async mintNft(data: MintNftRequest): Promise<MintNftResponse> {
        return this.request<MintNftResponse>('/mint', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiService = new ApiService(); 