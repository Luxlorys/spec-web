/**
 * Standard API error response format from the backend
 */
export interface IApiError {
  code: string;
  error: string;
  message: string;
  statusCode: number;
}
