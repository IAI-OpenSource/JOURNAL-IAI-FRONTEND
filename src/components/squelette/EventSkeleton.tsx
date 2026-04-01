import { Calendar, MapPin, Users } from "lucide-react";

export function EventsSkeleton() {
    //tableau de 4 éléments pour remplir la grille initiale
    const skeletonCards = Array.from({ length: 4 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skeletonCards.map((_, index) => (
                <div key={index} className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm animate-pulse">
                    
                    {/* Zone Image (Squelette) */}
                    <div className="aspect-video w-full bg-zinc-200" />

                    <div className="p-5 space-y-4">
                        {/* En-tête : Titre + Badge (Squelette) */}
                        <div className="flex justify-between items-start gap-2">
                            <div className="space-y-2 w-full">
                                <div className="h-5 bg-zinc-200 rounded w-3/4" /> {/* Titre */}
                                <div className="h-3 bg-zinc-100 rounded w-1/2" /> {/* Organisateur */}
                            </div>
                            <div className="h-6 w-16 bg-zinc-200 rounded-md" /> {/* Bouton Suivre */}
                        </div>

                        {/* Description (Squelette) */}
                        <div className="space-y-2">
                            <div className="h-3 bg-zinc-100 rounded w-full" />
                            <div className="h-3 bg-zinc-100 rounded w-5/6" />
                        </div>

                        {/* Infos pratiques (Icônes + Squelette) */}
                        <div className="pt-2 space-y-3 border-t border-zinc-50">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-zinc-200" />
                                <div className="h-3 bg-zinc-100 rounded w-1/3" />
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-zinc-200" />
                                <div className="h-3 bg-zinc-100 rounded w-1/4" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-zinc-200" />
                                <div className="h-3 bg-zinc-100 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}