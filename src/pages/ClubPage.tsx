import { useQuery } from "@tanstack/react-query";
import { clubService } from "../services/clubService";
import { ClubCard } from "../components/ui/Club/ClubCard";
import { ClubsSkeleton } from "@/components/squelette/ClubsSkeleton"; 
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ClubPage() {

  const [selectedClub, setSelectedClub] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["clubs", "active"],
    queryFn: () => clubService.getAllClubs(1, 20),
    retry: 1, 
  });

  //pour gérer le suivi.
  //const handleFollowToggle = (clubId: string, isCurrentlyFollowed: boolean) => {}

  //le unfollow
  //const handleUnfollow = (clubId: string) => {}

  const handleClubClick = (club: any) => {
    setSelectedClub(club);
    setIsModalOpen(true);
  };

  const clubs = data?.clubs || [];

  if (isLoading) {
    return <ClubsSkeleton />;
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-red-500 py-20">
        <h1 className="text-xl font-bold">Egblé !</h1>
        <p>{error instanceof Error ? error.message : "Impossible de charger les clubs."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Grille de Clubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <div key={club.id} onClick={() => handleClubClick(club)} className="cursor-pointer">
            <ClubCard 
              id={club.id}
              nom={club.name}
              description={club.description || ""}
              nbMembres={club.member_count}
              avatarUrl={club.logo_url || ""}
              suivi={false}
              role={null}
            />
          </div>
        ))}
      </div>

      {/* Modal de Détails du Club */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedClub?.name}</DialogTitle>
            <DialogDescription>
              Détails et informations sur le club.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="aspect-video w-full rounded-lg bg-zinc-100 overflow-hidden">
                <img 
                  src={selectedClub?.logo_url || "/placeholder-club.png"} 
                  className="w-full h-full object-cover" 
                  alt={selectedClub?.name} 
                />
            </div>
            <p className="text-zinc-600 leading-relaxed">
              {selectedClub?.description || "Aucune description disponible."}
            </p>
            {/* Ajoute ici d'autres infos : nombre de membres, date de création, etc. */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}