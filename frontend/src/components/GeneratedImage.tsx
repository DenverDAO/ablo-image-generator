import { useAppStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/hooks/useWallet';
import { apiService } from '@/lib/services/api';
import { toast } from 'sonner';

export function GeneratedImage() {
  const {
    generatedImage,
    imageMetadata,
    setGeneratedImage,
    walletAddress,
    setMinting,
    setMintedNft,
    isGenerating,
  } = useAppStore();
  const { isConnected, isCorrectNetwork } = useWallet();

  if (!generatedImage || !imageMetadata) return null;

  const handleMint = async () => {
    if (!walletAddress || !isConnected || !isCorrectNetwork) {
      toast.error('Please connect your wallet and switch to Base Sepolia');
      return;
    }

    try {
      setMinting(true);
      const response = await apiService.mintNft({
        imageUrl: generatedImage,
        prompt: imageMetadata.prompt,
        style: imageMetadata.style,
        walletAddress,
      });

      setMintedNft(response);
      toast.success('NFT minted successfully!');
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint NFT');
      setMinting(false);
    }
  };

  const handleClear = () => {
    setGeneratedImage(null, null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Generated Image</CardTitle>
        <CardDescription>
          Your AI-generated image is ready. You can download it or mint it as an
          NFT.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <img
            src={generatedImage}
            alt="Generated"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Prompt:</span>{' '}
            <span className="text-muted-foreground">
              {imageMetadata.prompt}
            </span>
          </p>
          <p>
            <span className="font-medium">Style:</span>{' '}
            <span className="text-muted-foreground">{imageMetadata.style}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => window.open(generatedImage, '_blank')}
          >
            Download
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button
            onClick={handleMint}
            disabled={!isConnected || !isCorrectNetwork || isGenerating}
          >
            {!isConnected
              ? 'Connect Wallet to Mint'
              : !isCorrectNetwork
              ? 'Switch Network to Mint'
              : 'Mint as NFT'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
