import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';

const injected = injectedModule();

const chains = [
    {
        id: '0x14a34',
        token: 'ETH',
        label: 'Base Sepolia',
        rpcUrl: 'https://sepolia.base.org',
    },
];

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
}); 