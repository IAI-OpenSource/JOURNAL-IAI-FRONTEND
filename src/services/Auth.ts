import api from '../services/Api';
import type { ApiResponse } from '../types/AuthType';

export const authService = {
  // inscription 
 register: async (userData: any) => {
  const payload = {
    email: userData.email,
    username: userData.username,
    password: userData.password,
    jeton: {
      jeton: userData.jeton 
    }
  };

  const response = await api.post<ApiResponse<{ message: string }>>('/v1/auth/register', payload);
  return response.data;
},

  // la demande otp
 
  requestOtp: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ message: string }>>('/v1/auth/request-otp', {
      email: email, 
      password: password
    });
    return response.data;
  },

  //la verification otp
  verifyOtp: async (email: string, otp: number) => {
    const response = await api.post<ApiResponse<{ message: string }>>('/v1/auth/verify-otp', {
      sender_email: email, 
      otp: otp           
    });
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post<ApiResponse<{ message: string }>>('/v1/auth/logout');
    return response.data;
  }
};