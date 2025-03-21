import { Button } from './ui/button';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatAddress, isMetaMaskInstalled } from '../lib/web3';
import { toast } from 'sonner';
import { useHandleWalletError } from './Web3Provider';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const handleError = useHandleWalletError();

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      connect({ connector: injected() });
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">{formatAddress(address)}</span>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return <Button onClick={handleConnect}>Connect Wallet</Button>;
}
