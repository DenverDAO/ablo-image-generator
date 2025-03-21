import { ImageGenerationForm } from './ImageGenerationForm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAppStore } from '@/lib/store';
import { Button } from './ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { web3Service } from '@/lib/web3Service';
import { useState, useEffect } from 'react';
import { formatAddress } from '@/lib/web3';

export function ImageGenerator() {
  const { generatedImage, imageMetadata, startMinting, isGenerating } =
    useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  // Check for connected account on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const account = await web3Service.getAccount();
        if (account) {
          setConnectedAccount(account);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  const handleMint = async () => {
    if (!generatedImage) return;

    try {
      await startMinting();
    } catch (error) {
      console.error('Error starting minting process:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if we're on the correct network
      const isCorrectNetwork = await web3Service.isCorrectNetwork();
      if (!isCorrectNetwork) {
        await web3Service.switchToBaseSepoliaNetwork();
      }

      // Connect wallet
      await web3Service.connectWallet();

      // Get connected account
      const account = await web3Service.getAccount();
      setConnectedAccount(account);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Generate an AI Image</CardTitle>

          {!connectedAccount ? (
            <Button
              variant="outline"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Wallet'
              )}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Connected: {formatAddress(connectedAccount)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageGenerationForm />

        {generatedImage && (
          <div className="mt-8 space-y-4">
            <div className="border rounded-lg overflow-hidden w-full aspect-square">
              <img
                src={generatedImage}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleMint}
                disabled={isGenerating || !connectedAccount}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Mint as NFT
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
