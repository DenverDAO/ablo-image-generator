import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/hooks/useWallet';

export function Header() {
  const { connect, disconnect, connecting, address, isConnected, wallet } =
    useWallet();

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
          <Button
            onClick={handleWalletClick}
            disabled={connecting}
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
