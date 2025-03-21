import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/hooks/useWallet';

export function Header() {
  const {
    connect,
    disconnect,
    connecting,
    settingChain,
    address,
    isConnected,
    isCorrectNetwork,
    wallet,
    handleNetworkSwitch,
  } = useWallet();

  const handleWalletClick = () => {
    if (isConnected && wallet) {
      disconnect({ label: wallet.label });
    } else {
      connect();
    }
  };

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Ablo Image Generator
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && !isCorrectNetwork && (
            <Button
              onClick={handleNetworkSwitch}
              disabled={settingChain}
              variant="destructive"
              size="sm"
            >
              {settingChain ? 'Switching...' : 'Switch to Base Sepolia'}
            </Button>
          )}
          <Button
            onClick={handleWalletClick}
            disabled={connecting || settingChain}
            variant={isConnected ? 'outline' : 'default'}
          >
            {connecting
              ? 'Connecting...'
              : isConnected
              ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
              : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </header>
  );
}
