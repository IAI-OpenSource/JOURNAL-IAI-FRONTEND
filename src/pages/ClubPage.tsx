import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import type { ClubDTO, MembreComiteDTO, RoleClub } from "@/types/club";


//configs pour l'api qui viendra du back
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const ENDPOINTS = {
  // get : tous les clubs + statut suivi de l'user connecte
  getAll:         () => `${API_BASE_URL}/clubs`,

  // get : membres du comité d'un club (president, vice, chef)
  /*appele separé pour avoir les avatars en temps reel ou je sais pas trop , on pourra ajutser
  lorque on devra faire la connexion*/ 
  getComite:      (id: number) => `${API_BASE_URL}/clubs/${id}/membres/roles`,

  // get: nb de membres a jour en temps reel
  getNbMembres:   (id: number) => `${API_BASE_URL}/clubs/${id}/membres/count`,

  // post: suivre un club
  suivre:         (id: number) => `${API_BASE_URL}/clubs/${id}/follow`,

  // delete: ne plus suivre
  desabonner:     (id: number) => `${API_BASE_URL}/clubs/${id}/unfollow`,
};

//donnes statiques quon va retirer apres

const MOCK_CLUBS: ClubDTO[] = [
  {
    id: 1,
    nom: "Club Informatique",
    description: "Communauté des passionnés de code et de technologie.",
    nbMembres: 156,
    suivi: true,
    role: "president",
  },
  {
    id: 2,
    nom: "Bureau BDE",
    description: "Le bureau des étudiants organise tous les événements de l'IAI.",
    nbMembres: 43,
    suivi: true,
    role: "president",
  },
  {
    id: 3,
    nom: "Club Photo",
    description: "Capture et partage des moments de la vie étudiante.",
    nbMembres: 28,
    suivi: false,
    role: "chef_de_club",
  },
];

const MOCK_COMITES: Record<number, MembreComiteDTO[]> = {
  1: [
    { id: 1, username: "kofi.mensah",  role: "president",      avatarUrl: undefined },
    { id: 2, username: "amina.diallo", role: "vice_president",  avatarUrl: undefined },
  ],
  2: [
    { id: 3, username: "marie.kouassi", role: "president",     avatarUrl: undefined },
  ],
  3: [
    { id: 4, username: "jean.akoto",    role: "chef_de_club",  avatarUrl: undefined },
  ],
};

//on aura a decommneter quand le back sera up

async function fetchClubs(): Promise<ClubDTO[]> {
  // const res = await fetch(ENDPOINTS.getAll(), {
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  // if (!res.ok) throw new Error("Erreur recup clubs");
  // return res.json();

  return Promise.resolve(MOCK_CLUBS);
}

// appele pour chaque club au montage qui va recuperer president, vice, chef avec leurs avatars pour les display dans la card
async function fetchComite(clubId: number): Promise<MembreComiteDTO[]> {
  // const res = await fetch(ENDPOINTS.getComite(clubId), {
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  // if (!res.ok) throw new Error("Erreur recup comite");
  // return res.json();

  return Promise.resolve(MOCK_COMITES[clubId] ?? []);
}

// appele pour avoir le nb de membres a jour en temps reel
async function fetchNbMembres(clubId: number): Promise<number> {
  // const res = await fetch(ENDPOINTS.getNbMembres(clubId), {
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });
  // if (!res.ok) throw new Error("Erreur recup nb membres");
  // const data = await res.json();
  // return data.count; // selon ce que le back va  renvoyer

  return Promise.resolve(MOCK_CLUBS.find(c => c.id === clubId)?.nbMembres ?? 0);
}

async function postSuivre(id: number): Promise<void> {
  // await fetch(ENDPOINTS.suivre(id), {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });

  console.log(`[API stub] POST ${ENDPOINTS.suivre(id)}`);
}

async function deleteSuivre(id: number): Promise<void> {
  // await fetch(ENDPOINTS.desabonner(id), {
  //   method: "DELETE",
  //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  // });

  console.log(`[API stub] DELETE ${ENDPOINTS.desabonner(id)}`);
}

