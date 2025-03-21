import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { BASE_SEPOLIA_CHAIN } from '@/lib/web3';

export function MintDialog() {
  const { mintedNft, isMinting, reset } = useAppStore();

  if (!isMinting && !mintedNft) return null;

  const explorerBaseUrl = 'https://sepolia.basescan.org';

  return (
    <Dialog open={true} onOpenChange={() => reset()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isMinting ? 'Minting NFT...' : 'NFT Minted Successfully!'}
          </DialogTitle>
          <DialogDescription>
            {isMinting
              ? 'Please wait while we mint your NFT and register it with Story Protocol...'
              : 'Your NFT has been minted and registered with Story Protocol.'}
          </DialogDescription>
        </DialogHeader>

        {isMinting ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : mintedNft ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Transaction Hash:</p>
              <p className="text-sm text-muted-foreground break-all">
                <a
                  href={`${explorerBaseUrl}/tx/${mintedNft.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {mintedNft.transactionHash}
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">IP Asset ID:</p>
              <p className="text-sm text-muted-foreground break-all">
                {mintedNft.ipAssetId}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">NFT Token ID:</p>
              <p className="text-sm text-muted-foreground">
                {mintedNft.nftTokenId}
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => reset()}>
                Close
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `${explorerBaseUrl}/token/${BASE_SEPOLIA_CHAIN.id}?a=${mintedNft.nftTokenId}`,
                    '_blank'
                  )
                }
              >
                View on Explorer
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
