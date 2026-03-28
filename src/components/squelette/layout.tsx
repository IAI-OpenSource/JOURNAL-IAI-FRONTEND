import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import AppSidebar from "./appSidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 min-h-screen overflow-y-auto bg-background">
        <main className="h-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}