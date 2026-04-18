import  { useState } from "react";
import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import {
  ChevronRight,
  ChevronLeft,
  ScrollText,
} from "lucide-react";
import { IoMdSchool } from "react-icons/io";
import { GiToken } from "react-icons/gi";
import { BiSolidDashboard } from "react-icons/bi";
import { FaOpencart } from "react-icons/fa";
import { useEffect } from "react";
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
    <div className="flex h-screen">

        
      {isCollapsed ? (
        <div
          className={`w-20 rounded-3xl m-4 p-4 flex flex-col items-center space-y-6 shadow-lg`}
        >

         
          <button
            onClick={() => handleCollapse(false)}
            className={`p-3  rounded-xl transition-all duration-500 shadow-sm`}
          >
            <FaOpencart className="w-6 h-6" />{" "}
          </button> 
          
          <div className="flex-1 flex flex-col space-y-5 mt-8">
            {/* 1. Dashboard */}
            <Link to="/admin/dashboard">
              <button className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}>
                <BiSolidDashboard className="w-6 h-6" />
              </button>
            </Link>
           
            {/* 2. Accueil */}
            <Link to="/accueil">
              <button className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}>
                <IoHomeSharp className="w-6 h-6" />
              </button>
            </Link>

            {/* 3. Année Académique */}
            <Link to="/annees-academiques">
              <button className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}>
                <GiToken className="w-6 h-6" />
              </button>
            </Link>

            {/* 4. Liste des Classes */}
            <Link to="/classeListe">
              <button className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}>
                <IoMdSchool className="w-6 h-6" />
              </button>
            </Link>
          </div>
        
          <div className="flex flex-col space-y-5">
            {/* Utilisateur - Profil */}
            <Link to="/profil">
              <button className={`p-1 rounded-full transition-all duration-500 shadow-sm overflow-hidden`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar_url || undefined} alt={user?.username || "avatar"} />
                  <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </Link>
          </div>
         
        </div>
      ) : (
        <div className="w-80 rounded-3xl m-4 p-6 overflow-y-auto relative shadow-2xl transition-all duration-500">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
           
            <div className="flex items-center space-x-3">
             <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">J</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-base tracking-tight">
                Journal IAI
              </span>
            )}
          </div>
              
             
            </div>
            
            <button
              onClick={() => handleCollapse(true)}
              className={`p-2 rounded-lg transition-all duration-500`}
            >
               <ChevronLeft className="w-5 h-5" />
            </button>
            
          </div>
           {/* Navigation */}
          <nav className="space-y-2">
            
            <Link to="/admin/dashboard">
             
              <button
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm`}
              >
                 <BiSolidDashboard className="w-5 h-5" />
                <span>Tableau de bord</span>
              </button>
            </Link>

            <Link to="/accueil">
              <button
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg  transition-all duration-500 text-sm shadow-sm`}
            >
               <IoHomeSharp  className="w-5 h-5" />
              <span>Acceuil</span>
            </button>
            </Link>
              
            {/* Eleves */}
            <button
              onClick={() => toggleSection("Classes")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-500 text-sm shadow-sm`}
              style={{ backgroundColor: "#000000" }}
            >
             
              <div className="flex items-center space-x-3">
               
                <IoMdSchool
                  className="w-5 h-5"
                  style={{ color: "#ffffff" }}
                />
              
                <span className="text-sm font-medium text-white">
                 Les classes
                </span>
               
              </div>
            
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  expandedSections.Classes ? "rotate-90" : ""
                }`}
             
              />
              
            </button>
            
            {expandedSections.Classes && (
              <div className="ml-8 mt-1 space-y-1">
               
                <Link to="/classeListe">
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg  transition-all duration-500 text-sm`}
                  >
                    <ScrollText className="w-4 h-4" />
                     <span>Liste des Classes</span>
                  </button>
                  
                </Link>
                
                {/* <Link to="/AddElevesToSchool">
                 
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm`}
                  >
                     <Plus className="w-4 h-4" />
                    <span>Inscrire des élèves</span>
                   
                  </button>
                  
                </Link> */}
                
              </div>
            )}
            {/* Années  */}
            <button
              onClick={() => toggleSection("AllAnnee")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg  transition-all duration-500 text-sm shadow-sm`}
            >
              
              <div className="flex items-center space-x-3">
                <GiToken className="w-5 h-5" />
               
                <span className="text-sm font-medium">
                  Années Académiques
                </span>
               
              </div>
              
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  expandedSections.AllAnnee ? "rotate-90" : ""
                }`}
              />
              
            </button>
            
            {expandedSections.AllAnnee && (
              <div className="ml-8 mt-1 space-y-1">
                
                {/* Le lien vers la création a été supprimé car la page Liste & Création gère déjà la création via un modal */}
                
                <Link to="/annees-academiques">
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm`}
                  >
                    <ScrollText className="w-4 h-4" />
                    <span>Liste & Création</span>
                  </button>
                 
                </Link>
               
              </div>
            )}
             {/* Classes */}
            {/* <button
              onClick={() => toggleSection("Classes")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-500 text-sm shadow-sm`}
            >
              
              <div className="flex items-center space-x-3">
                 <School className="w-5 h-5" />
                <span className="text-sm font-medium">Les classes</span>
              
              </div>
              
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  expandedSections.Classes ? "rotate-90" : ""
                }`}
              />
              
            </button>
          
            {expandedSections.Classes && (
              <div className="ml-8 mt-1 space-y-1">
               
                <Link to="/CreateClasse">
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm`}
                  >
                     <Plus className="w-4 h-4" />
                     <span>Créer une classe</span>
                  </button>
                  
                </Link>
                
                <Link to="/GestionClasses">
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg  transition-all duration-500 text-sm`}
                  >
                 <ScrollText className="w-4 h-4" />
                    <span>Liste des classes</span>
                    
                  </button>
                 
                </Link>
               
              </div>
            )}
            */}
            
{/*             
            <Link to="/statistiques">
              
              <button
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg  transition-all duration-500 text-sm shadow-sm`}
              >
                <ChartPie className="w-5 h-5" />
                <span>Statistiques</span>
              </button>
              
            </Link> */}
            
            {/* <Link to="/Parametres">
            
              <button
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg  transition-all duration-500 text-sm shadow-sm`}
              >
                 <Settings className="w-5 h-5" />
                <span>Paramètres</span>
              </button>
             
            </Link> */}
            
          </nav>
          
        </div>
      )}
    
    </div>
  );
}

export default SidebarAdmin;
