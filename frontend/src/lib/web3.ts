import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const BASE_SEPOLIA_CHAIN = baseSepolia;

// Create wagmi config with baseSepolia chain and injected connector
export const config = createConfig({
    chains: [baseSepolia],
    transports: {
        [baseSepolia.id]: http(),
    },
    connectors: [
        injected(),
    ],
});

// Contract addresses - to be moved to environment variables
export const contractAddresses = {
    spgNftContract: '0x...' // Replace with actual contract address
};

// Helper function to format addresses for display
export function formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper function to check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
}

// Helper function to get etherscan tx url
export function getExplorerTxUrl(txHash: string): string {
    return `${baseSepolia.blockExplorers.default.url}/tx/${txHash}`;
}

// Helper function to get etherscan address url
export function getExplorerAddressUrl(address: string): string {
    return `${baseSepolia.blockExplorers.default.url}/address/${address}`;
} 