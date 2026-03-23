'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import AuthService from '../client/authService';
import { AuthContextType, AuthState, LoginRequest, RegisterRequest, User } from '../types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  baseURL?: string;
}

export function AuthProvider({ children, baseURL }: AuthProviderProps): JSX.Element {
  const [state, setState] = useState<AuthState>(initialState);
  const authService = new AuthService(baseURL);

  const checkAuth = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      if (authService.isAuthenticated()) {
        const userData = authService.getStoredUser();
        setState({
          user: userData,
          token: authService.getToken(),
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication check failed',
      });
    }
  }, [authService]);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.login(credentials);
      setState({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  }, [authService]);

  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await authService.register(userData);
      setState({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      }));
      throw error;
    }
  }, [authService]);

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      await authService.logout();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      // Even if logout fails, clear the state
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, [authService]);

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await authService.refreshToken();
      const userData = authService.getStoredUser();
      setState(prev => ({
        ...prev,
        user: userData,
        token: authService.getToken(),
      }));
    } catch (error) {
      // If refresh fails, logout the user
      logout();
    }
  }, [authService, logout]);

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
