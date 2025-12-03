export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export function successResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    success: true,
    message,
    data
  }
}

export function errorResponse(message: string, error?: any): ApiResponse {
  return {
    success: false,
    message,
    error: error?.message || error?.toString()
  }
}