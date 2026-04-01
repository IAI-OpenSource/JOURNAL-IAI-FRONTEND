import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Calendar, Bell, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotifType, NotificationDTO } from "@/types/notifications";


type TabKey = "toutes" | "non_lues" | "lues";

interface Tab {
  key: TabKey;
  label: (notifs: NotificationDTO[]) => string;
}

//ici c pour centraliser les endpoints a brancher avec le back
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";
//Get
const ENDPOINTS = {
  getAll:       () => `${API_BASE_URL}/notifications`,

  //marquer une notif comme non lue
  markOneRead:  (id: number) => `${API_BASE_URL}/notifications/${id}/read`,

  //marque toutes les notifs comme lues
  markAllRead:  () => `${API_BASE_URL}/notifications/read-all`,
};

/*donnéés statiqeues comme sur la maquutees pour tester le rendu , j'ai utiliser les lettres
pour faire les photos de profils */
const MOCK_NOTIFS: NotificationDTO[] = [
  {
    id: 1,
    type: "like",
    auteur: "kofi.mensah",
    message: "a aimé votre publication",
    date: "21 mars à 09:30",
    lue: false,
  },
  {
    id: 2,
    type: "comment",
    auteur: "amina.diallo",
    message: "a commenté votre publication",
    date: "21 mars à 08:15",
    lue: false,
  },
  {
    id: 3,
    type: "event",
    auteur: "kofi.mensah",
    message: "a créé un nouvel événement : Hackathon IAI 2026",
    date: "20 mars à 16:00",
    lue: true,
  },
];

//des que le back sera pret a etre brancher on va tout decommenter
// recuperer les notifs depuis l'API
// on aura a appeler dans le useEffect en dessous a la place du setNotifs(MOCK_NOTIFS)
async function fetchNotifications(): Promise<NotificationDTO[]> {
  // const res = await fetch(ENDPOINTS.getAll(), {
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     "Content-Type": "application/json",
  //   },
  // });
  // if (!res.ok) throw new Error("Erreur recup notifs");
  // const data = await res.json();
  // return data; // on aura a adapter si le backend wrappe dans data ou je sais pas comment ils nomment ca  { data: [...] } ou autre

  // mock temporaire a virer quand on aura l'endpoint okay!
  return Promise.resolve(MOCK_NOTIFS);
}

// marque une notif comme lue cote back
async function patchMarkOneRead(id: number): Promise<void> {
  // await fetch(ENDPOINTS.markOneRead(id), {
  //   method: "PATCH",
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
  // });

  console.log(`[API stub] PATCH ${ENDPOINTS.markOneRead(id)}`);
}

// marque toutes les notifs comme lues cote back
async function patchMarkAllRead(): Promise<void> {
  // await fetch(ENDPOINTS.markAllRead(), {
  //   method: "PATCH",
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
  // });

  console.log(`[API stub] PATCH ${ENDPOINTS.markAllRead()}`);
}

//les onglets
const TABS: Tab[] = [
  { key: "toutes",   label: (n) => `Toutes (${n.length})` },
  { key: "non_lues", label: (n) => `Non lues (${n.filter(x => !x.lue).length})` },
  { key: "lues",     label: (n) => `Lues (${n.filter(x => x.lue).length})` },
];

function NotifIcon({ type }: { type: NotifType }) {
  if (type === "like")    return <Heart         className="w-4 h-4 text-rose-400" fill="currentColor" />;
  if (type === "comment") return <MessageCircle className="w-4 h-4 text-sky-400" />;
  if (type === "event")   return <Calendar      className="w-4 h-4 text-violet-400" />;
  return null;
}

function getInitiales(username: string): string {
  return username
    .split(/[.\-_]/)
    .map(part => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 2);
}

