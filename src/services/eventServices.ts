import api from "@/services/Api";
import type { EventStatus, PaginatedResult, EventData } from "@/types/event";
import type { ApiBaseResponse } from "@/types/user";

// Récupérer les événements avec pagination
export async function getPaginatedEvents(cursor?: string, limit = 10): Promise<PaginatedResult> {
    const res = await api.get<ApiBaseResponse<PaginatedResult>>('/v1/events/paginated/', { 
        params: { cursor, limit } 
    });
    if (!res.data.success || !res.data.result) {
        throw new Error(res.data.message ?? "Erreur récupération événements");
    }
    return res.data.result;
}

// Récupérer un événement par son ID
export async function getEventById(id: string): Promise<EventData> {
    const res = await api.get<ApiBaseResponse<EventData>>(`/v1/events/${id}`);
    if (!res.data.success || !res.data.result) {
        throw new Error(res.data.message ?? "Erreur récupération événement");
    }
    return res.data.result;
}

// Récupérer les événements par statut
export async function getEventsByStatus(status: EventStatus): Promise<EventData[]> {
    const res = await api.get<ApiBaseResponse<{ events: EventData[] }>>(`/v1/events/status/${status}`);
    if (!res.data.success || !res.data.result) {
        throw new Error(res.data.message ?? "Erreur récupération événements par statut");
    }
    return res.data.result.events;
}

// Créer un nouvel événement
export async function createEvent(payload: Partial<EventData>): Promise<EventData> {
    const res = await api.post<ApiBaseResponse<EventData>>('/v1/events/', payload);
    if (!res.data.success || !res.data.result) {
        throw new Error(res.data.message ?? "Erreur création événement");
    }
    return res.data.result;
}


// Mettre à jour un événement
export async function updateEvent(id: string, payload: Partial<EventData>): Promise<EventData> {
    const res = await api.put<ApiBaseResponse<EventData>>(`/v1/events/${id}`, payload);
    if (!res.data.success || !res.data.result) {
        throw new Error(res.data.message ?? "Erreur mise à jour événement");
    }
    return res.data.result;
}

// Supprimer un événement
export async function deleteEvent(id: string): Promise<void> {
    const res = await api.delete<ApiBaseResponse<{ message: string }>>(`/v1/events/${id}`);
    if (!res.data.success) {
        throw new Error(res.data.message ?? "Erreur suppression événement");
    }
}

export const eventService = {
    getPaginatedEvents,
    getEventById,
    getEventsByStatus,
    createEvent,
    updateEvent,
    deleteEvent,
};