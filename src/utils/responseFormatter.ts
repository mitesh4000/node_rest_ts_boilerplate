import { ApiResponse } from "../types/apiResponse";

export const successResponse = <T>(
  data: T,
  message: string
): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  message: string,
  error?: string | string[]
): ApiResponse<null> => ({
  success: false,
  message,
  error: error instanceof Array ? error[0] : error,
});
