export type UserRole = "STUDENT" | "CLUB_LEADER" | "DELEGATE" | "MODERATOR" | "ADMIN" | "SPECTATOR" | "EXECUTIVE_MEMBER";
export type SexeType = "F" | "M";

export interface ReadUserClasse {
  id: string;
  classe_prefix: string; 
  classe_suffix: string; 
  effectif: number;
  academic_year_id: string;
}


export interface RegistrationInfos {
  id: string;
  jeton: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  executive_role: string | null;
  classe: ReadUserClasse | null;
  used_at: string | null;
  added_at: string;
}

//le profil
export interface UserInfos {
  id: string;
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  bio: string | null;
  avatar_url: string | null;
  sexe: SexeType;
  role: UserRole;
  executive_role: string | null;
  classe: ReadUserClasse | null;
  is_verified: boolean;
  created_at: string;
}

// Modèle de réponse générique 
export interface ApiResponse<T> {
  ok: boolean;
  result: T;
  error: string | null;
}