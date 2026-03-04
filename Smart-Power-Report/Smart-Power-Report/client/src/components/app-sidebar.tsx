import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Activity, LayoutDashboard, Info, Zap } from "lucide-react";

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar variant="sidebar" collapsible="none" className="border-r border-white/5 bg-card/50 backdrop-blur-xl">
      <SidebarHeader className="p-6 border-b border-white/5 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-white leading-tight">SmartPower</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">System Controller</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase font-mono tracking-widest text-muted-foreground/70 mb-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location === "/"}
                  className="rounded-lg transition-all duration-200 hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                >
                  <Link href="/">
                    <LayoutDashboard className="w-5 h-5 mr-2 opacity-70" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={location === "/about"}
                  className="rounded-lg transition-all duration-200 hover:bg-white/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium"
                >
                  <Link href="/about">
                    <Info className="w-5 h-5 mr-2 opacity-70" />
                    <span>About Project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground/70 font-mono">
          <Activity className="w-4 h-4 text-success animate-pulse-slow" />
          <span>System Online</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
