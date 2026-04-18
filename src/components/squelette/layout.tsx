import { Outlet, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import AppSidebar from "./appSidebar";
import SidebarAdmin from "../../pages/Admin/SidebarAdmin";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import type { ReadUser } from "@/types/user";

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState<ReadUser | null>(null);

  // Chemins qui déclenchent la Sidebar Admin
  const isAdminPath = ["/admin", "/annees-academiques", "/classeListe", "/general"].some(path =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    userService.getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  // Redirection automatique des admins vers leur Dashboard s'ils arrivent sur la racine
  if (location.pathname === "/" && user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  // Si on est sur une route admin et que l'user est ADMIN (optionnel mais recommandé)
  // Pour l'instant on se base sur l'URL comme demandé pour le switch
  if (isAdminPath && user?.role === "ADMIN") {
    return (
      <div className="flex bg-background h-screen overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 min-h-screen overflow-y-auto bg-background"
        style={{ marginLeft: "16rem" }}>
        <main className="h-full p-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


