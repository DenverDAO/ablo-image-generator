import { contractAddresses, config } from '../web3';
import { getWalletClient, writeContract } from 'wagmi/actions';
import { parseEther } from 'viem';

// ABI for the Story Protocol NFT contract (simplified for this example)
// In a real app, you would import the full ABI from a separate file
const spgNftContractAbi = [
    {
        "inputs": [
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "string", "name": "nftMetadataURI", "type": "string" },
            { "internalType": "string", "name": "ipMetadataURI", "type": "string" },
            { "internalType": "bytes32", "name": "ipMetadataHash", "type": "bytes32" },
            { "internalType": "bytes32", "name": "nftMetadataHash", "type": "bytes32" }
        ],
        "name": "mintAndRegisterIp",
        "outputs": [
            { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
            { "internalType": "address", "name": "ipId", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

interface MintParams {
    ipMetadata: {
        ipMetadataURI: string;
        ipMetadataHash: string;
        nftMetadataURI: string;
        nftMetadataHash: string;
    }
}

export class Web3Service {
    /**
     * Mint an NFT using Story Protocol's mintAndRegisterIp function
     */
    async mintNft({ ipMetadata }: MintParams) {
        try {
            // Get the wallet client for the connected wallet
            const walletClient = await getWalletClient(config);

            if (!walletClient) {
                throw new Error('No wallet connected');
            }

            const userAddress = walletClient.account.address;

            // Execute the transaction
            const hash = await writeContract(config, {
                address: contractAddresses.spgNftContract as `0x${string}`,
                abi: spgNftContractAbi,
                functionName: 'mintAndRegisterIp',
                args: [
                    userAddress,
                    ipMetadata.nftMetadataURI,
                    ipMetadata.ipMetadataURI,
                    `0x${ipMetadata.ipMetadataHash}` as `0x${string}`,
                    `0x${ipMetadata.nftMetadataHash}` as `0x${string}`
                ],
                value: parseEther('0'), // No ETH value needed for the mint
            });

            return { txHash: hash };
        } catch (error) {
            console.error('Error minting NFT:', error);
            throw error;
        }
    }
}

export const web3Service = new Web3Service(); 