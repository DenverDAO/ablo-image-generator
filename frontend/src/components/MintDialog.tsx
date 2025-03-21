import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { getExplorerAddressUrl, getExplorerTxUrl } from '@/lib/web3';
import { ExternalLink } from 'lucide-react';

export function MintDialog() {
  const { mintedNft, isMinting, mintStatus, mintError, reset } = useAppStore();

  const isOpen = isMinting || !!mintedNft || mintStatus !== 'idle';

  if (!isOpen) return null;

  const renderDialogContent = () => {
    switch (mintStatus) {
      case 'preparing':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-center">
              Preparing metadata and uploading to IPFS...
            </p>
          </div>
        );

      case 'minting':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-center">
              Confirm the transaction in your wallet...
            </p>
          </div>
        );

      case 'confirming':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-center">
              Transaction submitted! Waiting for confirmation...
            </p>
            {mintedNft?.transactionHash && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    getExplorerTxUrl(mintedNft.transactionHash),
                    '_blank'
                  )
                }
                className="inline-flex items-center gap-1"
              >
                View Transaction <ExternalLink size={14} />
              </Button>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Transaction Hash:</p>
              <p className="text-sm text-muted-foreground break-all">
                <a
                  href={
                    mintedNft?.transactionHash
                      ? getExplorerTxUrl(mintedNft.transactionHash)
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {mintedNft?.transactionHash}
                </a>
              </p>
            </div>

            {mintedNft?.ipAssetId && (
              <div className="space-y-2">
                <p className="text-sm font-medium">IP Asset ID:</p>
                <p className="text-sm text-muted-foreground break-all">
                  <a
                    href={getExplorerAddressUrl(mintedNft.ipAssetId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {mintedNft.ipAssetId}
                  </a>
                </p>
              </div>
            )}

            {mintedNft?.tokenId && (
              <div className="space-y-2">
                <p className="text-sm font-medium">NFT Token ID:</p>
                <p className="text-sm text-muted-foreground">
                  {mintedNft.tokenId}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => reset()}>Close</Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {mintError || 'An error occurred while minting your NFT.'}
              </p>
            </div>

            {mintedNft?.transactionHash && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Transaction Hash:</p>
                <p className="text-sm text-muted-foreground break-all">
                  <a
                    href={getExplorerTxUrl(mintedNft.transactionHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {mintedNft.transactionHash}
                  </a>
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => reset()}>Close</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const dialogTitle = () => {
    switch (mintStatus) {
      case 'preparing':
        return 'Preparing Metadata...';
      case 'minting':
        return 'Minting NFT...';
      case 'confirming':
        return 'Transaction Submitted';
      case 'success':
        return 'NFT Minted Successfully!';
      case 'error':
        return 'Minting Failed';
      default:
        return 'Minting NFT';
    }
  };

  const dialogDescription = () => {
    switch (mintStatus) {
      case 'preparing':
        return 'Uploading your image and metadata to IPFS...';
      case 'minting':
        return 'Please confirm the transaction in your wallet...';
      case 'confirming':
        return 'Waiting for blockchain confirmation...';
      case 'success':
        return 'Your NFT has been minted and registered with Story Protocol.';
      case 'error':
        return 'There was an error minting your NFT.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && reset()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle()}</DialogTitle>
          <DialogDescription>{dialogDescription()}</DialogDescription>
        </DialogHeader>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}
