import { ApiResponse } from "../types";

export const formatResponse = <T>(
  data?: T,
  error?: string
): ApiResponse<T> => ({
  success: !error,
  ...(data && { data }),
  ...(error && { error }),
});
