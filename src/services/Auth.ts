import api from '../services/Api';
import type { ApiResponse } from '../types/AuthType';

export const authService = {
  // inscription 
  register: async (userData: any) => {
    const payload = {
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
    const response = await api.post<ApiResponse<{ message: string; }>>('/v1/auth/verify-otp', {
      sender_email: email,
      otp: otp
    });
    // Le backend ne renvoie pas le token dans le json (il utilise un cookie sécurisé)
    // On met juste un petit marqueur ici pour informer React qu'on est bien connecté
    if (response.data.ok) {
      localStorage.setItem('isAuthenticated', 'true');
    }
    return response.data;
  },

  // Déconnexion
  logout: async () => {
    const response = await api.post<ApiResponse<{ message: string }>>('/v1/auth/logout');
    return response.data;
  }
};