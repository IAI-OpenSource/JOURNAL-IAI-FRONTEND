import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import {
  ChevronRight,
  ChevronLeft,
  ScrollText,
} from "lucide-react";
import { IoMdSchool } from "react-icons/io";
import { GiToken } from "react-icons/gi";
import { BiSolidDashboard } from "react-icons/bi";
import { userService } from "@/services/userService";
import type { ReadUser } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExpandedSections {
  AllAnnee: boolean;
  Classes: boolean;
}

type SectionName = keyof ExpandedSections;

function SidebarAdmin() {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    AllAnnee: false,
    Classes: true,
  });

  const [user, setUser] = useState<ReadUser | null>(null);

  useEffect(() => {
    userService.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const initials = user
    ? user.username.substring(0, 2).toUpperCase()
    : "??";

  const toggleSection = (sectionName: SectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleCollapse = (value: boolean) => {
    setIsCollapsed(value);
  };

  return (
    <div className="flex h-screen bg-transparent z-50">
      {isCollapsed ? (
        <div
          className="w-20 rounded-3xl m-4 p-4 flex flex-col items-center space-y-6 shadow-lg bg-white dark:bg-card transition-all duration-500"
        >
          {/* Logo statique */}
          <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white font-bold text-sm">J</span>
          </div>

          {/* Bouton d'ouverture très visible */}
          <button
            onClick={() => handleCollapse(false)}
            className="p-2.5 rounded-xl transition-all duration-500 bg-amber-400 hover:bg-amber-500 text-gray-900 border border-amber-300 hover:border-amber-400 shadow-sm flex items-center justify-center cursor-pointer transform hover:scale-105 active:scale-95"
            title="Ouvrir la sidebar"
          >
            <ChevronRight className="w-5 h-5 font-bold" />
          </button>
          
          <div className="flex-1 flex flex-col space-y-5 mt-8 w-full items-center">
            {/* 1. Dashboard */}
            <NavLink to="/admin/dashboard">
              {({ isActive }) => (
                <button
                  className={`p-3 rounded-xl transition-all duration-500 shadow-sm cursor-pointer ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <BiSolidDashboard className="w-6 h-6" />
                </button>
              )}
            </NavLink>
           
            {/* 2. Accueil */}
            <NavLink to="/accueil">
              {({ isActive }) => (
                <button
                  className={`p-3 rounded-xl transition-all duration-500 shadow-sm cursor-pointer ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <IoHomeSharp className="w-6 h-6" />
                </button>
              )}
            </NavLink>

            {/* 3. Année Académique */}
            <NavLink to="/annees-academiques">
              {({ isActive }) => (
                <button
                  className={`p-3 rounded-xl transition-all duration-500 shadow-sm cursor-pointer ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <GiToken className="w-6 h-6" />
                </button>
              )}
            </NavLink>

            {/* 4. Liste des Classes */}
            <NavLink to="/classeListe">
              {({ isActive }) => (
                <button
                  className={`p-3 rounded-xl transition-all duration-500 shadow-sm cursor-pointer ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <IoMdSchool className="w-6 h-6" />
                </button>
              )}
            </NavLink>
          </div>
        
          <div className="flex flex-col space-y-5">
            {/* Utilisateur - Profil */}
            <NavLink to="/profil">
              <button className="p-1 rounded-full transition-all duration-500 shadow-sm overflow-hidden hover:opacity-80 cursor-pointer">
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
        <div
          className="w-80 rounded-3xl m-4 p-6 overflow-y-auto relative shadow-2xl bg-white dark:bg-card transition-all duration-500 flex flex-col justify-between h-[calc(100vh-2rem)]"
        >
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white font-bold text-sm">J</span>
                </div>
                <span className="font-semibold text-base tracking-tight text-gray-900 dark:text-white">
                  Journal IAI
                </span>
              </div>
              
              <button
                onClick={() => handleCollapse(true)}
                className="p-2 rounded-lg transition-all duration-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              <NavLink to="/admin/dashboard">
                {({ isActive }) => (
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm cursor-pointer ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <BiSolidDashboard className="w-5 h-5" />
                    <span>Tableau de bord</span>
                  </button>
                )}
              </NavLink>

              <NavLink to="/accueil">
                {({ isActive }) => (
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm cursor-pointer ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <IoHomeSharp className="w-5 h-5" />
                    <span>Accueil</span>
                  </button>
                )}
              </NavLink>
                
              {/* Classes Accordion */}
              <button
                onClick={() => toggleSection("Classes")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm cursor-pointer bg-gray-50 dark:bg-neutral-800/50 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 font-medium"
              >
                <div className="flex items-center space-x-3">
                  <IoMdSchool className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium">Les classes</span>
                </div>
              
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.Classes ? "rotate-90" : ""
                  }`}
                />
              </button>
              
              {expandedSections.Classes && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-100 dark:border-neutral-800 pl-4">
                  <NavLink to="/classeListe">
                    {({ isActive }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm cursor-pointer ${
                          isActive
                            ? "bg-black text-white dark:bg-white dark:text-black font-medium shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <ScrollText className="w-4 h-4" />
                        <span>Liste des Classes</span>
                      </button>
                    )}
                  </NavLink>
                </div>
              )}

              {/* Années Académiques Accordion */}
              <button
                onClick={() => toggleSection("AllAnnee")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm cursor-pointer bg-gray-50 dark:bg-neutral-800/50 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 font-medium"
              >
                <div className="flex items-center space-x-3">
                  <GiToken className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium">Années Académiques</span>
                </div>
                
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedSections.AllAnnee ? "rotate-90" : ""
                  }`}
                />
              </button>
              
              {expandedSections.AllAnnee && (
                <div className="ml-6 mt-1 space-y-1 border-l border-gray-100 dark:border-neutral-800 pl-4">
                  <NavLink to="/annees-academiques">
                    {({ isActive }) => (
                      <button
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm cursor-pointer ${
                          isActive
                            ? "bg-black text-white dark:bg-white dark:text-black font-medium shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <ScrollText className="w-4 h-4" />
                        <span>Liste & Création</span>
                      </button>
                    )}
                  </NavLink>
                </div>
              )}
            </nav>
          </div>

          {/* Footer Profil */}
          <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 mt-6 shrink-0">
            <NavLink to="/profil">
              {({ isActive }) => (
                <button
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-lg transition-all duration-500 cursor-pointer ${
                    isActive ? "bg-gray-100 dark:bg-neutral-800" : "hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <Avatar className="w-10 h-10 shadow-sm border border-gray-100 dark:border-neutral-800">
                    <AvatarImage src={user?.avatar_url || undefined} alt={user?.username || "avatar"} />
                    <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                      {user?.username ?? "Utilisateur"}
                    </span>
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      Administrateur
                    </span>
                  </div>
                </button>
              )}
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarAdmin;
