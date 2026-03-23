import { ApiResponse, ApiError, LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }
    
    const rawToken = localStorage.getItem('authToken');
    
    // Check if token is the string "null" or actually null
    if (rawToken === 'null' || rawToken === null) {
      return {};
    }
    
    return { Authorization: `Bearer ${rawToken}` };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle API responses that don't follow our standard format
      if (!data.hasOwnProperty('success')) {
        return {
          success: response.ok,
          data: response.ok ? data : undefined,
          error: response.ok ? undefined : data.error || 'Request failed',
          message: data.message || (response.ok ? 'Success' : 'Request failed')
        };
      }

      return data as ApiResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
        message: 'Network error occurred'
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Base API Service
export class BaseApiService {
  protected client = new ApiClient();

  constructor(baseURL?: string) {
    this.client = new ApiClient(baseURL);
  }

  protected handleError(error: any): never {
    const apiError: ApiError = {
      message: error?.error || 'An unexpected error occurred',
      status: error?.status,
      code: error?.code,
    };
    throw apiError;
  }

  protected validateResponse<T>(response: ApiResponse<T>): T {
    if (!response.success) {
      this.handleError(response);
    }
    return response.data as T;
  }
}

export default ApiClient;
