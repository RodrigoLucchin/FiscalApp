import { ArrowLeftRight, Package, DollarSign, Repeat, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Sistema Futuro", url: "/app", icon: ArrowLeftRight },
  { title: "Controle de Seriais", url: "/controle-seriais", icon: Package },
  { title: "Custos", url: "/custos", icon: DollarSign },
  { title: "Sistema de Transferência", url: "/transferencia", icon: Repeat, comingSoon: true },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar 
      className="bg-[#2d2d2d] border-r border-border/40"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Trigger alinhado como item do menu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="text-sidebar-foreground hover:bg-sidebar-accent/50 w-full flex items-center">
                    <SidebarTrigger className="p-0 h-auto w-4 border-0 bg-transparent hover:bg-transparent" />
                    {open && <span className="ml-2">Recolher</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.comingSoon ? (
                      <div className="text-sidebar-foreground/50 cursor-not-allowed flex items-center">
                        <item.icon className="w-4 h-4" />
                        {open && (
                          <span className="flex items-center gap-2">
                            {item.title}
                            <span className="text-xs bg-sidebar-accent/50 px-1.5 py-0.5 rounded text-sidebar-foreground/70">
                              EM BREVE
                            </span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
