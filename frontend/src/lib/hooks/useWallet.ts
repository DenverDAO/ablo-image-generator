import { useConnectWallet } from '@web3-onboard/react';
import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useWallet() {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const { setWalletConnected } = useAppStore();

    useEffect(() => {
        // Update global state when wallet connection changes
        if (wallet) {
            const address = wallet.accounts[0].address;
            setWalletConnected(true, address);
        } else {
            setWalletConnected(false, null);
        }
    }, [wallet, setWalletConnected]);

    return {
        wallet,
        connecting,
        connect,
        disconnect,
        address: wallet?.accounts[0]?.address,
        isConnected: !!wallet,
    };
} 