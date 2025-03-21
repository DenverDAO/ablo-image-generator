# Project Brief: Ablo Image Generator with Story Protocol Integration

## Project Overview

The Ablo Image Generator is an application that allows users to generate images using AI models from Hugging Face's text-to-image service. The project includes a frontend and backend component, with the backend handling the API requests to Hugging Face and the frontend providing a user interface for image generation.

The new milestone for this project is to integrate Story Protocol to register generated images as intellectual property assets on the blockchain. This integration will enable users to establish and protect ownership of their AI-generated content.

## Core Requirements

1. Add Story Protocol integration to register generated images as IP Assets
2. Enable users to register their generated images on the blockchain
3. Provide metadata and attribution information for each registered image
4. Allow users to view their registered IP Assets
5. Implement proper error handling and user feedback for the registration process

## Project Goals

1. Enhance the value proposition of the application by offering IP protection
2. Create a seamless user experience for image generation and IP registration
3. Establish a clear chain of ownership for AI-generated content
4. Build a foundation for future features like licensing, royalties, and NFT minting
5. Promote responsible use of AI-generated content with proper attribution

## Technology Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React (assumed from the project structure)
- **Image Generation**: Hugging Face API
- **Blockchain Integration**: Story Protocol SDK (@story-protocol/core-sdk)
- **Blockchain Network**: Base Sepolia (testnet), with potential mainnet deployment later

## Success Criteria

The milestone will be considered complete when users can:

1. Generate an image through the application
2. Choose to register the image as an IP Asset on Story Protocol's blockchain
3. View basic information about their registered IP Assets
4. Receive proper feedback throughout the registration process
