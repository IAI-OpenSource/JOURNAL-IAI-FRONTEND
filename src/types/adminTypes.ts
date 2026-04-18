export type ClasseType = "TC1" | "TC2" | "GLSI_3" | "ASR_3" | "MTWI_3";
export type UserRole = "STUDENT" | "CLUB_LEADER" | "DELEGATE" | "MODERATOR" | "ADMIN" | "SPECTATOR" | "EXECUTIVE_MEMBER";
export type SexeType = "F" | "M";

export interface ClasseResponse {
  id: string;
  classe_prefix: ClasseType;
  classe_suffix: string;
  effectif: number;
  academic_year_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClasseListResponse {
  classes: ClasseResponse[];
  total: number;
  page: number;
  page_size: number;
}


export interface ReadRegistration {
  id: string;
  jeton: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  executive_role: string | null;
  classe: {
    id: string;
    classe_prefix: ClasseType;
    classe_suffix: string;
  } | null;
  used_at: string | null; 
  added_at: string;
}


export interface ReadUser {
  id: string;
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  sexe: SexeType;
  role: UserRole;
  is_verified: boolean; 
  classe: {
    id: string;
    classe_prefix: ClasseType;
    classe_suffix: string;
  } | null;
  created_at: string;
}


export interface ApiResponse<T> {
  ok: boolean;
  result: T;
  error: string | null;
}

export interface AcademicYearResponse {
  id: string;
  libelle: string;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicYearListResponse {
  years: AcademicYearResponse[];
  total: number;
  page: number;
  page_size: number;
}