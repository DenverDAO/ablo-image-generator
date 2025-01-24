export interface ImageGenerationOptions {
  prompt: string;
  width: number;
  height: number;
  format: "jpeg" | "png";
  guidance_scale?: number;
  num_inference_steps?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
