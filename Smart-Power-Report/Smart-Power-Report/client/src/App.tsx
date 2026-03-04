import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NotFound from "@/pages/not-found";

// Components & Pages
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import { Menu } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/about" component={About}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/30">
            <AppSidebar />
            
            <div className="flex flex-col flex-1 w-full overflow-hidden relative">
              {/* Mobile Header with Trigger */}
              <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="font-display font-bold text-lg tracking-tight">SmartPower</div>
                <SidebarTrigger>
                  <Menu className="w-6 h-6 text-white" />
                </SidebarTrigger>
              </header>
              
              {/* Top ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

              <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 relative">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
