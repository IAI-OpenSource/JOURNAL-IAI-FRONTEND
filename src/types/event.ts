export type EventStatus = "BROUILLON" | "PUBLIE" | "EN COURS" |"TERMINE" | "ANNULE";

export interface EventData {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string | null;
    start_date: string;
    end_date: string | null;
    organizer_club_id: string | null;
    status: EventStatus;
    parent_event_id: string | null;
    created_at: string;
    updated_at: string;
    published_at?: string;
}


export interface PaginatedResult{
    events: EventData[];
    next_cursor: string | null;
}