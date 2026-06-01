import api from "@/services/Api";
import type {
  PostData,
  FeedResponse,
  CreatePostPayload,
  CreateMediaPostRequest,
  UploadIntentResponse,
  CompleteMediaPostResponse,
  ApiResponse
} from "@/types/post";

// Récupérer le fil d'actualité avec pagination
export async function getFeed(cursor?: string, limit = 10): Promise<FeedResponse> {
  const res = await api.get<ApiResponse<FeedResponse>>('/v1/posts/feed', {
    params: { cursor, limit }
  });
  if (!res.data.ok || !res.data.result) {
    throw new Error(res.data.error ?? "Erreur récupération feed");
  }
  return res.data.result;
}

// Créer un post textuel simple
export async function createSimplePost(payload: CreatePostPayload): Promise<PostData> {
  const res = await api.post<ApiResponse<PostData>>('/v1/posts/', payload);
  if (!res.data.ok || !res.data.result) {
    throw new Error(res.data.error ?? "Erreur création post");
  }
  return res.data.result;
}

// Initialiser la création d'un post avec médias
export async function getUploadIntent(payload: CreateMediaPostRequest): Promise<UploadIntentResponse> {
  const res = await api.post<ApiResponse<UploadIntentResponse>>('/v1/posts/get-uploads-intent', payload);
  if (!res.data.ok || !res.data.result) {
    throw new Error(res.data.error ?? "Erreur initialisation upload");
  }
  return res.data.result;
}

// Confirmer l'upload des médias pour finaliser le post
export async function completeMediaPost(intentId: string): Promise<CompleteMediaPostResponse> {
  const res = await api.post<ApiResponse<CompleteMediaPostResponse>>('/v1/posts/complete_medias_post', null, {
    params: { intent_id: intentId }
  });
  if (!res.data.ok || !res.data.result) {
    throw new Error(res.data.error ?? "Erreur finalisation post");
  }
  return res.data.result;
}

// Marquer des posts comme vus (Batch)
export async function addViews(postIds: string[]): Promise<void> {
  const res = await api.post<ApiResponse<null>>('/v1/posts/add-views', {
    posts_ids: postIds
  });
  if (!res.data.ok) {
    throw new Error(res.data.error ?? "Erreur marquage posts vus");
  }
}

// Récupérer un post spécifique par ID
export async function getPostById(postId: string): Promise<PostData> {
  const res = await api.get<ApiResponse<PostData>>(`/v1/posts/${postId}`);
  if (!res.data.ok || !res.data.result) {
    throw new Error(res.data.error ?? "Erreur récupération post");
  }
  return res.data.result;
}

export const postService = {
  getFeed,
  createSimplePost,
  getUploadIntent,
  completeMediaPost,
  addViews,
  getPostById,
};