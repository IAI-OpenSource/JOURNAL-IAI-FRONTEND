import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/ui/Event/EventCard";
import { EventsSkeleton } from "@/components/squelette/EventSkeleton";
import { eventService } from "@/services/eventServices"; // Correction du chemin
import type { EventData } from "@/types/event";

export function EventsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", "paginated"],
    queryFn: () => eventService.getPaginatedEvents(),
    staleTime: 1000 * 60 * 5,
  });

  
  const events = data?.events || [];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 min-h-screen bg-white">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-zinc-900">Événements</h3>
        <p className="text-zinc-500 text-sm">Découvrez et suivez les activités de l'IAI-Togo.</p>
      </div>

      {isLoading ? (
        <EventsSkeleton />
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          <p>{error instanceof Error ? error.message : "Erreur lors de la récupération des événements."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event: EventData) => (
            <EventCard 
              key={event.id}
              title={event.title}
              organizer={event.organizer_club_id || "Club IAI"} 
              description={event.description || ""}
              date={new Date(event.start_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
              location={event.location || "IAI-Togo"}
              participants={0} 
              image="" 
              isFollowed={false}
            />
          ))}
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          <p>Aucun événement prévu pour le moment.</p>
        </div>
      )}
    </div>
  );
}