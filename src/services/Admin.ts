import api from './Api';
import type { 
  ApiResponse, 
  ClasseListResponse, 
  ClasseResponse, 
  ReadRegistration, 
  ReadUser 
} from '../types/adminTypes';

export const Admin = {
  
  // recuperer toutes les classes
  getAllClasses: async (page = 1, pageSize = 20) => {
    const response = await api.get<ApiResponse<ClasseListResponse>>(
      `/v1/classes/`, {
        params: { page, page_size: pageSize }
      }
    );
    return response.data;
  },
  
  // creer une classe
  createClasse: async (data: { classe_prefix: string; classe_suffix: string }) => {
    const response = await api.post<ApiResponse<ClasseResponse>>('/v1/classes/', data);
    return response.data;
  },

  // recuperer une classe par ID
  getClasseById: async (classeId: string) => {
    const response = await api.get<ApiResponse<ClasseResponse>>(`/v1/classes/${classeId}`);
    return response.data;
  },

  // recuperer les jetons d'une classe 
  getJetonsByClasse: async (classeId: string) => {
    const response = await api.get<ApiResponse<ReadRegistration[]>>(
      `/v1/registration/all/by-classe/${classeId}`
    );
    return response.data;
  },

  // creer un jeton 
  createJeton: async (data: { 
    first_name: string; 
    last_name: string; 
    email: string;
    role: string; 
    sexe: string; 
    classe_id: string 
  }) => {
    const response = await api.post<ApiResponse<ReadRegistration>>('/v1/registration/add', data);
    return response.data;
  },

  // recuperer les utilisateurs  d'une classe specifique
  getUsersByClasse: async (classeId: string) => {
    const response = await api.get<ApiResponse<ReadUser[]>>('/v1/user/all');
    if (response.data.ok) {
      //  filtre pour ne garder que les eleves inscrits dans cette classe
      const filtered = response.data.result.filter(u => u.classe?.id === classeId);
      return { ...response.data, result: filtered };
    }
    return response.data;
  },

  // recuperer tous les utilisateurs
  getAllUsers: async () => {
    const response = await api.get<ApiResponse<ReadUser[]>>('/v1/user/all');
    return response.data;
  },

  

  // recuperer toutes les annees academiques
  getAllAcademicYears: async (page = 1, pageSize = 20) => {
    const response = await api.get<any>('/v1/academic-years/', {
      params: { page, page_size: pageSize }
    });
    return response.data;
  },

  // recuperer l'annee academique active
  getActiveAcademicYear: async () => {
    const response = await api.get<any>('/v1/academic-years/active');
    return response.data;
  },

  // creer une annee academique
  createAcademicYear: async (data: { libelle: string; start_date: string; end_date: string }) => {
    const response = await api.post<any>('/v1/academic-years/', data);
    return response.data;
  },

  // exporter les jetons en PDF ou JSON
  exportJetons: async (classeId: string, format: "PDF" | "JSON") => {
    const response = await api.get(`/v1/registration/export/jetons/${classeId}/${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // importer des etudiants via Excel
  importStudents: async (classeId: string, file: File) => {
    const formData = new FormData();
    formData.append('classe_id', classeId);
    formData.append('excel_file', file);
//tres critique 
    const response = await api.post('/v1/registration/students/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // verifier le statut de l'importation
  checkImportStatus: async (taskId: string) => {
    try {
      const response = await api.get<ApiResponse<{ status: string; message: string }>>(
        `/v1/registration/import/status/${taskId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data; 
      }
      throw error;
    }
  },

  // envoyer les invitations par email
  sendJetonsEmail: async (classeId: string) => {
    const response = await api.post<ApiResponse<string>>(
      `/v1/registration/students/send-email/${classeId}`
    );
    return response.data;
  },

  // supprimer une classe
  deleteClasse: async (classeId: string) => {
    const response = await api.delete<ApiResponse<string>>(`/v1/classes/${classeId}`);
    return response.data;
  },

  // supprimer une année académique
  deleteAcademicYear: async (academicYearId: string) => {
    const response = await api.delete<ApiResponse<string>>(`/v1/academic-years/${academicYearId}`);
    return response.data;
  },

  // sSupprimer un jeton  fructif a adapter plus tard 
  deleteJeton: async (jetonId: string) => {
    const response = await api.delete<ApiResponse<string>>(`/v1/registration/delete/${jetonId}`);
    return response.data;
  },

  // supprimer un utilisateur fructif a adapter plus tard 
  deleteUser: async (userId: string) => {
    const response = await api.delete<ApiResponse<string>>(`/v1/user/delete/${userId}`);
    return response.data;
  }
};