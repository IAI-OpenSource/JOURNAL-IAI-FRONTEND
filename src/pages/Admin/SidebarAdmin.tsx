import  { useState } from "react";
import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import {
  Plus,
  Users,
  ChevronRight,
  ChevronLeft,
  School,
  GalleryHorizontalEnd,
  History,
  ChartPie,
  LayoutDashboard, 
  ScrollText,
} from "lucide-react";
import { IoMdSchool } from "react-icons/io";
import { GiToken } from "react-icons/gi";
import { BiSolidDashboard } from "react-icons/bi";
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
            <BiSolidDashboard className="w-6 h-6" />{" "}
          </button> 
          
          <div className="flex-1 flex flex-col space-y-5 mt-8">

            
            <Link to="/general">

          
              <button
                className={`p-3  rounded-xl transition-all duration-500 shadow-sm`}
              >
                <GalleryHorizontalEnd className="w-6 h-6" />
               
              </button>
             
            </Link>
           
            <button
              className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}
            >
               <School className="w-6 h-6" />
            </button>
            
            <button
              className={`p-3 rounded-xl  transition-all duration-500 shadow-sm`}
            >
               <History className="w-6 h-6" />
            </button>
          
          </div>
        
          <div className="flex flex-col space-y-5">
           
           
           
            <button
              className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}
            >
               <ChartPie className="w-6 h-6" />
            </button>
            
             <button
              className={`p-3 rounded-xl transition-all duration-500 shadow-sm`}
            >
            <Users className="w-6 h-6" />
            </button>
          
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
            
            <Link to="/general">
             
              <button
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-500 text-sm shadow-sm`}
              >
                 <LayoutDashboard className="w-5 h-5" />
                <span>Tableau de bord</span>
              </button>

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
               
                <Link to="/AddElevesToSchool">
                 
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm`}
                  >
                     <Plus className="w-4 h-4" />
                    <span>Les élèves</span>
                   
                  </button>
                  
                </Link>
                
                <Link to="/GestionsDesEleves">
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg  transition-all duration-500 text-sm`}
                  >
                    <ScrollText className="w-4 h-4" />
                     <span>Gestions des Elèves</span>
                 
                  </button>
                  
                </Link>
                
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
                  Gestions des Jeton
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
                
                <Link to="/CreateAnnee">
                
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg  transition-all duration-500 text-sm`}
                  >
                     <Plus className="w-4 h-4" />
                    <span>Créer une année année </span>
                  </button>
                 
                </Link>
                
                <Link to="/AllAnnee">
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-500 text-sm`}
                  >
                    <ScrollText className="w-4 h-4" />
                    <span>Liste des Années </span>
                 
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
