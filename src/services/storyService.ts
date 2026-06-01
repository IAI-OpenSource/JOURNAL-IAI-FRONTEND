import type {
  StoryFeedResponse,
  StoryGroupListResult,
  CreateStoryUploadIntentPayload,
  StoryUploadURLSchema,
  MediaUploadCompleteSchema,
  CreateStoryViewPayload,
} from "@/types/story";

const BASE_URL = "/api"
const WS_BASE  = BASE_URL.replace(/^http/, "ws");

class ApiError extends Error {
  constructor(public status: number, message: string) {

    let userMessage = message;
    
    if (status === 403) {
      userMessage = "Vous n'avez pas les droits nécessaires pour effectuer cette action. Vérifiez que votre compte est vérifié et qu'il a les permissions requises.";
    } else if (status === 401) {
      userMessage = "Votre session a expiré. Veuillez vous reconnecter.";
    } else if (status === 404) {
      userMessage = "Service non disponible. Veuillez réessayer plus tard.";
    } else if (status === 500) {
      userMessage = "Une erreur technique est survenue. Nos équipes ont été notifiées.";
    } else if (status === 0) {
      userMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
    }
    
    super(userMessage);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMessage = "";
    try {
      const body = await res.json();
      errorMessage = body?.message || body?.error || "";
    } catch {
      errorMessage = "";
    }
    
    // Si le backend donne un message d'erreur explicite, on le garde
    if (errorMessage && !errorMessage.includes("detail")) {
      throw new ApiError(res.status, errorMessage);
    }
    throw new ApiError(res.status, res.statusText);
  }

  // 204 
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const storyService = {
  /**
   * ici on creer un intent d'upload 
   * renverra une presigned URL MinIO + un intent_id 
   *
   * POST /v1/stories/get-uploads-intent   
   */
  uploadIntent: async (
    payload: CreateStoryUploadIntentPayload
  ): Promise<StoryUploadURLSchema> => {
    const res = await apiFetch<{ success: boolean; message: string; result: StoryUploadURLSchema | null }>(
      "/v1/stories/get-uploads-intent",   
      { method: "POST", body: JSON.stringify(payload) }
    );
    if (!res.result) throw new ApiError(500, res.message ?? "Impossible de préparer l'upload. Veuillez réessayer.");
    return res.result;
  },

  // upload direct (pas de changement, ça reste une URL externe MinIO)
  uploadFileDirect: (
    presignedUrl: string,
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        });
      }

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else {
          let errorMsg = "L'upload du fichier a échoué. Vérifiez que le fichier n'est pas corrompu.";
          if (xhr.status === 413) errorMsg = "Le fichier est trop volumineux. Taille maximale : 100 Mo.";
          else if (xhr.status === 403) errorMsg = "Vous n'êtes pas autorisé à uploader ce fichier.";
          reject(new ApiError(xhr.status, errorMsg));
        }
      });
      xhr.addEventListener("error", () => reject(new ApiError(0, "Erreur réseau lors de l'upload. Vérifiez votre connexion.")));
      xhr.addEventListener("abort", () => reject(new ApiError(0, "Upload annulé par l'utilisateur.")));

      xhr.send(file);
    });
  },

  // POST /v1/stories/complete_media?intent_id=<intent_id>   
  completeUpload: async (intentId: string): Promise<MediaUploadCompleteSchema> => {
    const res = await apiFetch<{ success: boolean; message: string; result: MediaUploadCompleteSchema | null }>(
      `/v1/stories/complete_media?intent_id=${encodeURIComponent(intentId)}`,
      { method: "POST" }
    );
    if (!res.result) throw new ApiError(500, res.message ?? "La validation de l'upload a échoué. Veuillez réessayer.");
    return res.result;
  },

  /*
   * retourn le WebSocket , l'appelant gère onmessage / onclose / onerror.
   * WS /v1/stories/ws/processing_info?intent_id=<intent_id>   
   */
  connectProcessingWS: (intentId: string): WebSocket => {
    const wsUrl = `${WS_BASE}/v1/stories/ws/processing_info?intent_id=${encodeURIComponent(intentId)}`;
    const ws = new WebSocket(wsUrl);
    
    // Gestion des erreurs WebSocket silencieuses
    ws.onerror = () => {
      console.warn("WebSocket error - processing info non disponible, fallback sur polling");
    };
    
    return ws;
  },

  // GET /v1/stories/feed?cursor=<cursor>&limit=<limit>  
  getFeed: async (cursor?: string | null, limit = 15): Promise<StoryGroupListResult> => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor) params.set("cursor", cursor);

    const res = await apiFetch<StoryFeedResponse>(`/v1/stories/feed?${params}`);   
    if (!res.result) throw new ApiError(500, "Impossible de charger les stories. Veuillez rafraîchir la page.");
    return res.result;
  },

  /**
   * batch, j'ai capté maitenant le probleme des N+1 la 
   * on va  lappeler dès qu'une story devient visible dans le viewer.
   *
   * POST /v1/stories/add-views  
   */
  recordViews: async (payload: CreateStoryViewPayload): Promise<void> => {
    await apiFetch<void>("/v1/stories/add-views", {   
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export { ApiError };