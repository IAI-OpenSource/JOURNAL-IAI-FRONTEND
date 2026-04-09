import api from '../services/Api'; 
import type { ApiResponse, RegistrationInfos } from '../types/AuthType';

export const registrationService = {
  // vérifier un jeton avant de s'inscrire
  getOne: async (jetonCode: string) => {
    const response = await api.post<ApiResponse<RegistrationInfos>>('/v1/registration/one', {
      jeton: jetonCode
    });
    return response.data;
  },

  // créer un jeton 
  add: async (data: any) => {
    const response = await api.post<ApiResponse<RegistrationInfos>>('/v1/registration/add', data);
    return response.data;
  },

  // Lister tous les jetons (ça c'est pour les admins )
  getAll: async () => {
    const response = await api.get<ApiResponse<RegistrationInfos[]>>('/v1/registration/all');
    return response.data;
  }
};