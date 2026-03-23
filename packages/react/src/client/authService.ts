import { BaseApiService } from './apiClient';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

interface CoreUserInfo {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

export class AuthService extends BaseApiService {
  private static instance: AuthService;

  public constructor(baseURL?: string) {
    super(baseURL);
  }

  public static getInstance(baseURL?: string): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(baseURL);
    }
    return AuthService.instance;
  }

  /**
   * Get stored token from localStorage
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('authToken');
    return token;
  }

  /**
   * Get stored user data from localStorage
   */
  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Store token and user data
   */
  setAuthData(token: string, user: User): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear all auth data
   */
  clearAuthData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Simple token validation (you might want to use jwt-decode here)
      return token.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/auth/login', credentials);
    const data = this.validateResponse(response);

    // Store token and user data
    this.setAuthData(data.accessToken, data.user);

    return data;
  }

  /**
   * Register user
   */
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/auth/register', userData);
    const data = this.validateResponse(response);

    // Store token and user data
    this.setAuthData(data.accessToken, data.user);

    return data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.client.post('/api/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/auth/refresh');
    const data = this.validateResponse(response);

    // Update stored token
    this.setAuthData(data.accessToken, data.user);

    return data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/api/users/profile');
    return this.validateResponse(response);
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.client.put<User>('/api/users/profile', userData);
    const data = this.validateResponse(response);

    // Update stored user data
    this.setAuthData(this.getToken()!, data);

    return data;
  }
}

export default AuthService;
