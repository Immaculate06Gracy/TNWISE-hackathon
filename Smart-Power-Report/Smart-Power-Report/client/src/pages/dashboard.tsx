import { useState } from "react";
import { format } from "date-fns";
import { 
  useSystemStatus, 
  useUpdateStatus, 
  useSystemEvents, 
  useCreateEvent,
  useClearEvents
} from "@/hooks/use-system";
import { BatteryGauge } from "@/components/battery-gauge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertTriangle, 
  Battery, 
  BatteryCharging, 
  HeartPulse, 
  Monitor, 
  Power, 
  PowerOff, 
  RefreshCw, 
  ShieldAlert, 
  Zap, 
  Trash2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const { data: status, isLoading: statusLoading } = useSystemStatus();
  const { data: events, isLoading: eventsLoading } = useSystemEvents();
  
  const updateStatus = useUpdateStatus();
  const createEvent = useCreateEvent();
  const clearEvents = useClearEvents();

  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateOutage = async () => {
    setIsSimulating(true);
    try {
      await updateStatus.mutateAsync({
        gridStatus: false,
        criticalLoadActive: true,
        nonCriticalLoadActive: false,
        batteryLevel: status ? Math.max(0, status.batteryLevel - 5) : 95 // slightly drain battery
      });
      await createEvent.mutateAsync({
        eventType: "grid_failure",
        message: "Grid power failed. System isolated. Non-critical loads shed via SPDT relay. Running on battery.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRestoreGrid = async () => {
    setIsSimulating(true);
    try {
      await updateStatus.mutateAsync({
        gridStatus: true,
        criticalLoadActive: true,
        nonCriticalLoadActive: true,
        batteryLevel: 100 // Recharge simulation
      });
      await createEvent.mutateAsync({
        eventType: "grid_restored",
        message: "Grid power restored. Synchronized. All loads connected successfully.",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleClearLogs = () => {
    clearEvents.mutate();
  };

  if (statusLoading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-12 w-64 bg-white/5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-40 rounded-2xl bg-white/5" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">System Offline</h2>
        <p className="text-muted-foreground max-w-md">Cannot connect to the central control unit. Please check backend server status.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-white mb-2 flex items-center gap-3">
            System Control Panel
            {!status.gridStatus && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30 animate-pulse">
                EMERGENCY MODE
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm">Real-time monitoring of SPDT relay switching and power routing.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={handleSimulateOutage} 
            disabled={!status.gridStatus || isSimulating}
            variant="outline"
            className="bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all"
          >
            <PowerOff className="w-4 h-4 mr-2" />
            Simulate Grid Failure
          </Button>
          <Button 
            onClick={handleRestoreGrid}
            disabled={status.gridStatus || isSimulating}
            className="bg-success/20 border border-success/50 text-success hover:bg-success hover:text-white transition-all shadow-[0_0_20px_rgba(34,197,94,0.15)]"
          >
            <Power className="w-4 h-4 mr-2" />
            Restore Grid Power
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Grid Status Card */}
        <div className={cn(
          "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
          status.gridStatus ? "glow-success" : "glow-destructive"
        )}>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">Main Grid</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {status.gridStatus ? "ONLINE" : "OFFLINE"}
              </h3>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              status.gridStatus ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive animate-pulse-slow"
            )}>
              {status.gridStatus ? <Zap className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 opacity-5 z-0">
            <Zap className="w-32 h-32" />
          </div>
          <p className="text-xs text-muted-foreground mt-4 relative z-10 flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", status.gridStatus ? "bg-success" : "bg-destructive")} />
            {status.gridStatus ? "230V AC Input Stable" : "0V Input - Utility Failure"}
          </p>
        </div>

        {/* Battery Card */}
        <div className={cn(
          "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
          status.batteryLevel > 20 ? "glow-primary" : "glow-destructive"
        )}>
          <div className="flex justify-between items-center h-full relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono mb-2">Backup Power</p>
              <div className="flex items-center gap-2">
                {status.gridStatus ? (
                  <BatteryCharging className="w-5 h-5 text-primary" />
                ) : (
                  <Battery className={cn("w-5 h-5", status.batteryLevel > 20 ? "text-primary" : "text-destructive")} />
                )}
                <span className="text-sm text-white/80">
                  {status.gridStatus ? "Float Charging" : "Discharging"}
                </span>
              </div>
            </div>
            <BatteryGauge level={status.batteryLevel} />
          </div>
        </div>

        {/* Critical Load Bus */}
        <div className={cn(
          "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
          status.criticalLoadActive ? "glow-success" : "glow-destructive border-dashed"
        )}>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">Critical Bus</p>
              <h3 className="text-xl font-bold text-white mt-1">
                {status.criticalLoadActive ? "CONNECTED" : "DISCONNECTED"}
              </h3>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              status.criticalLoadActive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
            )}>
              <HeartPulse className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground">
            Life Support, O2 Concentrators, Warmers
          </div>
        </div>

        {/* Non-Critical Load Bus */}
        <div className={cn(
          "glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500",
          status.nonCriticalLoadActive ? "border-white/10" : "bg-card/40 border-dashed border-white/20 opacity-70"
        )}>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">General Bus</p>
              <h3 className="text-xl font-bold text-white mt-1">
                {status.nonCriticalLoadActive ? "CONNECTED" : "SHED (ISOLATED)"}
              </h3>
            </div>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              status.nonCriticalLoadActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Monitor className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground">
            Admin Lighting, Office AC, Standard Outlets
          </div>
        </div>

      </div>

      {/* Hardware Diagram Section (Visual Flair) */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <h3 className="text-lg font-display text-white mb-6">SPDT Relay Flow Diagram</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto relative py-8">
          {/* Connection Lines (Background) */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-white/10 -translate-y-1/2 z-0 hidden md:block" />
          
          {/* Source Nodes */}
          <div className="flex flex-col gap-8 z-10 w-full md:w-auto">
            <div className={cn(
              "px-6 py-4 rounded-xl border flex items-center justify-center gap-3 w-48 text-center transition-all",
              status.gridStatus ? "bg-success/10 border-success text-success" : "bg-background border-white/10 text-muted-foreground opacity-50"
            )}>
              <Zap className="w-5 h-5" /> Grid Supply
            </div>
            <div className={cn(
              "px-6 py-4 rounded-xl border flex items-center justify-center gap-3 w-48 text-center transition-all",
              !status.gridStatus ? "bg-primary/10 border-primary text-primary" : "bg-background border-white/10 text-muted-foreground"
            )}>
              <Battery className="w-5 h-5" /> Inverter/Bat
            </div>
          </div>

          {/* Relay Switch */}
          <div className="z-10 relative">
            <div className="w-24 h-24 rounded-full border-4 border-primary bg-background flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <RefreshCw className={cn("w-8 h-8 text-primary", isSimulating ? "animate-spin" : "")} />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-primary font-bold whitespace-nowrap bg-background/80 px-2 py-1 rounded">
              SPDT CONTROLLER
            </div>
          </div>

          {/* Load Nodes */}
          <div className="flex flex-col gap-8 z-10 w-full md:w-auto">
            <div className={cn(
              "px-6 py-4 rounded-xl border flex items-center justify-center gap-3 w-48 text-center transition-all",
              status.criticalLoadActive ? "bg-success/10 border-success text-success" : "bg-destructive/10 border-destructive text-destructive"
            )}>
               Critical Load
            </div>
            <div className={cn(
              "px-6 py-4 rounded-xl border flex items-center justify-center gap-3 w-48 text-center transition-all",
              status.nonCriticalLoadActive ? "bg-primary/10 border-primary text-primary" : "bg-background border-dashed border-white/20 text-muted-foreground"
            )}>
               Non-Critical
            </div>
          </div>
        </div>
      </div>

      {/* Event Logs */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display text-white">System Event Log</h3>
            <p className="text-sm text-muted-foreground">Recent switching operations and fault detections.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClearLogs} className="text-muted-foreground hover:text-white">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Log
          </Button>
        </div>
        
        <div className="p-0">
          <Table>
            <TableHeader className="bg-white/5 hover:bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-[180px] font-mono text-xs uppercase tracking-wider text-muted-foreground">Timestamp</TableHead>
                <TableHead className="w-[150px] font-mono text-xs uppercase tracking-wider text-muted-foreground">Event Type</TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Message / Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventsLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto opacity-50" />
                  </TableCell>
                </TableRow>
              ) : events && events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-mono-numbers text-sm text-muted-foreground">
                      {format(new Date(event.timestamp), "MMM dd, HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex px-2 py-1 rounded text-xs font-medium uppercase font-mono",
                        event.eventType === 'grid_failure' ? "bg-destructive/20 text-destructive" :
                        event.eventType === 'grid_restored' ? "bg-success/20 text-success" :
                        "bg-warning/20 text-warning"
                      )}>
                        {event.eventType.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/80">{event.message}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12 text-muted-foreground font-mono text-sm">
                    No recent events logged. System stable.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

    </div>
  );
}
