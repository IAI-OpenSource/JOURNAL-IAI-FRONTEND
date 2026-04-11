import api from '@/services/Api';
import type { ClubMemberDTO, PaginatedMembersResponse, ClubRole } from '../types/clubMember';
import type { ApiBaseResponse } from '@/types/user';


// Récupérer les membres avec pagination (cursor)
export async function getPaginatedMembers(clubId: string, cursor?: string, limit = 10): Promise<PaginatedMembersResponse> {
  const res = await api.get<ApiBaseResponse<PaginatedMembersResponse>>(
    `/v1/clubs/${clubId}/members/paginated/`,
    { params: { cursor, limit } }
  );
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur récupération membres paginés");
  }
  return res.data.result;
}

// Récupérer les membres filtrés par rôle
export async function getMembersByRole(clubId: string, role: ClubRole): Promise<ClubMemberDTO[]> {
  const res = await api.get<ApiBaseResponse<{ members: ClubMemberDTO[] }>>(
    `/v1/clubs/${clubId}/members/role/${role}`
  );
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur récupération membres par rôle");
  }
  return res.data.result.members;
}

// Ajouter un membre à un club
export async function addMember(clubId: string, userId: string, role: ClubRole = "SIMPLE_MEMBER"): Promise<ClubMemberDTO> {
  const res = await api.post<ApiBaseResponse<ClubMemberDTO>>(
    `/v1/clubs/${clubId}/members/`,
    { club_id: clubId, user_id: userId, role_in_club: role }
  );
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur lors de l'ajout du membre");
  }
  return res.data.result;
}

// Modifier le rôle d'un membre
export async function updateMemberRole(clubId: string, memberId: string, newRole: ClubRole): Promise<ClubMemberDTO> {
  const res = await api.put<ApiBaseResponse<ClubMemberDTO>>(
    `/v1/clubs/${clubId}/members/${memberId}`,
    { role_in_club: newRole }
  );
  if (!res.data.success || !res.data.result) {
    throw new Error(res.data.message ?? "Erreur modification rôle membre");
  }
  return res.data.result;
}

// DELETE /v1/clubs/{club_id}/members/{member_id} : Retirer un membre du club (soft delete)
export async function removeMember(clubId: string, memberId: string): Promise<void> {
  const res = await api.delete<ApiBaseResponse<{ message: string }>>(
    `/v1/clubs/${clubId}/members/${memberId}`
  );
  if (!res.data.success) {
    throw new Error(res.data.message ?? "Erreur suppression membre");
  }
}

export const memberService = {
  getPaginatedMembers,
  getMembersByRole,
  addMember,
  updateMemberRole,
  removeMember
};