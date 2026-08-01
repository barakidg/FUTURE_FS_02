import axios, { type AxiosError } from 'axios';
import { env } from './env';
import { ApiError } from './error';

interface ApiErrorResponse {
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };

  code?: string;
  message?: string;
}
    
export const api = axios.create({
    baseURL: env.VITE_API_URL,
    withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const data = error.response?.data;

    if (error.response && data) {
      if (data.error) {
        return Promise.reject(
          new ApiError(
            data.error.code,
            data.error.message,
            error.response.status,
            data.error.details
          )
        );
      }

      if (data.code && data.message) {
        return Promise.reject(
          new ApiError(
            data.code,
            data.message,
            error.response.status
          )
        );
      }
    }

    return Promise.reject(
      new ApiError(
        "NETWORK_ERROR",
        "Could not reach the server. Check your connection.",
        0
      )
    );
  }
);









