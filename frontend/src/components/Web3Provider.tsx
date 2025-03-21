import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../lib/web3';
import { toast } from 'sonner';

// Create a client for React Query
const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

// Helper hook to handle wallet errors
export function useHandleWalletError() {
  return (error: Error) => {
    console.error('Wallet error:', error);

    // Parse known wallet errors
    if (error.message.includes('user rejected')) {
      toast.error('Transaction rejected by user');
    } else if (error.message.includes('insufficient funds')) {
      toast.error('Insufficient funds for transaction');
    } else {
      toast.error('Wallet error: ' + error.message);
    }
  };
}
