import type { PostType } from "./enums";

export interface FileUploadIntent {
  filename: string;
  content_type: string;
  size: number;
}

// Représente un fichier retourné par l'intent d'upload avec son URL signée 
export interface BackendFileResponse {
  upload_url: string;
  [key: string]: any;
}

export interface UploadIntentResponse {
  intent_id: string;
  files: BackendFileResponse[];
}

export interface CompleteMediaPostResponse {
  job_id: string;
}

export interface PostData {
  id: string;
  post_type: PostType;
  author_id: string;
  content: string;
  medias: any[];
  club_id: string | null;
  event_id: string | null;
  target_classe_id: string | null;
  academic_year_id: string;
  like_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author_info: Record<string, any>;
  club_info: Record<string, any>;
  event_info: Record<string, any>;
  target_classe_info: Record<string, any>;
}

export interface CreatePostPayload {
  content: string;
  event_id: string | null;
  club_id: string | null;
  for_current_academic_year: boolean;
  only_for_a_class: boolean;
}

export interface CreateMediaPostRequest extends CreatePostPayload {
  files: FileUploadIntent[];
}

export interface FeedResponse {
  items: PostData[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface ApiResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
}