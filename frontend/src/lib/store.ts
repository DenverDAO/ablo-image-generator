import { create } from "zustand";

interface ImageMetadata {
    prompt: string;
    style: string;
}

interface AppState {
    isWalletConnected: boolean;
    walletAddress: string | null;
    isGenerating: boolean;
    isMinting: boolean;
    generatedImage: string | null;
    imageMetadata: ImageMetadata | null;
    networkId: string | null;
    mintedNft: {
        transactionHash: string;
        ipAssetId: string;
        nftTokenId: string;
    } | null;
    setWalletConnected: (isConnected: boolean, address: string | null) => void;
    setGenerating: (isGenerating: boolean) => void;
    setMinting: (isMinting: boolean) => void;
    setGeneratedImage: (image: string | null, metadata?: ImageMetadata | null) => void;
    setNetworkId: (networkId: string | null) => void;
    setMintedNft: (nft: AppState['mintedNft']) => void;
    reset: () => void;
}

const initialState = {
    isWalletConnected: false,
    walletAddress: null,
    isGenerating: false,
    isMinting: false,
    generatedImage: null,
    imageMetadata: null,
    networkId: null,
    mintedNft: null,
};

export const useAppStore = create<AppState>((set) => ({
    ...initialState,
    setWalletConnected: (isConnected, address) =>
        set({ isWalletConnected: isConnected, walletAddress: address }),
    setGenerating: (isGenerating) => set({ isGenerating }),
    setMinting: (isMinting) => set({ isMinting }),
    setGeneratedImage: (image, metadata = null) =>
        set({ generatedImage: image, imageMetadata: metadata }),
    setNetworkId: (networkId) => set({ networkId }),
    setMintedNft: (nft) => set({ mintedNft: nft }),
    reset: () => set(initialState),
})); 