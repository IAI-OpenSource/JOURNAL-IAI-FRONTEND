import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Users, Hash, Calendar, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type TabKey = "tout" | "utilisateurs" | "posts" | "clubs" | "evenements";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { key: "tout",         label: "Tout",        icon: LayoutGrid },
  { key: "utilisateurs", label: "Utilisateurs", icon: Users },
  { key: "posts",        label: "Posts",        icon: Hash },
  { key: "clubs",        label: "Clubs",        icon: Users },
  { key: "evenements",   label: "Événements",   icon: Calendar },
];

const MAX_REQUESTS   = 10;
const WINDOW_MS      = 30_000;
const DEBOUNCE_MS    = 400;

export default function SearchPage() {

  const [query,         setQuery]         = useState("");
  const [activeTab,     setActiveTab]     = useState<TabKey>("tout");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading,     setIsLoading]     = useState(false);

  // On va  garder un tableau de timestamps des dernières requêtes
  const requestLog = useRef<number[]>([]);

  //la ref pour le debounce timer
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  //on aura a brancher ca a l'api que va fournir les gars du back
  const executeSearch = useCallback((q: string, tab: TabKey) => {
    if (!q.trim()) return; // rien à chercher frère

    const now = Date.now();
    requestLog.current = requestLog.current.filter(t => now - t < WINDOW_MS);

    if (requestLog.current.length >= MAX_REQUESTS) {
      setIsRateLimited(true);
      // On autorise à nouveau après la fin de la fenetre
      const oldest = requestLog.current[0];
      const waitMs = WINDOW_MS - (now - oldest);
      setTimeout(() => setIsRateLimited(false), waitMs);
      return;
    }

    requestLog.current.push(now);
    console.log(`[Search] query="${q}" tab="${tab}"`);
    // ici on frera le fetch vers l'api ou je sais pas si on va utiliser axios
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      executeSearch(query, activeTab);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, activeTab, executeSearch]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    // executeSearch sera déclenché par le useEffect en haut 
  };

  return (
    <div className="flex flex-col h-full w-full px-8 py-8 max-w-3xl">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Recherche</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Trouvez des étudiants, des publications, des clubs et des événements
        </p>
      </div>

      {/*searchbar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          maxLength={100} /* j'ai jugé necessaire de limiter les characteres pour une search mais bon...; */
          className={`
            w-full pl-9 pr-4 py-2 text-sm rounded-md border
            bg-background text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring
            transition-colors
            ${isRateLimited ? "border-red-400 ring-red-300" : "border-border"}
          `}
        />
        {/*ici j'ai mis un message pour au cas ou le rate limit en haut est depaasé on affiche un message */}
        {/* mais je vais le commenter si vous approuvez on de commente */}
        {/*{isRateLimited && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500">
            Trop de recherches d'un coup, attendez...
          </p>
        )}*/}
      </div>

      {/*Onglets filtres*/}
      <div className={`w-full flex items-center gap-1 p-1 rounded-xl bg-muted mb-6 ${isRateLimited ? "mt-6" : ""}`}>
        {TABS.map(tab => {
          const Icon    = tab.icon;
          const isActif = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="flex-1 relative flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer select-none whitespace-nowrap"
            >
              {isActif && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-150 ${isActif ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {tab.key !== "tout" && <Icon className="w-3.5 h-3.5 shrink-0" />}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/*zone resultats*/}
      {!query.trim() && (
        <div className="flex flex-col items-center justify-center flex-1 mt-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Commencez votre recherche
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Entrez des mots-clés pour trouver des utilisateurs, posts, clubs et événements
          </p>
        </div>
      )}

      {/*la zone ou on va dispaly les resluts */}
      {query.trim() && isLoading && (
        <div className="flex flex-col gap-3 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-3 w-1/3 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {query.trim() && !isLoading && (
        <div className="flex-1">
          <p className="text-xs text-muted-foreground text-center mt-16">
            Résultats pour «&nbsp;<span className="font-medium text-foreground">{query}</span>&nbsp;» — à brancher sur l'API 🔌
          </p>
        </div>
      )}
    </div>
  );
}