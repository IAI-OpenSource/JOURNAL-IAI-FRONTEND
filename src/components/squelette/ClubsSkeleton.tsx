import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ClubsSkeleton() {
  // On simule 4 cartes pour remplir la grille au chargement
  const skeletonCards = Array.from({ length: 4 });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Skeleton pour l'en-tête de la page */}
      <div className="space-y-2">
        {/* Titre "Clubs" */}
        <Skeleton className="h-8 w-24 bg-zinc-200" />
        {/* Sous-titre */}
        <Skeleton className="h-4 w-64 bg-zinc-200" />
      </div>

      {/* Grille de cartes Skeletons avec animation de pulsation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skeletonCards.map((_, i) => (
          <Card key={i} className="overflow-hidden border-zinc-100 shadow-sm">
            <CardContent className="p-5 space-y-4">
              
              {/* --- Section Supérieure: Logo + Titre + Bouton --- */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  {/* Logo du Club (Carré arrondi) */}
                  <Skeleton className="h-12 w-12 rounded-lg bg-zinc-200" />
                  
                  <div className="space-y-2">
                    {/* Nom du club */}
                    <Skeleton className="h-5 w-36 bg-zinc-200" />
                    {/* Nombre de membres et icône */}
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded-full bg-zinc-200" /> {/* Icône Users */}
                      <Skeleton className="h-3 w-16 bg-zinc-200" /> {/* Texte membres */}
                    </div>
                  </div>
                </div>
                
                {/* Bouton Suivre/Suivi (Petit et arrondi) */}
                <Skeleton className="h-7 w-16 rounded-md bg-zinc-200" />
              </div>

              {/* --- Section Centrale: Description (2 lignes) --- */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-full bg-zinc-200" />
                <Skeleton className="h-3 w-4/5 bg-zinc-200" />
              </div>

              {/* --- Section Inférieure: Comité --- */}
              <div className="pt-3 border-t border-zinc-50 space-y-2">
                {/* Titre "Comité" */}
                <Skeleton className="h-2 w-12 bg-zinc-100" />
                
                {/* Badges des membres du comité */}
                <div className="flex gap-2">
                  {/* Badge 1 (ex: Président) */}
                  <Skeleton className="h-6 w-24 rounded-full bg-zinc-100 flex items-center gap-1 px-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-zinc-200" /> {/* Avatar miniature */}
                  </Skeleton>
                  {/* Badge 2 (ex: Vice-Président) */}
                  <Skeleton className="h-6 w-32 rounded-full bg-zinc-100 flex items-center gap-1 px-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-zinc-200" /> {/* Avatar miniature */}
                  </Skeleton>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}