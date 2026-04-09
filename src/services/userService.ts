import api from "./Api";
import type { ApiBaseResponse, ReadUser, UpdateUserData } from "../types/user";

export const userService = {
  // GET /user/user-profil-data profil de l'user connecte
  // utilise pour AdminPage et UserPage
  getCurrentUser: async (): Promise<ReadUser> => {
    const res = await api.get<ApiBaseResponse<ReadUser>>("/v1/user/user-profil-data");
    if (!res.data.success || !res.data.result) {
      throw new Error(res.data.message ?? "Erreur recup profil");
    }
    return res.data.result;
  },

  // GET /user/all tous les users (admin seulement)
  getAllUsers: async (): Promise<ReadUser[]> => {
    const res = await api.get<ApiBaseResponse<ReadUser[]>>("/v1/user/all");
    if (!res.data.success || !res.data.result) {
      throw new Error(res.data.message ?? "Erreur recup users");
    }
    return res.data.result;
  },

  // POST /user/update met a jour les infos de l'user connecte
  updateCurrentUser: async (data: UpdateUserData): Promise<string> => {
    const res = await api.post<ApiBaseResponse<string>>("/v1/user/update", data);
    if (!res.data.success) {
      throw new Error(res.data.message ?? "Erreur mise a jour profil");
    }
    return res.data.message;
  },
};