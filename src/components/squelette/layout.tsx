import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import AppSidebar from "./appSidebar";

export default function Layout() {
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


