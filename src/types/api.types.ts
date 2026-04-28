export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  stack?: string; // Development environment mein aata hai
  error?: string; // Fallback
}