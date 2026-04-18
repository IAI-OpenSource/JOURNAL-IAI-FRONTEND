import api from './Api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    
    const response = await api.post<LoginResponse>('/v1/auth/login', credentials);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/v1/auth/register', data);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
  },
};