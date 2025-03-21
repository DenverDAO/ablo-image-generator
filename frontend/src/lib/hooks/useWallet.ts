import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '../store';
import { BASE_SEPOLIA_CHAIN } from '../web3';

export function useWallet() {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
    const { setWalletConnected, setNetworkId } = useAppStore();

    useEffect(() => {
        // Update global state when wallet connection changes
        if (wallet) {
            const address = wallet.accounts[0].address;
            setWalletConnected(true, address);
            setNetworkId(connectedChain?.id || null);

            // Check if we're on the correct network
            if (connectedChain?.id !== BASE_SEPOLIA_CHAIN.id) {
                toast.warning("Please switch to Base Sepolia network");
                handleNetworkSwitch();
            }
        } else {
            setWalletConnected(false, null);
            setNetworkId(null);
        }
    }, [wallet, connectedChain?.id, setWalletConnected, setNetworkId]);

    const handleNetworkSwitch = async () => {
        try {
            const success = await setChain({ chainId: BASE_SEPOLIA_CHAIN.id });
            if (success) {
                setNetworkId(BASE_SEPOLIA_CHAIN.id);
                toast.success("Successfully switched to Base Sepolia");
            } else {
                toast.error("Failed to switch network");
            }
        } catch (error) {
            console.error("Network switch error:", error);
            toast.error("Failed to switch network");
        }
    };

    return {
        wallet,
        connecting,
        settingChain,
        connect,
        disconnect,
        handleNetworkSwitch,
        address: wallet?.accounts[0]?.address,
        isConnected: !!wallet,
        isCorrectNetwork: connectedChain?.id === BASE_SEPOLIA_CHAIN.id,
    };
} 