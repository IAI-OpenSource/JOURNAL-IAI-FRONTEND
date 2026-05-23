import { NavLink } from "react-router-dom";
import { useSidebar } from "../ui/sidebar";
import {
  Home,
  Search,
  Bell,
  User,
  Users,
  CalendarDays,
  PlusSquare,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import type { ReadUser } from "@/types/user";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const exploreItems: NavItem[] = [
  { title: "Clubs",      url: "/clubs",      icon: Users },
  { title: "Événements", url: "/evenements", icon: CalendarDays },
];

export default function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [user, setUser] = useState<ReadUser | null>(null);

  useEffect(() => {
    userService
      .getCurrentUser()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        const status = err?.response?.status ?? err?.status;
        if (status !== 401 && status !== 404) {
          console.error("Erreur chargement profil sidebar:", err);
        }
      });
  }, []);

  // Détermination des items de menu dynamiques
  const menuItems: NavItem[] = [
    { title: "Accueil",       url: "/accueil",       icon: Home },
  ];

  // Si Admin, on insère le Dashboard juste après Accueil
  if (user?.role === "ADMIN") {
    menuItems.push({ title: "Tableau de bord", url: "/admin", icon: LayoutDashboard });
  }

  // Autres items standards
  menuItems.push(
    { title: "Rechercher",    url: "/rechercher",    icon: Search },
    { title: "Notifications", url: "/notifications", icon: Bell },
    { title: "Profil",        url: "/profil",        icon: User }
  );

  const initials = user
    ? user.username.substring(0, 2).toUpperCase()
    : "??";

  const classeDisplay = user?.classe?.name ?? "Classe non renseignée";

  return (
    <div className="flex h-screen bg-transparent z-50">
      {isCollapsed ? (
        <div className="w-20 rounded-3xl m-4 p-4 flex flex-col items-center shadow-lg bg-white transition-all duration-500 h-[calc(100vh-2rem)] justify-between">
          <div className="flex flex-col items-center space-y-6 w-full">
            {/* Logo statique */}
          <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">J</span>
          </div>

          {/* Bouton d'ouverture très visible */}
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl transition-all duration-500 bg-amber-400 hover:bg-amber-500 text-gray-900 border border-amber-300 hover:border-amber-400 shadow-sm flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95"
            title="Ouvrir la sidebar"
          >
            <ChevronRight className="w-5 h-5 font-bold" />
          </button>
          
          <div className="flex-1 flex flex-col space-y-5 mt-8 w-full items-center">
            {menuItems.map((item) => (
              <NavLink key={item.title} to={item.url}>
                {({ isActive }) => (
                  <button className={`p-3 rounded-xl transition-all duration-500 shadow-sm ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <item.icon className="w-6 h-6" />
                  </button>
                )}
              </NavLink>
            ))}
            
            <div className="w-full h-px bg-gray-200 my-2" />
            
            {exploreItems.map((item) => (
              <NavLink key={item.title} to={item.url}>
                {({ isActive }) => (
                  <button className={`p-3 rounded-xl transition-all duration-500 shadow-sm ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <item.icon className="w-6 h-6" />
                  </button>
                )}
              </NavLink>
            ))}
          </div>
          </div>

          <div className="flex flex-col space-y-5 items-center mt-auto w-full">
            <NavLink to="/creer-publication">
              <button className="p-3 rounded-xl transition-all duration-500 shadow-sm bg-black text-white hover:bg-gray-800">
                <PlusSquare className="w-6 h-6" />
              </button>
            </NavLink>
            <NavLink to="/profil">
              <button className="p-1 rounded-full transition-all duration-500 shadow-sm overflow-hidden hover:opacity-80">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar_url || undefined} alt={user?.username || "avatar"} />
                  <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </NavLink>
          </div>
        </div>
      ) : (
        <div className="w-80 rounded-3xl m-4 p-6 overflow-y-auto relative shadow-2xl bg-white transition-all duration-500 flex flex-col justify-between h-[calc(100vh-2rem)]">
          <div className="flex-1 flex flex-col">
            {/* Header */}
          <div className="flex items-center justify-between mb-10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="font-semibold text-base tracking-tight text-gray-900">
                Journal IAI
              </span>
            </div>
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg transition-all duration-500 hover:bg-gray-100 text-gray-600 cursor-pointer"
            >
               <span className="sr-only">Toggle Sidebar</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Menu</div>
            
            {menuItems.map((item) => (
              <NavLink key={item.title} to={item.url}>
                {({ isActive }) => (
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm mb-2 ${
                      isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                )}
              </NavLink>
            ))}

            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-2">Explorer</div>
            
            {exploreItems.map((item) => (
              <NavLink key={item.title} to={item.url}>
                {({ isActive }) => (
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm mb-2 ${
                      isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                )}
              </NavLink>
            ))}
            </nav>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 space-y-4 shrink-0">
            <NavLink to="/creer-publication">
              <button className="w-full flex items-center justify-center space-x-2 px-3 py-3 rounded-lg transition-all duration-500 text-sm shadow-sm bg-black text-white hover:bg-gray-800 font-semibold">
                <PlusSquare className="w-5 h-5" />
                <span>Créer une publication</span>
              </button>
            </NavLink>

            <div className="pt-4 border-t border-gray-100">
              <NavLink to="/profil">
                <button className="w-full flex items-center space-x-3 px-2 py-2 rounded-lg transition-all duration-500 hover:bg-gray-100">
                  <Avatar className="w-10 h-10 shadow-sm border border-gray-100">
                    <AvatarImage src={user?.avatar_url || undefined} alt={user?.username || "avatar"} />
                    <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-900 leading-tight">
                      {user?.username ?? "Utilisateur"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {classeDisplay}
                    </span>
                  </div>
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}