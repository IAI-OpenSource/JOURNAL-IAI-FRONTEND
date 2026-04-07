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
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import {
  Home,
  Search,
  Bell,
  User,
  Users,
  CalendarDays,
  //Image,
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
];

export default function AppSidebar() {
  const { /*isMobile,*/ state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* ── Header ── */}
      <SidebarHeader className="px-4 pt-5 pb-4">
        <div className="flex items-start justify-between w-full gap-3">
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
          <SidebarTrigger className="mt-1" />
        </div>
      </SidebarHeader>

      <SidebarContent>

        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase text-muted-foreground/60 px-4 mb-1">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={isCollapsed ? 'px-2 space-y-2' : ''}>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={isCollapsed ? 'justify-center px-2' : ''}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center ${isCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-4 py-2'} rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className={`${isCollapsed ? '!w-8 !h-8' : 'w-4 h-4'} shrink-0`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        
        <SidebarGroup className="mt-2">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs uppercase text-muted-foreground/60 px-4 mb-1">
              Explorer
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={isCollapsed ? 'px-2 space-y-2' : ''}>
              {exploreItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={isCollapsed ? 'justify-center px-2' : ''}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center ${isCollapsed ? 'justify-center px-2 py-2' : 'gap-3 px-4 py-2'} rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`
                      }
                    >
                      <item.icon className={`${isCollapsed ? '!w-8 !h-8' : 'w-4 h-4'} shrink-0`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        
        <SidebarGroup className={`mt-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          <Button
            asChild
            className={`w-full gap-2 bg-foreground text-background hover:bg-foreground/90 font-semibold ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
          >
            <NavLink to="/creer-publication" className={isCollapsed ? 'flex justify-center p-2' : 'flex items-center gap-2'}>
              <PlusSquare className={`${isCollapsed ? 'w-6 h-6' : 'w-4 h-4'}`} />
              {!isCollapsed && "Créer une publication"}
            </NavLink>
          </Button>
        </SidebarGroup>
      </SidebarContent>

      
      <SidebarFooter className={`${isCollapsed ? 'px-2' : 'px-4'} py-4 border-t border-border`}>
        <NavLink
          to="/profil"
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} rounded-md p-2 hover:bg-accent/50 transition-colors`}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="/avatar-placeholder.png" alt="marie.kouassi" />
            <AvatarFallback className="bg-violet-200 text-violet-800 text-xs font-bold">
              MK
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">marie.kouassi</span>
              <span className="text-xs text-muted-foreground">L3 Informatique</span>
            </div>
          )}
        </NavLink>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}