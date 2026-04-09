import type { UserRole, SexeType, ExecutiveRoleType, ClasseType } from "./enums";

//ReadUserClasse du back
export interface ReadUserClasse {
  id: string;
  name: ClasseType;
}

// ce que renvoie GET /user/user-profil-data
export interface ReadUser {
  id: string;
  email: string;
  username: string;
  last_name: string;
  first_name: string;
  bio: string | null;
  avatar_url: string | null;
  sexe: SexeType;
  classe: ReadUserClasse | null;
  role: UserRole;
  executive_role: ExecutiveRoleType | null;
  can_post: boolean;
  access_jeton_id: string | null;
  is_verified: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string | null;
  last_login_at: string | null;
}

// ce que le back renvoie pour UpdateUserData
export interface UpdateUserData {
  username?: string;
  bio?: string;
  avatar_url?: string;
  sexe?: SexeType;
}

//ApiBaseResponse[T] strucutr generique quqoi
export interface ApiBaseResponse<T> {
  success: boolean;
  message: string;
  result: T | null;
  status_code: number;
}