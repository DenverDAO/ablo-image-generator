import { Response } from "express";
import { generateImage } from "../controllers/image.controller";
import { HfService } from "../services/huggingface.service";
import { GenerateImageRequest } from "../types/requests";

// Mock the HfService module
jest.mock("../services/huggingface.service");

describe("generateImage Controller", () => {
  let req: Partial<GenerateImageRequest>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Setup mock request and response objects
    req = {
      body: {
        prompt: "A cat wearing a hat",
        negativePrompt: "blurry",
        width: 512,
        height: 512,
      },
    };

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    res = {
      status: statusMock,
      json: jsonMock,
    };

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    jest.restoreAllMocks();
  });

  it("should generate an image and return it in base64 format", async () => {
    // Mock the HfService.generateImage to return a buffer
    const mockImageBuffer = Buffer.from("mock-image-data");
    (HfService.generateImage as jest.Mock).mockResolvedValue(mockImageBuffer);

    await generateImage(req as GenerateImageRequest, res as Response);

    // Verify that the service was called with the correct parameters
    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: "blurry",
      width: 512,
      height: 512,
    });

    // Verify the response
    expect(res.status).not.toHaveBeenCalled(); // No error status
    expect(res.json).toHaveBeenCalledWith({
      image: mockImageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    });
  });

  it("should handle missing optional parameters (negativePrompt, width, height)", async () => {
    // Modify the request to exclude optional parameters
    req.body = {
      prompt: "A cat wearing a hat",
    };

    const mockImageBuffer = Buffer.from("mock-image-data");
    (HfService.generateImage as jest.Mock).mockResolvedValue(mockImageBuffer);

    await generateImage(req as GenerateImageRequest, res as Response);

    // Verify that the service was called with default values
    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: undefined,
      width: 512,
      height: 512,
    });

    // Verify the response
    expect(res.status).not.toHaveBeenCalled(); // No error status
    expect(res.json).toHaveBeenCalledWith({
      image: mockImageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    });
  });

  it("should handle errors during image generation", async () => {
    // Mock the HfService.generateImage to throw an error
    const mockError = new Error("Failed to generate image");
    (HfService.generateImage as jest.Mock).mockRejectedValue(mockError);

    await generateImage(req as GenerateImageRequest, res as Response);

    // Verify that the service was called
    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: "blurry",
      width: 512,
      height: 512,
    });

    // Verify the error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Image generation failed",
      details: "Failed to generate image",
    });
  });

  it("should handle unknown errors during image generation", async () => {
    // Mock the HfService.generateImage to throw a non-Error object
    (HfService.generateImage as jest.Mock).mockRejectedValue("Unknown error");

    await generateImage(req as GenerateImageRequest, res as Response);

    // Verify that the service was called
    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: "blurry",
      width: 512,
      height: 512,
    });

    // Verify the error response
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Image generation failed",
      details: "Unknown error",
    });
  });

  it("should handle invalid width and height values", async () => {
    // Modify the request to include invalid width and height
    req.body = {
      prompt: "A cat wearing a hat",
      width: -100,
      height: 0,
    };

    const mockImageBuffer = Buffer.from("mock-image-data");
    (HfService.generateImage as jest.Mock).mockResolvedValue(mockImageBuffer);

    await generateImage(req as GenerateImageRequest, res as Response);

    // Verify that the service was called with the invalid values
    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: undefined,
      width: -100,
      height: 0,
    });

    // Verify the response
    expect(res.status).not.toHaveBeenCalled(); // No error status
    expect(res.json).toHaveBeenCalledWith({
      image: mockImageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    });
  });

  it("should handle negative prompt correctly", async () => {
    req.body = {
      prompt: "A cat wearing a hat",
      negativePrompt: "blurry, low quality",
      width: 512,
      height: 512,
    };

    const mockImageBuffer = Buffer.from("mock-image-data");
    (HfService.generateImage as jest.Mock).mockResolvedValue(mockImageBuffer);

    await generateImage(req as GenerateImageRequest, res as Response);

    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: "blurry, low quality",
      width: 512,
      height: 512,
    });
  });

  it("should handle missing negative prompt", async () => {
    req.body = {
      prompt: "A cat wearing a hat",
      width: 512,
      height: 512,
    };

    const mockImageBuffer = Buffer.from("mock-image-data");
    (HfService.generateImage as jest.Mock).mockResolvedValue(mockImageBuffer);

    await generateImage(req as GenerateImageRequest, res as Response);

    expect(HfService.generateImage).toHaveBeenCalledWith({
      prompt: "A cat wearing a hat",
      negativePrompt: undefined,
      width: 512,
      height: 512,
    });
  });
});
