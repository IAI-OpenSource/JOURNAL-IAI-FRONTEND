import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/ui/Event/EventCard";
import { EventsSkeleton } from "@/components/squelette/EventSkeleton";

//simulaion appel API
const fetchEvents = async () => {
  //simulation pour voir le skeleton
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  return [
    {
      id: 1,
      title: "BDE Gala 2026",
      organizer: "Bureau des Étudiants",
      description: "La soirée de gala.",
      date: "15 Avril 2026",
      location: "AGORA SENGHOR",
      participants: 234,
      image: "",
      isFollowed: true
    },
    {
      id: 2,
      title: "Hackathon IAI 2026",
      organizer: "Club Informatique",
      description: "Les étudiants mettent en jeu leurs skills en programmation.",
      date: "20 Mai 2026",
      location: "IAI-Togo",
      participants: 189,
      image: "",
      isFollowed: false
    },
    {
      id: 3,
      title: "Journée Portes Ouvertes",
      organizer: "Direction IAI",
      description: "Découvrez nos formations, nos projets et rencontrez les futurs talents de l'informatique.",
      date: "30 Mars 2026",
      location: "IAI-Togo",
      participants: 217,
      image: "",
      isFollowed: false
    }
  ];
};

export function EventsPage() {
  //utilisation de TanStack Query pour la gestion d'état et du cache
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5, //cache de 5 minutes
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 min-h-screen bg-white">
      
      {/* En-tête de la page */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-zinc-900">Événements</h3>
        <p className="text-zinc-500 text-sm">
          Découvrez et suivez les activités de l'IAI-Togo
        </p>
      </div>

      {/* Affichage conditionnel (Skeleton vs Contenu) */}
      {isLoading ? (
        <EventsSkeleton />
      ) : isError ? (
        <div className="text-center py-20 text-red-500">
          <p>Erreur lors de la récupération des événements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events?.map((event) => (
            <EventCard 
              key={event.id}
              title={event.title}
              organizer={event.organizer}
              description={event.description}
              date={event.date}
              location={event.location}
              participants={event.participants}
              image={event.image}
              isFollowed={event.isFollowed}
            />
          ))}
        </div>
      )}

      {/*message si aucun résultat (optionnel) */}
      {!isLoading && events?.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          <p>Aucun événement prévu pour le moment.</p>
        </div>
      )}
    </div>
  );
}