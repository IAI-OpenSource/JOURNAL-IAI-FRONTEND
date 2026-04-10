import api from "@/services/Api";
import type { ApiBaseResponse, ReadUser, UpdateUserData } from "@/types/user";

export const userService = {
  // GET /user/user-profil-data profil de l'user connecte
  // utilise pour AdminPage et UserPage
  getCurrentUser: async (): Promise<ReadUser> => {
    const res = await api.get<ApiBaseResponse<ReadUser>>("/v1/user/user-profil-data");
    // Le backend renvoie { ok: boolean, result: T, error: string | null }
    // Plutôt que success. On s'adapte.
    const data = res.data as any; 
    if ((data.ok === true || data.success === true) && data.result) {
      return data.result;
    }
    throw new Error(data.message ?? data.error ?? "Erreur recup profil");
  },

  // GET /user/all tous les users (admin seulement)
  getAllUsers: async (): Promise<ReadUser[]> => {
    const res = await api.get<ApiBaseResponse<ReadUser[]>>("/v1/user/all");
    const data = res.data as any;
    if ((data.ok === true || data.success === true) && data.result) {
      return data.result;
    }
    throw new Error(data.message ?? data.error ?? "Erreur recup users");
  },

  // POST /user/update met a jour les infos de l'user connecte
  updateCurrentUser: async (data: UpdateUserData): Promise<string> => {
    const res = await api.post<ApiBaseResponse<string>>("/v1/user/update", data);
    const responseData = res.data as any;
    if (responseData.ok === true || responseData.success === true) {
      return responseData.message;
    }
    throw new Error(responseData.message ?? responseData.error ?? "Erreur mise a jour profil");
  },
};