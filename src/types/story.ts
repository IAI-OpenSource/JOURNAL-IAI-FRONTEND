export type MediaType = "IMAGE" | "VIDEO";

export type StoryGroupsType = "USER_GROUP" | "CLUB_GROUP" | "CLASSE_GROUP";

export type UserRole =
  | "STUDENT"
  | "DELEGATE"
  | "CLUB_MEMBER"
  | "EXECUTIVE_MEMBER"
  | "ADMIN";

export type ExecutiveRoleType =
  | "PRESIDENT"
  | "VICE_PRESIDENT"
  | "SECRETARY"
  | "TREASURER"
  | string;

export interface StoryAuthor {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: UserRole;
  executive_role: ExecutiveRoleType | null;
}

export interface StoryClub {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface StoryClasse {
  id: string;
  classe_prefix: string;   // je sais pas si les prefixes sont oblg "TC1", "GLSI_3"
  classe_suffix: string | null; 
}
export interface StoryRead {
  id: string;
  author_id: string;
  author: StoryAuthor;
  media_type: MediaType;
  thumbnail_url: string | null;
  /** URL HLS master serra présent seulement si media_type === "VIDEO" */
  hls_master_url: string | null;
  image_medium_url: string | null;
  image_high_url: string | null;
  blur_hash: string | null;
  legend: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  already_viewed: boolean;
  created_at: string;
  expires_at: string;
}



export interface StoryGroupRead {
  id: string;
  group_type: StoryGroupsType;
  author_id: string | null;
  author: StoryAuthor | null;
  club_id: string | null;
  club_info: StoryClub | null;
  target_classe_id: string | null;
  target_classe_info: StoryClasse | null;
  stories: StoryRead[];
  stories_count: number;
  /**
   * l'index des stories déjà vues dans le tab storie
   * genre  [0, 2] -> la 1ère et la 3ème story sont vues
   */
  viewed_index_in_group: number[];
  updated_at: string;
  expires_at: string;
}

//feed

export interface StoryGroupListResult {
  items: StoryGroupRead[];
  next_cursor: string | null;
  has_more: boolean;
}

/** ApiBaseResponse du bac */
export interface StoryFeedResponse {
  success: boolean;
  message: string;
  result: StoryGroupListResult | null;
}

export interface FileToUpload {
  file_name: string;
  file_size: number;       
  media_type: MediaType;
}

export interface CreateStoryUploadIntentPayload {
  legend?: string | null;
  story_duration_hours?: number;  
  only_for_a_class?: boolean | null;
  file: FileToUpload;
}

export interface FileInUploadURL {
  upload_url: string;
  method: "PUT";
  media_type: MediaType;
  file_name: string;
}

export interface StoryUploadURLSchema {
  intent_id: string;
  file: FileInUploadURL;
}

export interface StoryMediaUploadIntentResponse {
  success: boolean;
  message: string;
  result: StoryUploadURLSchema | null;
}

export interface MediaUploadCompleteSchema {
  job_id: string;
}

export interface StoryMediaUploadCompleteResponse {
  success: boolean;
  message: string;
  result: MediaUploadCompleteSchema | null;
}

//vues

export interface CreateStoryViewPayload {
  story_ids: string[];
}