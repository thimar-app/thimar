import { AxiosError } from 'axios';
import api from './axios';

// Types definitions
export interface UserData {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  latitude?: number | null;
  longitude?: number | null;
  password?: string;
  password2?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

export const registerUser = async (userData: UserData): Promise<UserData> => {
  try {
    const response = await api.post<UserData>('/users/register/', userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw axiosError.response?.data || { detail: 'Registration failed' };
  }
};

export const loginUser = async (credentials: { username: string; password: string }): Promise<TokenResponse> => {
  try {
    const response = await api.post<TokenResponse>('/users/token/', credentials);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw axiosError.response?.data || { detail: 'Login failed' };
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    await api.post('/users/logout/', { refresh_token: refreshToken });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens even if the API call fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const refreshToken = async (): Promise<TokenResponse> => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token available');
    
    const response = await api.post<TokenResponse>('/token/refresh/', { refresh });
    localStorage.setItem('access_token', response.data.access);
    return response.data;
  } catch (error) {
    // If refresh fails, log the user out
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserData> => {
  try {
    const response = await api.get<UserData>('/users/me/');
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw axiosError.response?.data || { detail: 'Failed to fetch profile' };
  }
};

export const updateUserProfile = async (userData: UserData): Promise<UserData> => {
  try {
    const response = await api.patch<UserData>('/users/me/', userData);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>;
    throw axiosError.response?.data || { detail: 'Failed to update profile' };
  }
};