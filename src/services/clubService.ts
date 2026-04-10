import api from "@/services/Api";
import type { ApiBaseResponse } from "@/types/user";
import type { ClubResponse, ClubsListResponse, ClubCreateRequest, ClubUpdateRequest } from "@/types/club";


export async function getAllClubs(page = 1, pageSize = 20, isActive = false): Promise<ClubsListResponse> {
  // ajout du préfixe /v1 
  const res = await api.get<ApiBaseResponse<ClubsListResponse>>("/v1/clubs/", {
    params: { page, page_size: pageSize, is_active: isActive },
  });
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur recup clubs");
  }
  return res.data.result;
}


export async function getClubById(clubId: string): Promise<ClubResponse> {
  const res = await api.get<ApiBaseResponse<ClubResponse>>(`/v1/clubs/${clubId}`);
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur recup club");
  }
  return res.data.result;
}

// GET /clubs/slug/:slug  un club par son slug
export async function getClubBySlug(slug: string): Promise<ClubResponse> {
  // Changement : ajout du préfixe /v1
  const res = await api.get<ApiBaseResponse<ClubResponse>>(`/v1/clubs/slug/${slug}`);
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur recup club");
  }
  return res.data.result;
}

// POST /clubs/  creer un club
export async function createClub(payload: ClubCreateRequest): Promise<ClubResponse> {
  // Changement : ajout du préfixe /v1
  const res = await api.post<ApiBaseResponse<ClubResponse>>("/v1/clubs/", payload);
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur creation club");
  }
  return res.data.result;
}

// PUT /clubs/:id  mettre a jour un club
export async function updateClub(clubId: string, payload: ClubUpdateRequest): Promise<ClubResponse> {
  
  const res = await api.put<ApiBaseResponse<ClubResponse>>(`/v1/clubs/${clubId}`, payload);
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur mise a jour club");
  }
  return res.data.result;
}

// DELETE /clubs/:id supprimer un club
export async function deleteClub(clubId: string): Promise<void> {
  const res = await api.delete<ApiBaseResponse<null>>(`/v1/clubs/${clubId}`);
  if (!res.data.success) {
    throw new Error(res.data.message ?? "Erreur suppression club");
  }
}

export const clubService = {
  getAllClubs,
  getClubById,
  getClubBySlug,
  createClub,
  updateClub,
  deleteClub,
};