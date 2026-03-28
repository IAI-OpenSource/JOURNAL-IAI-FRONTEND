import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import {
  Home,
  Search,
  Bell,
  User,
  Users,
  CalendarDays,
  Image,
  PlusSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: NavItem[] = [
  { title: "Accueil",       url: "/accueil",       icon: Home },
  { title: "Rechercher",    url: "/rechercher",    icon: Search },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profil",        url: "/profil",        icon: User },
];

const exploreItems: NavItem[] = [
  { title: "Clubs",      url: "/clubs",      icon: Users },
  { title: "Événements", url: "/evenements", icon: CalendarDays },
  { title: "Galerie",    url: "/galerie",    icon: Image },
];

export default function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      {/* ── Header ── */}
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="font-semibold text-base tracking-tight">
            Journal IAI
          </span>
        </div>
      </SidebarHeader>

      {/* ── Content ── */}
      <SidebarContent>
        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground/60 px-4 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Explorer */}
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground/60 px-4 mb-1">
            Explorer
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {exploreItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Créer une publication */}
        <SidebarGroup className="mt-4 px-4">
          <Button
            asChild
            className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90 font-semibold"
          >
            <NavLink to="/creer-publication">
              <PlusSquare className="w-4 h-4" />
              Créer une publication
            </NavLink>
          </Button>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer : utilisateur connecté ── */}
      <SidebarFooter className="px-4 py-4 border-t border-border">
        <NavLink
          to="/profil"
          className="flex items-center gap-3 rounded-md p-2 hover:bg-accent/50 transition-colors"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar-placeholder.png" alt="marie.kouassi" />
            <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
              MK
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">marie.kouassi</span>
            <span className="text-xs text-muted-foreground">L3 Informatique</span>
          </div>
        </NavLink>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}