//ca c juste pour les profils hein vu que j'ai pas de photos je mets des lettres 
function getInitiales(nom: string): string {
  return nom.split(" ").map(w => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

function getLabelRole(role: RoleClub): string | null {
  if (role === "president")     return "Président";
  if (role === "vice_president") return "Vice-Président";
  if (role === "chef_de_club")  return "Chef de club";
  return null;
}


function ClubCard({
  club,
  comite,
  onToggleSuivi,
}: {
  club: ClubDTO;
  comite: MembreComiteDTO[];
  onToggleSuivi: (id: number) => void;
}) {
  const labelRole = getLabelRole(club.role);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-muted/30">

      {/* header : avatar club + nom + nb membres + bouton suivi */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-9 h-9 shrink-0">
            {club.avatarUrl && <AvatarImage src={club.avatarUrl} alt={club.nom} />}
            <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
              {getInitiales(club.nom)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">{club.nom}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              {club.nbMembres} membres
            </span>
          </div>
        </div>

        {/* bouton suivi */}
        {club.suivi ? (
          <button
            onClick={() => onToggleSuivi(club.id)}
            className="text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1 hover:bg-accent/50 transition-colors shrink-0"
          >
            Suivi
          </button>
        ) : (
          <button
            onClick={() => onToggleSuivi(club.id)}
            className="text-xs bg-foreground text-background rounded-md px-2.5 py-1 hover:bg-foreground/85 transition-colors shrink-0 font-medium"
          >
            Suivre
          </button>
        )}
      </div>

      {/* description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {club.description}
      </p>

      {/* section comité*/}
      {labelRole && comite.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-foreground">Comité</span>

          <div className="flex flex-wrap gap-1.5">
            {comite.map(membre => (
              <div
                key={membre.id}
                className="flex items-center gap-1.5 bg-background border border-border rounded-md px-2 py-1"
              >
                {/* lavatar du membre du comité viendra de l'API coté back pour qu'au cas ou ca change ..... */}
                <Avatar className="w-4 h-4 shrink-0">
                  {membre.avatarUrl && <AvatarImage src={membre.avatarUrl} alt={membre.username} />}
                  <AvatarFallback className="bg-violet-100 text-violet-700 text-[8px] font-bold">
                    {getInitiales(membre.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground">
                  {getLabelRole(membre.role)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClubPage() {
  const [clubs,     setClubs]     = useState<ClubDTO[]>([]);
  const [comites,   setComites]   = useState<Record<number, MembreComiteDTO[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [erreur,    setErreur]    = useState<string | null>(null);

  const chargerClubs = useCallback(async () => {
    try {
      setIsLoading(true);
      setErreur(null);
      const data = await fetchClubs();
      setClubs(data);

      // pour chaque club on charge le comité + nb membres en temps reel en parallele
      const [comitesData, nbMembresData] = await Promise.all([
        Promise.all(data.map(c => fetchComite(c.id).then(m => ({ id: c.id, membres: m })))),
        Promise.all(data.map(c => fetchNbMembres(c.id).then(n => ({ id: c.id, count: n })))),
      ]);

      // on met a jour le nb de membres de chaque club avec la valeur temps reel
      setClubs(prev =>
        prev.map(c => {
          const nb = nbMembresData.find(x => x.id === c.id);
          return nb ? { ...c, nbMembres: nb.count } : c;
        })
      );

      // stocke les comités par id de club
      const comitesMap: Record<number, MembreComiteDTO[]> = {};
      comitesData.forEach(({ id, membres }) => { comitesMap[id] = membres; });
      setComites(comitesMap);

    } catch (e) {
      setErreur("Impossible de charger les clubs pour l'instant.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerClubs();
  }, [chargerClubs]);

  const handleToggleSuivi = async (id: number) => {
    const club = clubs.find(c => c.id === id);
    if (!club) return;

    setClubs(prev => prev.map(c => c.id === id ? { ...c, suivi: !c.suivi } : c));

    if (club.suivi) {
      await deleteSuivre(id);
    } else {
      await postSuivre(id);
    }
  };

  return (
    <div className="flex flex-col h-full w-full px-8 py-8 max-w-3xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Clubs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Rejoignez les clubs étudiants de l'IAI
        </p>
      </div>

      {/* skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
                <Skeleton className="h-6 w-14 rounded-md shrink-0" />
              </div>
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* erreur */}
      {!isLoading && erreur && (
        <div className="flex flex-col items-center justify-center flex-1 mt-16 gap-3 text-center">
          <Users className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">Une erreur est survenue</p>
          <p className="text-xs text-muted-foreground">{erreur}</p>
          <button
            onClick={chargerClubs}
            className="text-xs underline text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* grille clubs */}
      {!isLoading && !erreur && clubs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clubs.map(club => (
            <ClubCard
              key={club.id}
              club={club}
              comite={comites[club.id] ?? []}
              onToggleSuivi={handleToggleSuivi}
            />
          ))}
        </div>
      )}

      {/* etat vide */}
      {!isLoading && !erreur && clubs.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 mt-16 gap-3 text-center">
          <Users className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">Aucun club pour l'instant</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Les clubs créés par les étudiants apparaîtront ici
          </p>
        </div>
      )}

    </div>
  );
}