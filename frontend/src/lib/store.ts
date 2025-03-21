import { create } from "zustand";
import { toast } from "sonner";
import { apiService } from "./services/api";
import { web3Service } from "./services/web3Service";
import { getExplorerTxUrl } from "./web3";

interface ImageMetadata {
    prompt: string;
    style: string;
}

interface MintedNft {
    transactionHash: string;
    ipAssetId?: string;
    tokenId?: string;
}

interface AppState {
    isGenerating: boolean;
    isMinting: boolean;
    generatedImage: string | null;
    imageMetadata: ImageMetadata | null;
    mintedNft: MintedNft | null;
    mintStatus: 'idle' | 'preparing' | 'minting' | 'confirming' | 'success' | 'error';
    mintError: string | null;

    // Actions
    setGenerating: (isGenerating: boolean) => void;
    setGeneratedImage: (image: string, metadata: ImageMetadata) => void;
    clearGeneratedImage: () => void;

    // Minting actions
    startMinting: () => Promise<void>;
    reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    isGenerating: false,
    isMinting: false,
    generatedImage: null,
    imageMetadata: null,
    mintedNft: null,
    mintStatus: 'idle',
    mintError: null,

    setGenerating: (isGenerating) => set({ isGenerating }),

    setGeneratedImage: (image, metadata) =>
        set({ generatedImage: image, imageMetadata: metadata }),

    clearGeneratedImage: () =>
        set({ generatedImage: null, imageMetadata: null }),

    startMinting: async () => {
        const { generatedImage, imageMetadata } = get();

        if (!generatedImage || !imageMetadata) {
            toast.error("No image to mint");
            return;
        }

        set({
            isMinting: true,
            mintStatus: 'preparing',
            mintError: null
        });

        try {
            // Step 1: Prepare metadata (this stays on the backend)
            set({ mintStatus: 'preparing' });
            const prepareResult = await apiService.prepareMetadata({
                imageUrl: generatedImage,
                prompt: imageMetadata.prompt,
                style: imageMetadata.style,
            });

            // Step 2: Mint NFT using user's wallet
            set({ mintStatus: 'minting' });
            const { txHash } = await web3Service.mintNft({
                ipMetadata: prepareResult.ipMetadata,
            });

            // Step 3: Set transaction hash immediately
            set({
                mintedNft: {
                    transactionHash: txHash,
                },
                mintStatus: 'confirming',
            });

            // Step 4: Verify transaction status after a delay
            setTimeout(async () => {
                try {
                    const verifyResult = await apiService.verifyMint({
                        txHash,
                    });

                    if (verifyResult.status === 'success') {
                        set({
                            mintedNft: {
                                transactionHash: txHash,
                                ipAssetId: verifyResult.ipAssetId,
                                tokenId: verifyResult.tokenId,
                            },
                            mintStatus: 'success',
                        });

                        toast.success('NFT minted successfully!', {
                            action: {
                                label: 'View Transaction',
                                onClick: () => window.open(getExplorerTxUrl(txHash), '_blank'),
                            },
                        });
                    } else if (verifyResult.status === 'pending') {
                        // Still pending, keep status as confirming
                        toast.info('Transaction still pending. Check back later.', {
                            action: {
                                label: 'View Transaction',
                                onClick: () => window.open(getExplorerTxUrl(txHash), '_blank'),
                            },
                        });
                    } else {
                        // Failed
                        set({
                            mintError: verifyResult.error || 'Transaction failed',
                            mintStatus: 'error',
                        });
                        toast.error(`Minting failed: ${verifyResult.error}`);
                    }
                } catch (error) {
                    console.error("Error verifying mint:", error);
                    // Keep the transaction hash but mark status as error
                    set({
                        mintError: error instanceof Error ? error.message : 'Failed to verify transaction',
                        mintStatus: 'error',
                    });
                    toast.error('Failed to verify transaction status');
                }
            }, 5000); // Check after 5 seconds
        } catch (error) {
            console.error("Minting error:", error);
            set({
                isMinting: false,
                mintStatus: 'error',
                mintError: error instanceof Error ? error.message : 'Unknown error occurred',
            });
            toast.error(error instanceof Error ? error.message : 'Failed to mint NFT');
        }
    },

    reset: () => set({
        isMinting: false,
        mintedNft: null,
        mintStatus: 'idle',
        mintError: null,
    }),
})); 