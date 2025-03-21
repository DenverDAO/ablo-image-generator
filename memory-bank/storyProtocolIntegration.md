# Story Protocol Integration Details

## Overview

Story Protocol will be used to register AI-generated images as intellectual property assets on the blockchain. This integration provides a way for users to establish ownership, attribution, and potentially enable future licensing and royalty opportunities for their generated content.

## Key Components

### 1. IP Asset Registration

The core of the integration will use the `mintAndRegisterIpAssetWithPilTerms` method from the Story Protocol SDK, which:

1. Mints an NFT representing the image
2. Registers the NFT as an IP Asset
3. Attaches licensing terms to the IP Asset

This method is preferred because it handles the entire registration process in a single transaction, improving user experience and reducing gas costs.

### 2. PIL (Programmable IP License) Terms

We'll use Story Protocol's Programmable IP License (PIL) framework to define the license terms for registered images. The initial implementation will use standard Creative Commons-inspired terms that allow:

- Commercial use with attribution
- Derivative works with attribution
- No additional restrictions

Example PIL terms configuration:

```typescript
const pilTerms = {
  transferable: true,
  royaltyPolicy: '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E', // RoyaltyPolicyLAP address
  defaultMintingFee: 0,
  expiration: 0, // No expiration
  commercialUse: true,
  commercialAttribution: true,
  commercializerChecker: '0x0000000000000000000000000000000000000000',
  commercializerCheckerData: '0x0000000000000000000000000000000000000000',
  commercialRevShare: 50, // 50% revenue share for commercial use
  commercialRevCeiling: 0, // No ceiling
  derivativesAllowed: true,
  derivativesAttribution: true,
  derivativesApproval: false, // No approval needed for derivatives
  derivativesReciprocal: true, // Derivatives must use same license
  derivativeRevCeiling: 0, // No ceiling
  currency: '0x1514000000000000000000000000000000000000', // $WIP token
  uri: '',
};
```

### 3. IP Metadata Structure

Metadata is crucial for IP Assets as it contains the information that defines the asset. Our metadata will include:

```typescript
type IPMetadata = {
  // Content Information
  title: string; // Title/name of the image
  description: string; // Description of the image
  prompt: string; // The prompt used to generate the image
  negativePrompt?: string; // Negative prompt if used
  model: string; // AI model used to generate the image

  // Creation Information
  creator: string; // Creator's wallet address or username
  creationDate: string; // ISO timestamp of creation

  // Technical Information
  width: number; // Image width
  height: number; // Image height
  format: string; // Image format (jpeg, png, etc.)
  imageHash: string; // Hash of the image content for verification

  // Storage Information
  imageUrl: string; // URL to the full image (IPFS or other storage)
  thumbnailUrl?: string; // URL to a thumbnail version if available

  // Rights Information
  license: string; // Description of license terms
  attributionText: string; // Text to use when attributing this image
};
```

### 4. Story Protocol SDK Configuration

The SDK needs to be configured with the proper network and account information:

```typescript
import { createStoryClient } from '@story-protocol/core-sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

// Create wallet client
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.RPC_URL),
});

// Create Story Protocol client
const storyClient = createStoryClient({
  chain: baseSepolia,
  account,
  walletClient,
  rpcUrl: process.env.RPC_URL,
});
```

### 5. Registration Process Flow

The complete registration process will involve:

1. **Image Generation**: Generate image using Hugging Face API
2. **Image Storage**: Store the image in a permanent location (IPFS recommended)
3. **Metadata Creation**: Create metadata including image hash, prompt, etc.
4. **IPFS Upload**: Upload metadata to IPFS to get a permanent URI
5. **Blockchain Registration**: Register as IP Asset with metadata URI
6. **Record Storage**: Store the IP Asset ID with the user's account

Sample registration code:

```typescript
async function registerImageAsIPAsset(
  imageBuffer: Buffer,
  prompt: string,
  model: string,
  format: string,
  creator: string
) {
  // 1. Store image on IPFS
  const imageHash = await hashImage(imageBuffer);
  const imageUrl = await uploadToIPFS(imageBuffer);

  // 2. Create and upload metadata
  const metadata = {
    title: `AI Generated Image: ${prompt.substring(0, 30)}...`,
    description: prompt,
    prompt,
    model,
    creator,
    creationDate: new Date().toISOString(),
    width: imageBuffer.width,
    height: imageBuffer.height,
    format,
    imageHash,
    imageUrl,
    license: 'Creative Commons with Attribution',
    attributionText: `AI image created by ${creator} using ${model}`,
  };

  const metadataHash = hashObject(metadata);
  const metadataUrl = await uploadToIPFS(JSON.stringify(metadata));

  // 3. Register as IP Asset
  const response = await storyClient.ipAsset.mintAndRegisterIpAssetWithPilTerms(
    {
      spgNftContract: process.env.SPG_NFT_CONTRACT,
      licenseTermsData: [{ terms: pilTerms }],
      ipMetadata: {
        ipMetadataURI: metadataUrl,
        ipMetadataHash: metadataHash,
        nftMetadataHash: metadataHash,
        nftMetadataURI: metadataUrl,
      },
      txOptions: { waitForTransaction: true },
    }
  );

  return {
    success: true,
    ipAssetId: response.ipId,
    tokenId: response.tokenId,
    licenseTermsId: response.licenseTermsIds?.[0],
    transactionHash: response.txHash,
  };
}
```

## Required Environment Variables

```
# Story Protocol Configuration
PRIVATE_KEY=0x... # Private key for the wallet (for testing only)
RPC_URL=https://sepolia.base.org # Base Sepolia RPC URL
CHAIN_ID=84532 # Base Sepolia Chain ID
SPG_NFT_CONTRACT=0x... # Story Protocol SPG NFT Contract
ROYALTY_POLICY=0x... # Royalty Policy Contract Address
WIP_TOKEN=0x... # $WIP Token Address

# IPFS Configuration
IPFS_API_KEY=... # If using Pinata or similar
IPFS_API_SECRET=... # If using Pinata or similar
IPFS_GATEWAY=https://gateway.pinata.cloud # IPFS Gateway URL
```

## Testing Plan

1. **Local Environment Testing**:

   - Test with a development wallet on Base Sepolia
   - Verify transaction success and error handling
   - Check metadata storage and retrieval

2. **User Flow Testing**:

   - Test complete flow from image generation to registration
   - Verify proper feedback to user
   - Test error conditions (network issues, insufficient funds)

3. **Integration Testing**:
   - Test interaction between Hugging Face API and Story Protocol
   - Verify metadata consistency across systems
   - Test performance under different load conditions

## Deployment Considerations

1. **Environment Configuration**:

   - Securely manage private keys and API keys
   - Configure correct network parameters for testnet/mainnet

2. **Gas Fee Management**:

   - Consider implementing gas estimation
   - Provide clear information to users about gas costs
   - Explore options for gasless transactions or meta-transactions

3. **Monitoring**:
   - Set up monitoring for blockchain transactions
   - Track successful registrations and failures
   - Monitor gas costs over time