export default function NotificationPage() {
  const [notifs,    setNotifs]    = useState<NotificationDTO[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>("toutes");
  const [isLoading, setIsLoading] = useState(true);
  const [erreur,    setErreur]    = useState<string | null>(null);

  const nonLuesCount = notifs.filter(n => !n.lue).length;

  const notifsAffichees = notifs.filter(n => {
    if (activeTab === "non_lues") return !n.lue;
    if (activeTab === "lues")     return n.lue;
    return true;
  });

  // chargement initial des notifs
  // quand l'API est prete : fetchNotifications() va appeler le vrai endpoint
  const chargerNotifs = useCallback(async () => {
    try {
      setIsLoading(true);
      setErreur(null);
      const data = await fetchNotifications();
      setNotifs(data);
    } catch (e) {
      setErreur("Impossible de charger les notifications pour l'instant.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerNotifs();
  }, [chargerNotifs]);

  // marque une notif comme lue cote front + appel qu'on fera API back
  const marquerLue = async (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, lue: true } : n));
    await patchMarkOneRead(id);
  };

  // marque toutes comme lues cote front + appel API back
  const toutMarquerLu = async () => {
    setNotifs(prev => prev.map(n => ({ ...n, lue: true })));
    await patchMarkAllRead();
  };

  return (
    <div className="flex flex-col h-full w-full px-8 py-8 max-w-3xl">

      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading
              ? "Chargement..."
              : nonLuesCount > 0
                ? `${nonLuesCount} notification${nonLuesCount > 1 ? "s" : ""} non lue${nonLuesCount > 1 ? "s" : ""}`
                : " Aucun nouveau message"}
          </p>
        </div>

        {nonLuesCount > 0 && !isLoading && (
          <button
            onClick={toutMarquerLu}
            className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-3 py-1.5 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="w-full flex items-center gap-1 p-1 rounded-xl bg-muted my-6">
        {TABS.map(tab => {
          const isActif = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 relative flex items-center justify-center px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer select-none whitespace-nowrap"
            >
              {isActif && (
                <motion.div
                  layoutId="notif-tab-indicator"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-150 ${isActif ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {tab.label(notifs)}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* message d'erreur si le fetch a plante */}
      {!isLoading && erreur && (
        <div className="flex flex-col items-center justify-center flex-1 mt-16 gap-3 text-center">
          <Bell className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">Une erreur est survenue</p>
          <p className="text-xs text-muted-foreground">{erreur}</p>
          <button
            onClick={chargerNotifs}
            className="text-xs underline text-muted-foreground hover:text-foreground transition-colors mt-1"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* liste des notifs */}
      {!isLoading && !erreur && notifsAffichees.length > 0 && (
        <div className="flex flex-col gap-2">
          {notifsAffichees.map(notif => (
            <div
              key={notif.id}
              onClick={() => marquerLue(notif.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors
                ${notif.lue ? "bg-background border-border" : "bg-muted/50 border-border"}
                hover:bg-accent/40`}
            >
              <Avatar className="w-9 h-9 shrink-0">
                {notif.avatarUrl && <AvatarImage src={notif.avatarUrl} alt={notif.auteur} />}
                <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-bold">
                  {getInitiales(notif.auteur)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-sm text-foreground leading-snug">
                  <span className="font-semibold">{notif.auteur}</span>{" "}
                  <span className="text-muted-foreground">{notif.message}</span>
                </p>
                <span className="text-xs text-muted-foreground mt-0.5">{notif.date}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <NotifIcon type={notif.type} />
                {!notif.lue && <span className="w-1.5 h-1.5 rounded-full bg-foreground" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* etat vide */}
      {!isLoading && !erreur && notifsAffichees.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 mt-16 gap-3 text-center">
          <Bell className="w-10 h-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            {activeTab === "non_lues" ? "Aucune notification non lue" :
             activeTab === "lues"     ? "Aucune notification lue" :
             "Aucune notification pour l'instant"}
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            {activeTab === "toutes"
              ? "Les notifs de likes, commentaires et événements apparaîtront ici"
              : "Change d'onglet pour voir les autres notifs"}
          </p>
        </div>
      )}

    </div>
  );
}