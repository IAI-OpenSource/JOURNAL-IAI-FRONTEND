export type ClubRole = "LEAD" | "CO_LEAD" | "EXECUTIVE_MEMBER" | "SIMPLE_MEMBER";

export interface ClubMemberDTO {
  id: string; // UUID du membre
  club_id: string;
  user_id: string;
  role_in_club: ClubRole;
  joined_at: string;
  deleted_at: string | null;
  // Champs optionnels si le backend fait la jointure
  username?: string;
  avatar_url?: string;
}

export interface PaginatedMembersResponse {
  members: ClubMemberDTO[];
  next_cursor: string | null;
}