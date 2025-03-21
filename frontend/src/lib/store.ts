import { create } from "zustand";

interface AppState {
    isWalletConnected: boolean;
    walletAddress: string | null;
    isGenerating: boolean;
    generatedImage: string | null;
    setWalletConnected: (isConnected: boolean, address: string | null) => void;
    setGenerating: (isGenerating: boolean) => void;
    setGeneratedImage: (image: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    isWalletConnected: false,
    walletAddress: null,
    isGenerating: false,
    generatedImage: null,
    setWalletConnected: (isConnected, address) =>
        set({ isWalletConnected: isConnected, walletAddress: address }),
    setGenerating: (isGenerating) => set({ isGenerating }),
    setGeneratedImage: (image) => set({ generatedImage: image }),
})); 