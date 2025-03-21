import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { toast } from 'sonner';

const injected = injectedModule();

export const BASE_SEPOLIA_CHAIN = {
    id: '0x14a34',
    token: 'ETH',
    label: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
};

const chains = [BASE_SEPOLIA_CHAIN];

export const web3Onboard = Onboard({
    wallets: [injected],
    chains,
    appMetadata: {
        name: 'Ablo Image Generator',
        icon: '<svg>...</svg>', // TODO: Add app icon
        description: 'Generate and mint AI images as NFTs',
    },
    connect: {
        autoConnectLastWallet: true,
    },
    accountCenter: {
        mobile: {
            enabled: false,
        },
        desktop: {
            enabled: false,
        },
    },
    notify: {
        desktop: {
            enabled: false,
            transactionHandler: () => { },
        },
    },
}); 