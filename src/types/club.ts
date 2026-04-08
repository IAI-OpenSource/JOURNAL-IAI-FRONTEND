import type { ClubMembersType } from "./enums";
import type { ReadUser } from "./user";

export type RoleClub = "president" | "vice_president" | "chef_de_club" | "membre" | null;

// ce que le front utilise en interne dans les composants
export interface ClubDTO {
  id: string;           // UUID string garde string, pas de parseInt
  nom: string;
  description: string;
  nbMembres: number;
  avatarUrl?: string;
  suivi: boolean;
  role: RoleClub;
}

// un membre du comité avec son avatarviendr  de GET /clubs/:id/membres/roles
export interface MembreComiteDTO {
  id: string;
  username: string;
  avatarUrl?: string;
  role: Exclude<RoleClub, null>;
}

export interface ClubResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  member_count: number;
}

// ce que renvoie GET /clubs/
export interface ClubsListResponse {
  clubs: ClubResponse[];
  total: number;
  page: number;
  page_size: number;
}

// ClubMemberRead du back
export interface ClubMemberRead {
  id: string;
  club_id: string;
  user_id: string;
  role_in_club: ClubMembersType;
  joined_at: string;
  deleted_at: string | null;
}

export interface ClubMemberWithUser extends ClubMemberRead {
  user: ReadUser;
}

export interface ClubCreateRequest {
  name: string;
  slug: string;
  description?: string;
}

// payload mise a jour
export interface ClubUpdateRequest {
  name?: string;
  is_active?: boolean;
  description?: string;
}