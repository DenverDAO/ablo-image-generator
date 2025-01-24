export interface ImageGenerationOptions {
  width: number;
  height: number;
  format: "jpeg" | "png";
  // Add other Flux-specific parameters
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
